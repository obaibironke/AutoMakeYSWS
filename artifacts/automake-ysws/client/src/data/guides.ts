export interface Guide {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  steps: StepItem[];
  modifications: string[];
}

export interface StepItem {
  text: string;
  images?: string[];
}

export const guides: Guide[] = [
  {
    id: "starter",
    title: "Build a Slack Bot with n8n",
    difficulty: "Beginner",
    description:
      "Build your first Slack bot using n8n running locally via Docker and exposed to the internet with ngrok. Your bot will respond to any message sent to it in Slack.",
    steps: [
      {
        text: 'Go to `https://api.slack.com/apps` and create a new app. Select "Create from scratch", name it "[Your Name]\'s Automake Starter" (or something similar), and select Hack Club as the workspace.',
        images: [
          "/guide-images/starter-guide/image9.png",
          "/guide-images/starter-guide/image44.png",
          "/guide-images/starter-guide/image48.png",
        ],
      },
      {
        text: 'Navigate to "OAuth & Permissions" in the left sidebar. Under "App Home", make sure "Allow users to send Slash commands and messages from the messages tab" is checked.',
        images: [
          "/guide-images/starter-guide/image46.png",
          "/guide-images/starter-guide/image11.png",
        ],
      },
      {
        text: 'Scroll down to "Bot Token Scopes" and add the following scopes: `chat:write`, `im:write`, `im:read`, `im:history`.',
        images: [
          "/guide-images/starter-guide/image12.png",
          "/guide-images/starter-guide/image35.png",
          "/guide-images/starter-guide/image47.png",
        ],
      },
      {
        text: 'Install the app to your workspace by clicking "Install to Workspace" and following the prompts.',
        images: ["/guide-images/starter-guide/image30.png"],
      },
      {
        text: 'Go to `https://ngrok.com`, create a free account, and select "Your Authtoken" from the left menu.',
        images: ["/guide-images/starter-guide/image49.png"],
      },
      {
        text: "In PowerShell, run `winget install ngrok.ngrok` to install ngrok.",
      },
      {
        text: 'Configure your authtoken by running: `& "$env:LOCALAPPDATA\\Microsoft\\WinGet\\Packages\\ngrok.ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\\ngrok.exe" config add-authtoken YOUR_TOKEN_HERE`',
        images: ["/guide-images/starter-guide/image33.png"],
      },
      {
        text: "Claim a free static domain on the ngrok Domains page if one hasn't been assigned yet.",
        images: ["/guide-images/starter-guide/image29.png"],
      },
      {
        text: "In PowerShell, run `ngrok http --domain=YOUR-STATIC-DOMAIN-HERE 5678` to expose port 5678 to the internet.",
        images: ["/guide-images/starter-guide/image43.png"],
      },
      {
        text: "Download and install Docker Desktop from `https://docker.com/products/docker-desktop`. Log in and update WSL when prompted.",
        images: [
          "/guide-images/starter-guide/image45.png",
          "/guide-images/starter-guide/image19.png",
          "/guide-images/starter-guide/image27.png",
          "/guide-images/starter-guide/image42.png",
        ],
      },
      {
        text: "Start n8n locally in PowerShell with: `docker run -d --restart unless-stopped -p 5678:5678 -v n8n_data:/home/node/.n8n -e N8N_EDITOR_BASE_URL=https://YOUR-NGROK-DOMAIN -e WEBHOOK_URL=https://YOUR-NGROK-DOMAIN n8nio/n8n`",
        images: ["/guide-images/starter-guide/image16.png"],
      },
      {
        text: "Make sure Docker is set to start on sign-in so n8n is always available. Then open `http://localhost:5678` and set up your n8n owner account. Grab the free activation key when prompted.",
        images: [
          "/guide-images/starter-guide/image40.png",
          "/guide-images/starter-guide/image1.png",
          "/guide-images/starter-guide/image51.png",
        ],
      },
      {
        text: 'In n8n, add a new credential. Search for "Slack API" and select it. Go back to Slack API → "OAuth & Permissions" and copy your Bot OAuth Token — this is your access token. Your signing secret is found under "Basic Information".',
        images: [
          "/guide-images/starter-guide/image15.png",
          "/guide-images/starter-guide/image50.png",
          "/guide-images/starter-guide/image14.png",
          "/guide-images/starter-guide/image25.png",
          "/guide-images/starter-guide/image7.png",
        ],
      },
      {
        text: 'Add a Slack Trigger node to a new workflow. Set it to trigger "On a new message posted to channel".',
        images: [
          "/guide-images/starter-guide/image6.png",
          "/guide-images/starter-guide/image36.png",
          "/guide-images/starter-guide/image31.png",
          "/guide-images/starter-guide/image26.png",
        ],
      },
      {
        text: "To find your channel ID: open Slack on web or desktop, start a new message with your bot, then click the bot's name and copy the channel ID (it always starts with `D`). Enter this ID in the trigger node.",
        images: [
          "/guide-images/starter-guide/image21.png",
          "/guide-images/starter-guide/image37.png",
          "/guide-images/starter-guide/image13.png",
        ],
      },
      {
        text: "In n8n, go to your trigger node → Webhook URLs → Production URL and copy it.",
        images: ["/guide-images/starter-guide/image4.png"],
      },
      {
        text: 'Navigate out of the node and click "Publish" to activate the workflow.',
        images: ["/guide-images/starter-guide/image32.png"],
      },
      {
        text: 'Go back to Slack API → "Event Subscriptions". Paste the n8n production URL into the "Request URL" field. It should say "Verified" after a few seconds.',
        images: ["/guide-images/starter-guide/image17.png"],
      },
      {
        text: 'Add these bot events under "Subscribe to bot events": `message.im`. Save your changes and reinstall the app.',
        images: ["/guide-images/starter-guide/image41.png"],
      },
      {
        text: 'Add a Slack "Send a Message" node after the trigger node. Connect them.',
        images: [
          "/guide-images/starter-guide/image38.png",
          "/guide-images/starter-guide/image5.png",
          "/guide-images/starter-guide/image2.png",
          "/guide-images/starter-guide/image39.png",
        ],
      },
      {
        text: "Add an If node between the two nodes. Set the condition: `{{ $json.user }}` is equal to your bot's User ID. Wire the False output to the Send Message node. This prevents the bot from responding to its own messages.",
        images: [
          "/guide-images/starter-guide/image3.png",
          "/guide-images/starter-guide/image23.png",
        ],
      },
      {
        text: 'Go to the Slack app and send a message to your bot. In n8n, go to Executions, find the one that just ran, and press "Copy to Editor".',
        images: [
          "/guide-images/starter-guide/image24.png",
          "/guide-images/starter-guide/image28.png",
        ],
      },
      {
        text: 'In the Send Message node, drag the `channel` field from the left input panel into the "Channel by ID" field.',
        images: [
          "/guide-images/starter-guide/image18.png",
          "/guide-images/starter-guide/image8.png",
        ],
      },
      {
        text: 'Set the "Message Text" to whatever you want your bot to say — it can be as simple as "Hi!" or an explanation of the bot.',
        images: ["/guide-images/starter-guide/image22.png"],
      },
      {
        text: 'Add "Include Link to Workflow" as a property and keep it toggled off.',
        images: ["/guide-images/starter-guide/image20.png"],
      },
      {
        text: "Publish your changes and test by sending a message to your bot in Slack. You should get a response back. You've built your first Slack bot!",
      },
    ],
  },
    {
      text: "Tip: If your computer isn't on then your ngrok will not be running and your webhook will not work. If you restart your computer you will need to run `ngrok http --domain=YOUR-STATIC-DOMAIN-HERE 5678` again in order for your webhooks to work."
    }
    modifications: [
      "Make the bot respond differently based on keywords in the message — use an IF node or a Switch node to route different messages to different responses.",
      "Connect an AI node (Hack Club provides free AIs for Hack Clubbers) so the bot generates dynamic responses instead of a fixed reply.",
      "Add a Google Sheets node to log every message the bot receives into a spreadsheet.",
      "Build a command system where messages starting with `/` trigger specific actions.",
      "Add a second workflow that posts a scheduled message to a Slack channel every morning using a Schedule Trigger node.",
    ],
  },
];
