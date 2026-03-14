export interface ShopItem {
  id: string;
  name: string;
  category: "Automation Tools" | "Tech & Gadgets" | "Fun & Quirky" | "Learning" | "Milestone Rewards";
  description: string;
  cost: number;
}

export const shopItems: ShopItem[] = [
  // Automation Tools
  {
    id: "1",
    name: "Make.com Pro Subscription",
    category: "Automation Tools",
    description: "One month of Make.com Pro — 10,000 operations, more modules, and priority support.",
    cost: 150
  },
  {
    id: "2",
    name: "Airtable Credits",
    category: "Automation Tools",
    description: "Credits for Airtable Pro features including expanded records, automations, and API access.",
    cost: 100
  },
  {
    id: "3",
    name: "WhatsApp Business API Credits",
    category: "Automation Tools",
    description: "Prepaid message credits for the WhatsApp Business API — send thousands of automated messages.",
    cost: 200
  },
  {
    id: "4",
    name: "AI Credits Pack",
    category: "Automation Tools",
    description: "A bundle of OpenAI or Anthropic API credits to power your AI projects.",
    cost: 120
  },
  {
    id: "5",
    name: "Paid Automation Course",
    category: "Automation Tools",
    description: "Access to a premium Make.com or Zapier course covering advanced workflows and real-world use cases.",
    cost: 180
  },
  // Tech & Gadgets
  {
    id: "6",
    name: "AirPods",
    category: "Tech & Gadgets",
    description: "Apple AirPods — great for coding sessions, tutorials, and listening to podcasts about tech.",
    cost: 800
  },
  {
    id: "7",
    name: "Mechanical Keyboard",
    category: "Tech & Gadgets",
    description: "A satisfying mechanical keyboard that makes every build session more enjoyable.",
    cost: 600
  },
  {
    id: "8",
    name: "Ergonomic Mouse",
    category: "Tech & Gadgets",
    description: "A high-quality ergonomic wireless mouse for long coding and building sessions.",
    cost: 350
  },
  {
    id: "9",
    name: "Chromebook",
    category: "Tech & Gadgets",
    description: "A lightweight Chromebook — perfect for building and running web-based automation projects.",
    cost: 2000
  },
  {
    id: "10",
    name: "iPad",
    category: "Tech & Gadgets",
    description: "An iPad for sketching ideas, reading docs, and building on the go.",
    cost: 2500
  },
  {
    id: "11",
    name: "Apple Pencil",
    category: "Tech & Gadgets",
    description: "Apple Pencil for sketching project ideas, diagrams, and flowcharts on your iPad.",
    cost: 400
  },
  {
    id: "12",
    name: "Smartwatch",
    category: "Tech & Gadgets",
    description: "A smartwatch to keep you focused and receive automation notifications on your wrist.",
    cost: 1200
  },
  // Fun & Quirky
  {
    id: "13",
    name: "Automake Plushie",
    category: "Fun & Quirky",
    description: "A limited-edition Automake YSWS plushie — a cute robot mascot for your desk.",
    cost: 80
  },
  {
    id: "14",
    name: "Sticker Pack",
    category: "Fun & Quirky",
    description: "A pack of high-quality Automake YSWS and tech stickers for your laptop.",
    cost: 40
  },
  {
    id: "15",
    name: "Signed Thank You Photo",
    category: "Fun & Quirky",
    description: "A signed photo from the Automake YSWS team with a personal thank-you message.",
    cost: 60
  },
  {
    id: "16",
    name: "Hot Chocolate Kit",
    category: "Fun & Quirky",
    description: "A cozy hot chocolate kit for those late-night building sessions.",
    cost: 50
  },
  {
    id: "17",
    name: "Mystery Object",
    category: "Fun & Quirky",
    description: "A surprise item chosen by the Automake team. Could be anything — we keep it weird.",
    cost: 100
  },
  // Learning
  {
    id: "18",
    name: "Book of Your Choice",
    category: "Learning",
    description: "Pick any book related to tech, programming, entrepreneurship, or design — we'll send it to you.",
    cost: 120
  },
  {
    id: "19",
    name: "PICO-8 License",
    category: "Learning",
    description: "A lifetime license to PICO-8, the fantasy console for making small games and creative projects.",
    cost: 200
  },
  {
    id: "20",
    name: "IoT Starter Course",
    category: "Learning",
    description: "A comprehensive IoT course covering Arduino, Raspberry Pi, sensors, and connected projects.",
    cost: 250
  },
  {
    id: "21",
    name: "AI/API Course Bundle",
    category: "Learning",
    description: "A bundle of AI and API integration courses — cover GPT, REST APIs, automation, and more.",
    cost: 300
  },
  // Milestone Rewards
  {
    id: "22",
    name: "Framework Laptop",
    category: "Milestone Rewards",
    description: "A modular, repairable Framework laptop — the ultimate tool for a serious builder.",
    cost: 5000
  },
  {
    id: "23",
    name: "MacBook",
    category: "Milestone Rewards",
    description: "A MacBook Air or Pro — the iconic laptop for developers and creators.",
    cost: 7000
  },
  {
    id: "24",
    name: "VR Headset",
    category: "Milestone Rewards",
    description: "A Meta Quest or similar VR headset to explore spatial computing and virtual worlds.",
    cost: 4000
  },
  {
    id: "25",
    name: "Camera Kit",
    category: "Milestone Rewards",
    description: "A mirrorless camera kit for documenting your projects, creating content, and capturing the world.",
    cost: 3500
  },
  {
    id: "26",
    name: "Travel Stipend",
    category: "Milestone Rewards",
    description: "A travel stipend to attend a tech conference, hackathon, or camp of your choice.",
    cost: 6000
  }
];
