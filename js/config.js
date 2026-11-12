/*
 * Neelkanth Rice & Oil Depo — site configuration.
 * Everything the client still needs to supply lives in this one file.
 * A value left as '' or null shows as a "To be confirmed" placeholder on the page.
 */
window.NEELKANTH = {
  storeName: 'Neelkanth Rice & Oil Depo',

  // REPLACE with the store's verified WhatsApp number: digits only, with country code,
  // for example '9198XXXXXXXX'. While this is empty, every WhatsApp button opens a
  // demo preview of the pre-filled message instead of opening WhatsApp.
  whatsappNumber: '',

  // REPLACE with verified store details. Leave null until confirmed.
  store: {
    address: null, // e.g. 'Shop no., street, Sainikpuri, Hyderabad, PIN'
    phone: null, // e.g. '+91 XXXXX XXXXX'
    hours: null, // e.g. 'Monday to Sunday, 8:00 am to 9:30 pm'
  },

  // Pre-filled WhatsApp messages.
  messages: {
    general: () => 'Hello Neelkanth Rice & Oil Depo, I would like to place a grocery order.',
    category: (name) => `Hello Neelkanth Rice & Oil Depo, I would like to know what is available in ${name}.`,
    product: (p) =>
      `Hello Neelkanth Rice & Oil Depo, I would like to order:\n• ${p.name}${p.unit ? ` (${p.unit})` : ''}\nQuantity: `,
  },

  // SAMPLE catalogue for the concept. Replace with the store's real range.
  // unit and price are intentionally null: when supplied they appear on the card
  // and in the pre-filled WhatsApp message.
  products: [
    {id: 'sona-masoori', name: 'Sona Masoori Rice', category: 'rice', image: 'prod-sona-masoori.svg', unit: null, price: null},
    {id: 'basmati', name: 'Basmati Rice', category: 'rice', image: 'prod-basmati.svg', unit: null, price: null},
    {id: 'sunflower-oil', name: 'Sunflower Oil', category: 'oils', image: 'prod-sunflower-oil.svg', unit: null, price: null},
    {id: 'groundnut-oil', name: 'Groundnut Oil', category: 'oils', image: 'prod-groundnut-oil.svg', unit: null, price: null},
    {id: 'toor-dal', name: 'Toor Dal', category: 'pulses', image: 'prod-toor-dal.svg', unit: null, price: null},
    {id: 'atta', name: 'Whole Wheat Atta', category: 'flours', image: 'prod-atta.svg', unit: null, price: null},
    {id: 'turmeric', name: 'Turmeric Powder', category: 'spices', image: 'prod-turmeric.svg', unit: null, price: null},
    {id: 'sugar', name: 'Sugar', category: 'essentials', image: 'prod-sugar.svg', unit: null, price: null},
  ],

  categories: {
    rice: 'Rice',
    oils: 'Cooking Oils',
    pulses: 'Pulses & Dals',
    flours: 'Atta & Flours',
    spices: 'Spices & Masalas',
    essentials: 'Grocery Essentials',
  },
};
