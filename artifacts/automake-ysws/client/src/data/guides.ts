export interface Guide {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  steps: string[];
  modifications: string[];
}

export const guides: Guide[] = [
  {
    id: "1",
    title: "Build Your First Make.com Automation",
    difficulty: "Beginner",
    description: "Get started with automation by connecting two apps together using Make.com (formerly Integromat). No coding required.",
    steps: [
      "Create a free account at make.com and log in.",
      "Click 'Create a new scenario' from the dashboard.",
      "Add your first module by clicking the big '+' button — search for 'Gmail' and select 'Watch Emails'.",
      "Authenticate your Gmail account by following the OAuth flow.",
      "Add a second module — try 'Google Sheets' → 'Add a Row' to log each new email.",
      "Map the fields: set the spreadsheet, sheet name, and map email data (subject, sender, date) to columns.",
      "Set the schedule to run every 15 minutes using the clock icon at the bottom.",
      "Click 'Run once' to test the scenario — check your sheet for a new row.",
      "Turn on the scenario with the toggle switch and let it run automatically."
    ],
    modifications: [
      "Add a filter to only log emails from specific senders or with certain keywords.",
      "Add a third module to send a Slack or Discord message when a new email arrives.",
      "Connect to Airtable instead of Google Sheets for a richer database format.",
      "Add error handling modules to catch failures and notify you.",
      "Chain multiple conditions to route emails into different sheets based on category."
    ]
  },
  {
    id: "2",
    title: "Automate WhatsApp Messages with the API",
    difficulty: "Beginner",
    description: "Use the WhatsApp Business API to send automated messages — great for reminders, alerts, and notifications.",
    steps: [
      "Sign up for a Meta Developer account at developers.facebook.com.",
      "Create a new app and add the 'WhatsApp' product to it.",
      "In the WhatsApp settings, find your Phone Number ID and generate a temporary Access Token.",
      "Open a terminal or Replit and install the 'axios' package: npm install axios.",
      "Write a simple Node.js script that sends a POST request to the WhatsApp API endpoint with your token, phone number, and message body.",
      "Test by sending a message to your own WhatsApp number.",
      "To schedule automatic messages, use node-cron to run your function at set intervals.",
      "Deploy your script to a free host like Replit or Railway to keep it running 24/7."
    ],
    modifications: [
      "Build a daily motivational quote sender using a public quotes API.",
      "Create a weather report bot that fetches weather data and texts it to you each morning.",
      "Set up a study reminder that sends messages at scheduled study times.",
      "Add a keyword-based chatbot that responds to incoming messages.",
      "Build a group announcement tool for sending bulk messages to multiple contacts."
    ]
  },
  {
    id: "3",
    title: "Build an IoT Sensor Dashboard with Arduino",
    difficulty: "Intermediate",
    description: "Connect an Arduino to sensors, read real-world data, and display it on a live web dashboard.",
    steps: [
      "Gather your materials: Arduino Uno, USB cable, DHT11 temperature/humidity sensor, jumper wires.",
      "Connect the DHT11 to the Arduino: VCC to 5V, GND to GND, DATA to digital pin 2.",
      "Install the Arduino IDE and the DHT sensor library via the Library Manager.",
      "Write a sketch that reads temperature and humidity from the sensor and prints them to Serial every 5 seconds.",
      "Upload the sketch and verify readings in the Serial Monitor.",
      "Install Node.js and the 'serialport' npm package to read serial data on your computer.",
      "Write a Node.js script that reads the serial output and saves readings to a JSON file.",
      "Create a simple HTML page with Chart.js that fetches the JSON file and displays a live-updating graph.",
      "Run a local server with 'npx serve' and open the dashboard in your browser."
    ],
    modifications: [
      "Add a soil moisture sensor and trigger a relay to water plants automatically.",
      "Log all readings to a Google Sheet using the Sheets API for long-term tracking.",
      "Add a buzzer alarm that sounds when temperature exceeds a threshold.",
      "Build a mobile-friendly dashboard so you can check readings from your phone.",
      "Add multiple sensors and display them as separate charts on the dashboard."
    ]
  },
  {
    id: "4",
    title: "Create an AI Chatbot with OpenAI API",
    difficulty: "Intermediate",
    description: "Build a custom chatbot using the OpenAI API that you can train with a custom system prompt.",
    steps: [
      "Create an account at platform.openai.com and generate an API key.",
      "Create a new project folder and run 'npm init -y' followed by 'npm install openai'.",
      "Write a Node.js script that initializes the OpenAI client with your API key.",
      "Create a system prompt that defines your chatbot's persona and rules (e.g., a study assistant that only answers homework questions).",
      "Build a message loop that keeps conversation history in an array and sends it with each new message.",
      "Add a simple readline interface so you can type messages in the terminal.",
      "Test your bot by having a multi-turn conversation and see how it maintains context.",
      "Create a simple HTML frontend with a chat interface that calls your backend script.",
      "Deploy to Replit or Vercel so anyone can chat with your bot."
    ],
    modifications: [
      "Give the bot a specific personality — a chef, a historian, or a coding mentor.",
      "Add a knowledge base by including relevant text in the system prompt.",
      "Build a bot that can search the web by integrating a search API.",
      "Add voice input/output using the Web Speech API.",
      "Create a subject-specific tutoring bot that quizzes users on a topic."
    ]
  },
  {
    id: "5",
    title: "Build a Full API Integration with Airtable",
    difficulty: "Intermediate",
    description: "Use the Airtable API to build a project tracker that reads, writes, and updates records programmatically.",
    steps: [
      "Create a free Airtable account and build a new base with a 'Projects' table (fields: Name, Status, Due Date, Notes).",
      "Go to airtable.com/account to get your personal API key.",
      "Find your Base ID from the Airtable API documentation page for your base.",
      "Install the 'airtable' npm package: npm install airtable.",
      "Write a script to list all records from the Projects table and log them to the console.",
      "Add a function to create a new record by providing name, status, and due date.",
      "Add a function to update an existing record's status field.",
      "Build a simple CLI (command-line interface) that lets you choose which operation to run.",
      "Add error handling and input validation to your CLI."
    ],
    modifications: [
      "Connect your Airtable base to a Make.com scenario for more automations.",
      "Build a web frontend that shows your projects in a Kanban-style board.",
      "Add a function to delete records older than a certain date.",
      "Create a daily digest that emails you all tasks due this week.",
      "Build a habit tracker that automatically logs whether you completed daily tasks."
    ]
  },
  {
    id: "6",
    title: "Deploy a Serverless API on Vercel",
    difficulty: "Advanced",
    description: "Build and deploy a serverless REST API with authentication, rate limiting, and database integration on Vercel.",
    steps: [
      "Install the Vercel CLI: npm install -g vercel and log in with 'vercel login'.",
      "Create a new project folder with a 'api/' directory — Vercel treats each file here as a serverless function.",
      "Write your first serverless function in api/hello.js that returns JSON: module.exports = (req, res) => res.json({ message: 'Hello!' }).",
      "Run 'vercel dev' to test locally — visit localhost:3000/api/hello.",
      "Add environment variables in the Vercel dashboard for your API keys and database URL.",
      "Connect a PostgreSQL database using Vercel's built-in Postgres or an external provider like Supabase.",
      "Add API key authentication by checking a header in each function and returning 401 if missing.",
      "Implement rate limiting using an in-memory store or Vercel KV to cap requests per IP.",
      "Deploy to production with 'vercel --prod' and test all endpoints."
    ],
    modifications: [
      "Add JWT authentication instead of simple API keys.",
      "Build a REST CRUD API for a specific resource like todos or blog posts.",
      "Add OpenAPI documentation using swagger-jsdoc.",
      "Implement webhook endpoints that other services can call when events happen.",
      "Add caching headers and Vercel's Edge Cache for faster responses."
    ]
  }
];
