import type { VercelRequest, VercelResponse } from "@vercel/node";
import formidable from "formidable";
import fs from "fs";
import axios from "axios";
import Airtable from "airtable";

const BASE_ID = "appqHPb7zQXJeFYIZ";
const PROJECTS_TABLE = "Projects";
const USERS_TABLE = "Active Users";
const SESSIONS_TABLE = "Work Sessions";
const SHOP_TABLE = "Shop Items";
const ORDERS_TABLE = "Orders";

const airtableFetch = async (path: string, options: RequestInit = {}) => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  return fetch(`https://api.airtable.com/v0/${BASE_ID}/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
};

const airtableTable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID!)
  .table(USERS_TABLE);

/* ─── Admin helpers ──────────────────────────────────────── */

function isAdmin(slackId: string): boolean {
  const admins = (process.env.ADMIN_SLACK_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return admins.includes(slackId);
}

/* ─── Handlers ───────────────────────────────────────────── */

async function handleVerifyAuth(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { code, redirect_uri } = req.body;
  if (!code) return res.status(400).json({ error: "Missing code" });
  try {
    const tokenResponse = await axios.post(
      "https://auth.hackclub.com/oauth/token",
      {
        client_id: process.env.HACK_CLUB_CLIENT_ID,
        client_secret: process.env.HACK_CLUB_CLIENT_SECRET,
        redirect_uri: redirect_uri || process.env.HACK_CLUB_REDIRECT_URI,
        code,
        grant_type: "authorization_code",
      },
    );
    const { access_token } = tokenResponse.data;
    const userResponse = await axios.get(
      "https://auth.hackclub.com/api/v1/me",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );
    const {
      slack_id,
      first_name,
      last_name,
      primary_email,
      verification_status,
      ysws_eligible,
    } = userResponse.data.identity;
    const name = `${first_name} ${last_name}`.trim();
    const isVerified = verification_status === "verified";
    const records = await airtableTable
      .select({ filterByFormula: `{Slack ID} = '${slack_id}'` })
      .firstPage();
    let userRecord;
    if (records.length > 0) {
      userRecord = records[0];
    } else {
      userRecord = await airtableTable.create({
        "Slack ID": slack_id,
        Name: name,
        "Primary Email": primary_email,
        Verified: isVerified ? "Yes" : "No",
        "YSWS Eligible": ysws_eligible ? "Yes" : "No",
        "Credits Earned": 0,
      });
    }
    return res.status(200).json({
      success: true,
      user: {
        slack_id,
        name: userRecord.fields["Name"] || name,
        email: userRecord.fields["Primary Email"] || primary_email,
        verified: userRecord.fields["Verified"] === "Yes",
        credits: userRecord.fields["Credits Earned"] || 0,
      },
    });
  } catch (error: any) {
    console.error(
      "Auth error:",
      error?.response?.data || error?.message || error,
    );
    return res.status(500).json({
      error: "Authentication failed",
      details: error?.response?.data || error?.message || "Unknown error",
    });
  }
}

async function handleGetLeaderboard(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  try {
    const records = await airtableTable
      .select({
        fields: ["Name", "Credits Earned"],
        sort: [{ field: "Credits Earned", direction: "desc" }],
        maxRecords: 50,
      })
      .firstPage();
    const leaderboard = records
      .filter(
        (r) => r.fields["Name"] && r.fields["Credits Earned"] !== undefined,
      )
      .map((r, i) => ({
        rank: i + 1,
        name: r.fields["Name"] as string,
        credits: r.fields["Credits Earned"] as number,
      }));
    return res.status(200).json({ success: true, leaderboard });
  } catch (error: any) {
    console.error("Leaderboard error:", error?.message || error);
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
}

async function handleGetCredits(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST" && req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  const slack_id =
    req.method === "POST" ? req.body?.slack_id : req.query?.slack_id;
  if (!slack_id) return res.status(400).json({ error: "Missing slack_id" });
  try {
    const filter = encodeURIComponent(`{Slack ID} = "${slack_id}"`);
    const url = `${encodeURIComponent(USERS_TABLE)}?filterByFormula=${filter}&fields[]=Credits&fields[]=Projects+Submitted`;
    const airtableRes = await airtableFetch(url);
    const data = await airtableRes.json();
    const record = data.records?.[0];
    if (!record) return res.status(404).json({ error: "User not found" });
    const rawProjectsSubmitted = record.fields["Projects Submitted"];
    const projectsSubmitted = Array.isArray(rawProjectsSubmitted)
      ? rawProjectsSubmitted.length
      : typeof rawProjectsSubmitted === "number"
        ? rawProjectsSubmitted
        : 0;
    return res
      .status(200)
      .json({ credits: record.fields["Credits"] ?? 0, projectsSubmitted });
  } catch (err) {
    console.error("Airtable fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch from Airtable" });
  }
}

async function handleCreateProject(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { slack_id, name, description } = req.body;
  if (!slack_id || !name || !description)
    return res.status(400).json({ error: "Missing required fields" });
  try {
    const userRes = await airtableFetch(
      `${encodeURIComponent(USERS_TABLE)}?filterByFormula=${encodeURIComponent(`{Slack ID} = "${slack_id}"`)}&fields[]=Slack+ID`,
    );
    const userData = await userRes.json();
    const userRecord = userData.records?.[0];
    if (!userRecord) return res.status(404).json({ error: "User not found" });
    const createRes = await airtableFetch(encodeURIComponent(PROJECTS_TABLE), {
      method: "POST",
      body: JSON.stringify({
        fields: {
          "Project Name": name,
          Description: description,
          Status: "Unsubmitted",
          User: [userRecord.id],
        },
      }),
    });
    const createData = await createRes.json();
    if (!createData?.id)
      return res.status(500).json({ error: "Failed to create project" });
    return res.status(200).json({ success: true, recordId: createData.id });
  } catch (err) {
    console.error("Create project error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGetProject(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing project id" });
  try {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(PROJECTS_TABLE)}/${id}`;
    const airtableRes = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` },
    });
    const record = await airtableRes.json();
    if (!record?.id)
      return res.status(404).json({ error: "Project not found" });
    return res.status(200).json({
      project: {
        id: record.id,
        name: record.fields["Project Name"] ?? "",
        description: record.fields["Description"] ?? "",
        status: record.fields["Status"] ?? "Pending Review",
        repoUrl: record.fields["Repo URL"] ?? null,
        howToTest: record.fields["How to test?"] ?? null,
        screenshot: record.fields["Screenshot"] ?? null,
        creditsAwarded: record.fields["Credits Awarded"] ?? null,
        hoursLogged: record.fields["Hours Logged"] ?? null,
        ownerSlackId: record.fields["Slack ID Formula"]?.[0] ?? null,
        reviewerNotes: record.fields["Reviewer's Notes"] ?? null,
      },
    });
  } catch (err) {
    console.error("Failed to fetch project:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGetUserProjects(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { slack_id } = req.body;
  if (!slack_id) return res.status(400).json({ error: "Missing slack_id" });
  try {
    const filter = encodeURIComponent(`{Slack ID Formula} = "${slack_id}"`);
    const url = `${encodeURIComponent(PROJECTS_TABLE)}?filterByFormula=${filter}`;
    const airtableRes = await airtableFetch(url);
    const data = await airtableRes.json();
    const projects = (data.records || []).map((record: any) => ({
      id: record.id,
      name: record.fields["Project Name"] ?? "",
      status: record.fields["Status"] ?? "Unsubmitted",
      creditsAwarded: record.fields["Credits Awarded"] ?? null,
      hoursLogged: record.fields["Hours Logged"] ?? null,
    }));
    return res.status(200).json({ projects });
  } catch (err) {
    console.error("Failed to fetch user projects:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleUpdateProject(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH")
    return res.status(405).json({ error: "Method not allowed" });
  const callerSlackId = req.headers["x-slack-id"] as string;
  if (!callerSlackId)
    return res.status(401).json({ error: "Not authenticated" });
  const { project_id, fields } = req.body;
  if (!project_id || !fields)
    return res.status(400).json({ error: "Missing project_id or fields" });
  try {
    const projectRes = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(PROJECTS_TABLE)}/${project_id}`,
      { headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` } },
    );
    const projectRecord = await projectRes.json();
    const ownerSlackId = projectRecord.fields?.["Slack ID Formula"]?.[0];
    if (!ownerSlackId || ownerSlackId !== callerSlackId)
      return res.status(403).json({ error: "Not authorized" });
    const updateRes = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(PROJECTS_TABLE)}/${project_id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      },
    );
    const updateData = await updateRes.json();
    if (!updateRes.ok)
      return res.status(updateRes.status).json({
        error: updateData.error?.message || "Failed to update project",
      });
    return res.status(200).json({ success: true, fields: updateData.fields });
  } catch (err) {
    console.error("Update project error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleDeleteScreenshot(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Method not allowed" });
  const callerSlackId = req.headers["x-slack-id"] as string;
  if (!callerSlackId)
    return res.status(401).json({ error: "Not authenticated" });
  const { project_id } = req.body;
  if (!project_id)
    return res.status(400).json({ error: "No project_id provided" });
  try {
    const projectRes = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Projects/${project_id}`,
      { headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` } },
    );
    const projectRecord = await projectRes.json();
    const ownerSlackId = projectRecord.fields?.["Slack ID Formula"]?.[0];
    if (!ownerSlackId || ownerSlackId !== callerSlackId)
      return res.status(403).json({ error: "Not authorized" });
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Projects/${project_id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: { Screenshot: null } }),
      },
    );
    const airtableData = await airtableResponse.json();
    if (!airtableResponse.ok)
      return res.status(airtableResponse.status).json({
        error: airtableData.error?.message || "Failed to delete screenshot",
      });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete screenshot error:", error);
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to delete screenshot",
    });
  }
}

async function handleGetSessions(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  const { project_id } = req.query;
  if (!project_id) return res.status(400).json({ error: "Missing project_id" });
  try {
    const filter = encodeURIComponent(
      `FIND("${project_id}", ARRAYJOIN(Project))`,
    );
    const url = `${encodeURIComponent(SESSIONS_TABLE)}?filterByFormula=${filter}`;
    const airtableRes = await airtableFetch(url);
    const data = await airtableRes.json();
    const sessions = (data.records || []).map((record: any) => ({
      id: record.id,
      hours: record.fields["Hours"] ?? 0,
      notes: record.fields["Notes"] ?? "",
      date: record.fields["Date"] ?? "",
      lapseSession: record.fields["Link to Lapse Session"] ?? "",
    }));
    return res.status(200).json({ sessions });
  } catch (err) {
    console.error("Failed to fetch sessions:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleLogSession(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const callerSlackId = req.headers["x-slack-id"] as string;
  if (!callerSlackId)
    return res.status(401).json({ error: "Not authenticated" });
  const { project_id, hours, notes, lapseSession } = req.body;
  if (!project_id || !hours || !notes || !lapseSession)
    return res.status(400).json({ error: "Missing required fields" });
  try {
    const projectRes = await airtableFetch(
      `${encodeURIComponent(PROJECTS_TABLE)}/${project_id}`,
    );
    const projectRecord = await projectRes.json();
    const ownerSlackId = projectRecord.fields?.["Slack ID Formula"]?.[0];
    if (!ownerSlackId || ownerSlackId !== callerSlackId)
      return res.status(403).json({ error: "Not authorized" });
    const sessionRes = await airtableFetch(encodeURIComponent(SESSIONS_TABLE), {
      method: "POST",
      body: JSON.stringify({
        fields: {
          Project: [project_id],
          Hours: Number(hours),
          Notes: notes,
          "Link to Lapse Session": lapseSession,
          Date: new Date().toISOString().split("T")[0],
        },
      }),
    });
    const data = await sessionRes.json();
    if (!data?.id)
      return res.status(500).json({ error: "Failed to log session" });
    return res.status(200).json({
      success: true,
      session: {
        id: data.id,
        hours: data.fields["Hours"],
        notes: data.fields["Notes"],
        date: data.fields["Date"],
        lapseSession: data.fields["Link to Lapse Session"],
      },
    });
  } catch (err) {
    console.error("Log session error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGetShopItems(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  try {
    const url = `${encodeURIComponent(SHOP_TABLE)}?fields[]=Item+Name&fields[]=Item+Description&fields[]=Cost&sort[0][field]=Cost&sort[0][direction]=asc`;
    const airtableRes = await airtableFetch(url);
    const data = await airtableRes.json();
    const items = (data.records || []).map((record: any) => ({
      id: record.id,
      name: record.fields["Item Name"] ?? "",
      description: record.fields["Item Description"] ?? "",
      cost: record.fields["Cost"] ?? 0,
    }));
    return res.status(200).json({ items });
  } catch (err) {
    console.error("Failed to fetch shop items:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handlePurchaseItem(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const slack_id = req.headers["x-slack-id"] as string;
  if (!slack_id) return res.status(401).json({ error: "Not authenticated" });
  const { item_id } = req.body;
  if (!item_id) return res.status(400).json({ error: "Missing item_id" });
  try {
    const [userRes, itemRes] = await Promise.all([
      airtableFetch(
        `${encodeURIComponent(USERS_TABLE)}?filterByFormula=${encodeURIComponent(`{Slack ID} = "${slack_id}"`)}&fields[]=Credits&fields[]=Slack+ID`,
      ),
      airtableFetch(`${encodeURIComponent(SHOP_TABLE)}/${item_id}`),
    ]);
    const userData = await userRes.json();
    const itemData = await itemRes.json();
    const userRecord = userData.records?.[0];
    if (!userRecord) return res.status(404).json({ error: "User not found" });
    if (!itemData?.id) return res.status(404).json({ error: "Item not found" });
    const currentBalance: number = userRecord.fields["Credits"] ?? 0;
    const itemCost: number = itemData.fields["Cost"] ?? 0;
    if (currentBalance < itemCost)
      return res.status(400).json({
        error: "Insufficient credits",
        required: itemCost,
        available: currentBalance,
      });
    const orderRes = await airtableFetch(encodeURIComponent(ORDERS_TABLE), {
      method: "POST",
      body: JSON.stringify({
        fields: {
          Users: [userRecord.id],
          Item: [item_id],
          "Credits Spent": itemCost,
        },
      }),
    });
    const orderData = await orderRes.json();
    if (!orderData?.id)
      return res.status(500).json({ error: "Failed to create order" });
    return res.status(200).json({
      success: true,
      orderId: orderData.id,
      newBalance: currentBalance - itemCost,
    });
  } catch (err) {
    console.error("Purchase error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleUploadToCDN(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const CDN_API_KEY = process.env.CDN_API_KEY;
  if (!CDN_API_KEY)
    return res.status(500).json({ error: "CDN API key not configured" });
  const callerSlackId = req.headers["x-slack-id"] as string;
  if (!callerSlackId)
    return res.status(401).json({ error: "Not authenticated" });
  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];
    const projectId = fields.project_id?.[0];
    if (!file) return res.status(400).json({ error: "No file provided" });
    if (!projectId)
      return res.status(400).json({ error: "No project_id provided" });
    const projectRes = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Projects/${projectId}`,
      { headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` } },
    );
    const projectRecord = await projectRes.json();
    const ownerSlackId = projectRecord.fields?.["Slack ID Formula"]?.[0];
    if (!ownerSlackId || ownerSlackId !== callerSlackId) {
      fs.unlinkSync(file.filepath);
      return res.status(403).json({ error: "Not authorized" });
    }
    const fileBuffer = fs.readFileSync(file.filepath);
    const blob = new Blob([fileBuffer], { type: file.mimetype || "image/png" });
    const formData = new FormData();
    formData.append("file", blob, file.originalFilename || "screenshot.png");
    fs.unlinkSync(file.filepath);
    const cdnResponse = await fetch("https://cdn.hackclub.com/api/v4/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${CDN_API_KEY}` },
      body: formData,
    });
    const cdnData = await cdnResponse.json();
    if (!cdnResponse.ok)
      return res
        .status(cdnResponse.status)
        .json({ error: cdnData.error || "CDN upload failed" });
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Projects/${projectId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: { Screenshot: cdnData.url } }),
      },
    );
    const airtableData = await airtableResponse.json();
    if (!airtableResponse.ok)
      return res.status(airtableResponse.status).json({
        error: airtableData.error?.message || "Failed to save to Airtable",
      });
    return res
      .status(200)
      .json({ url: cdnData.url, id: cdnData.id, filename: cdnData.filename });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Upload failed",
    });
  }
}

/* ─── Admin handlers ─────────────────────────────────────── */

async function handleCheckAdmin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { slack_id } = req.body;
  return res.status(200).json({ isAdmin: isAdmin(slack_id || "") });
}

async function handleAdminGetProjects(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  const callerSlackId = req.headers["x-slack-id"] as string;
  if (!isAdmin(callerSlackId))
    return res.status(403).json({ error: "Not authorized" });
  try {
    const url = `${encodeURIComponent(PROJECTS_TABLE)}?sort[0][field]=Status&sort[0][direction]=asc`;
    const airtableRes = await airtableFetch(url);
    const data = await airtableRes.json();
    const projects = (data.records || []).map((r: any) => ({
      id: r.id,
      name: r.fields["Project Name"] ?? "",
      description: r.fields["Description"] ?? "",
      status: r.fields["Status"] ?? "Unsubmitted",
      ownerName: r.fields["Name (from User)"]?.[0] ?? "",
      ownerSlackId: r.fields["Slack ID Formula"]?.[0] ?? "",
      hoursLogged: r.fields["Hours Logged"] ?? null,
      creditsAwarded: r.fields["Credits Awarded"] ?? null,
      repoUrl: r.fields["Repo URL"] ?? null,
      howToTest: r.fields["How to test?"] ?? null,
    }));
    return res.status(200).json({ projects });
  } catch (err) {
    console.error("Admin get projects error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleAdminReviewProject(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const callerSlackId = req.headers["x-slack-id"] as string;
  if (!isAdmin(callerSlackId))
    return res.status(403).json({ error: "Not authorized" });
  const { project_id, action, status_override, credits_awarded } = req.body;
  if (!project_id || !action)
    return res.status(400).json({ error: "Missing fields" });
  try {
    const newStatus =
      status_override || (action === "approve" ? "Accepted" : "Rejected");
    const fields: Record<string, any> = { Status: newStatus };
    if (action === "approve" && credits_awarded > 0) {
      fields["Credits Awarded"] = Number(credits_awarded);
      const projectRes = await airtableFetch(
        `${encodeURIComponent(PROJECTS_TABLE)}/${project_id}`,
      );
      const projectRecord = await projectRes.json();
      const ownerSlackId = projectRecord.fields?.["Slack ID Formula"]?.[0];
      if (ownerSlackId) {
        const userRes = await airtableFetch(
          `${encodeURIComponent(USERS_TABLE)}?filterByFormula=${encodeURIComponent(`{Slack ID} = "${ownerSlackId}"`)}&fields[]=Credits+Earned`,
        );
        const userData = await userRes.json();
        const userRecord = userData.records?.[0];
        if (userRecord) {
          const currentCredits = userRecord.fields["Credits Earned"] ?? 0;
          await airtableFetch(
            `${encodeURIComponent(USERS_TABLE)}/${userRecord.id}`,
            {
              method: "PATCH",
              body: JSON.stringify({
                fields: {
                  "Credits Earned": currentCredits + Number(credits_awarded),
                },
              }),
            },
          );
        }
      }
    }
    const updateRes = await airtableFetch(
      `${encodeURIComponent(PROJECTS_TABLE)}/${project_id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ fields }),
      },
    );
    const updateData = await updateRes.json();
    if (!updateRes.ok)
      return res
        .status(400)
        .json({ error: updateData.error?.message || "Failed to update" });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Admin review project error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleAdminGetUsers(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  const callerSlackId = req.headers["x-slack-id"] as string;
  if (!isAdmin(callerSlackId))
    return res.status(403).json({ error: "Not authorized" });
  try {
    const url = `${encodeURIComponent(USERS_TABLE)}?fields[]=Name&fields[]=Slack+ID&fields[]=Credits+Earned&sort[0][field]=Credits+Earned&sort[0][direction]=desc`;
    const airtableRes = await airtableFetch(url);
    const data = await airtableRes.json();
    const users = (data.records || []).map((r: any) => ({
      id: r.id,
      name: r.fields["Name"] ?? "",
      slackId: r.fields["Slack ID"] ?? "",
      credits: r.fields["Credits Earned"] ?? 0,
    }));
    return res.status(200).json({ users });
  } catch (err) {
    console.error("Admin get users error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleAdminAwardCredits(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const callerSlackId = req.headers["x-slack-id"] as string;
  if (!isAdmin(callerSlackId))
    return res.status(403).json({ error: "Not authorized" });
  const { target_slack_id, amount } = req.body;
  if (!target_slack_id || !amount)
    return res.status(400).json({ error: "Missing fields" });
  try {
    const userRes = await airtableFetch(
      `${encodeURIComponent(USERS_TABLE)}?filterByFormula=${encodeURIComponent(`{Slack ID} = "${target_slack_id}"`)}&fields[]=Credits+Earned`,
    );
    const userData = await userRes.json();
    const userRecord = userData.records?.[0];
    if (!userRecord) return res.status(404).json({ error: "User not found" });
    const currentCredits = userRecord.fields["Credits Earned"] ?? 0;
    const updateRes = await airtableFetch(
      `${encodeURIComponent(USERS_TABLE)}/${userRecord.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          fields: { "Credits Earned": currentCredits + Number(amount) },
        }),
      },
    );
    const updateData = await updateRes.json();
    if (!updateRes.ok)
      return res.status(400).json({
        error: updateData.error?.message || "Failed to award credits",
      });
    return res
      .status(200)
      .json({ success: true, newBalance: currentCredits + Number(amount) });
  } catch (err) {
    console.error("Admin award credits error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleAdminGetOrders(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  const callerSlackId = req.headers["x-slack-id"] as string;
  if (!isAdmin(callerSlackId))
    return res.status(403).json({ error: "Not authorized" });
  try {
    const url = `${encodeURIComponent(ORDERS_TABLE)}?sort[0][field]=Created&sort[0][direction]=desc`;
    const airtableRes = await airtableFetch(url);
    const data = await airtableRes.json();
    const orders = (data.records || []).map((r: any) => ({
      id: r.id,
      userName: r.fields["User Name"]?.[0] ?? "",
      itemName: r.fields["Item Name"]?.[0] ?? "",
      creditsSpent: r.fields["Credits Spent"] ?? 0,
      date: r.fields["Created"] ?? "",
    }));
    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Admin get orders error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/* ─── Main router ────────────────────────────────────────── */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-slack-id");
  if (req.method === "OPTIONS") return res.status(200).end();

  const route = req.query.route as string;

  switch (route) {
    case "verify-auth":
    case "verifyAuth":
      return handleVerifyAuth(req, res);
    case "get-leaderboard":
    case "getLeaderboard":
      return handleGetLeaderboard(req, res);
    case "get-credits":
    case "getCredits":
      return handleGetCredits(req, res);
    case "create-project":
    case "createProject":
      return handleCreateProject(req, res);
    case "get-project":
    case "getProject":
      return handleGetProject(req, res);
    case "get-user-projects":
    case "getUserProjects":
      return handleGetUserProjects(req, res);
    case "update-project":
    case "updateProject":
      return handleUpdateProject(req, res);
    case "delete-screenshot":
    case "deleteScreenshot":
      return handleDeleteScreenshot(req, res);
    case "get-sessions":
    case "getSessions":
      return handleGetSessions(req, res);
    case "log-session":
    case "logSession":
      return handleLogSession(req, res);
    case "get-shop-items":
    case "getShopItems":
      return handleGetShopItems(req, res);
    case "purchase-item":
    case "purchaseItem":
      return handlePurchaseItem(req, res);
    case "upload-to-cdn":
    case "uploadToCDN":
      return handleUploadToCDN(req, res);
    case "check-admin":
    case "checkAdmin":
      return handleCheckAdmin(req, res);
    case "admin-get-projects":
    case "adminGetProjects":
      return handleAdminGetProjects(req, res);
    case "admin-review-project":
    case "adminReviewProject":
      return handleAdminReviewProject(req, res);
    case "admin-get-users":
    case "adminGetUsers":
      return handleAdminGetUsers(req, res);
    case "admin-award-credits":
    case "adminAwardCredits":
      return handleAdminAwardCredits(req, res);
    case "admin-get-orders":
    case "adminGetOrders":
      return handleAdminGetOrders(req, res);
    default:
      return res.status(404).json({ error: `Unknown route: ${route}` });
  }
}
