export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
}

export const shopItems: ShopItem[] = [
  {
    id: "9",
    name: "Sticker Pack",
    description:
      "A pack of high-quality Automake YSWS and tech stickers for your laptop.",
    cost: 40,
  },
  {
    id: "11",
    name: "Hot Chocolate Kit",
    description:
      "A cozy hot chocolate kit for those late-night building sessions.",
    cost: 50,
  },
  {
    id: "10",
    name: "Signed Photo from someone at HQ",
    description: "A signed photo from someone at HQ.",
    cost: 60,
  },
  {
    id: "1",
    name: "Airtable Credits",
    description:
      "Credits for Airtable Pro features including expanded records, automations, and API access.",
    cost: 100,
  },
  {
    id: "12",
    name: "Mystery Object from HQ",
    description:
      "A surprise item chosen by the Automake team. Could be anything that is lying around at HQ.",
    cost: 100,
  },
  {
    id: "2",
    name: "WhatsApp Business API Credits",
    description:
      "Prepaid message credits for the WhatsApp Business API — send thousands of automated messages.",
    cost: 200,
  },
  {
    id: "5",
    name: "Ergonomic Mouse",
    description:
      "A high-quality ergonomic wireless mouse for long coding and building sessions.",
    cost: 350,
  },
  {
    id: "7",
    name: "Apple Pencil",
    description:
      "Apple Pencil for sketching project ideas, diagrams, and flowcharts on your iPad.",
    cost: 400,
  },
  {
    id: "4",
    name: "Mechanical Keyboard",
    description:
      "A satisfying mechanical keyboard that makes every build session more enjoyable.",
    cost: 600,
  },
  {
    id: "3",
    name: "AirPods",
    description:
      "Apple AirPods — great for coding sessions, tutorials, and listening to podcasts about tech.",
    cost: 800,
  },
  {
    id: "8",
    name: "Laptop/Tablet Grant",
    description:
      "A $100 grant to go towards any laptop or tablet of your choosing.",
    cost: 1000,
  },
  {
    id: "6",
    name: "Chromebook",
    description:
      "A lightweight Chromebook — perfect for building and running web-based automation projects.",
    cost: 2000,
  },
  {
    id: "13",
    name: "VR Headset",
    description:
      "A Meta Quest or similar VR headset to explore spatial computing and virtual worlds.",
    cost: 4000,
  },
];
