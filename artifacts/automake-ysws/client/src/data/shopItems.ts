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
    name: "Airtable Credits",
    category: "Automation Tools",
    description: "Credits for Airtable Pro features including expanded records, automations, and API access.",
    cost: 100
  },
  {
    id: "2",
    name: "WhatsApp Business API Credits",
    category: "Automation Tools",
    description: "Prepaid message credits for the WhatsApp Business API — send thousands of automated messages.",
    cost: 200
  },
  // Tech & Gadgets
  {
    id: "3",
    name: "AirPods",
    category: "Tech & Gadgets",
    description: "Apple AirPods — great for coding sessions, tutorials, and listening to podcasts about tech.",
    cost: 800
  },
  {
    id: "4",
    name: "Mechanical Keyboard",
    category: "Tech & Gadgets",
    description: "A satisfying mechanical keyboard that makes every build session more enjoyable.",
    cost: 600
  },
  {
    id: "5",
    name: "Ergonomic Mouse",
    category: "Tech & Gadgets",
    description: "A high-quality ergonomic wireless mouse for long coding and building sessions.",
    cost: 350
  },
  {
    id: "6",
    name: "Chromebook",
    category: "Tech & Gadgets",
    description: "A lightweight Chromebook — perfect for building and running web-based automation projects.",
    cost: 2000
  },
  {
    id: "7",
    name: "Apple Pencil",
    category: "Tech & Gadgets",
    description: "Apple Pencil for sketching project ideas, diagrams, and flowcharts on your iPad.",
    cost: 400
  },
  {
    id: "8",
    name: "Laptop/Tablet Grant",
    category: "Tech & Gadgets",
    description: "A $100 grant to go towards any laptop or tablet of your choosing.",
    cost: 1000
  },
  // Fun & Quirky
  {
    id: "8",
    name: "Sticker Pack",
    category: "Fun & Quirky",
    description: "A pack of high-quality Automake YSWS and tech stickers for your laptop.",
    cost: 40
  },
  {
    id: "9",
    name: "Signed Photo from someone at HQ",
    category: "Fun & Quirky",
    description: "A signed photo from someone at HQ.",
    cost: 60
  },
  {
    id: "10",
    name: "Hot Chocolate Kit",
    category: "Fun & Quirky",
    description: "A cozy hot chocolate kit for those late-night building sessions.",
    cost: 50
  },
  {
    id: "11",
    name: "Mystery Object from HQ",
    category: "Fun & Quirky",
    description: "A surprise item chosen by the Automake team. Could be anything that is lying around at HQ.",
    cost: 100
  },
  // Milestone Rewards
  {
    id: "12",
    name: "VR Headset",
    category: "Milestone Rewards",
    description: "A Meta Quest or similar VR headset to explore spatial computing and virtual worlds.",
    cost: 4000
  },