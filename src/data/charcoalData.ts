import { PricingData, LabSpec, InquiryFormData, CatalogProduct } from '../types';

export const TARGET_EMAIL = 'charcoalvault@gmail.com';
export const TARGET_WA_NUM = '6281294779925';
export const TARGET_WA_DISPLAY = '+62 812-9477-9925';
export const DEFAULT_WA_TEXT = 'Hello Charcoal Vault, I would like to inquire about shisha charcoal supply.';

export const PRODUCT_LABELS: Record<string, string> = {
  'charcoal-vault-gold': 'Charcoal Vault Gold (25x25x25mm / 72 Cubes)',
  'charcoal-vault-blue': 'Charcoal Vault Blue (28x28x28mm / 48 Cubes)',
  'charcoal-vault-hexa': 'Charcoal Vault Hexa (24x40mm / 64 Pcs)',
  'cube-charcoal': 'Cube Charcoal (Standard Formats)',
  'bulk-supply': 'Bulk & OEM Private Label Supply',
  'other': 'Other / Custom Size & Packaging',
};

export const INITIAL_PRICING: PricingData = {
  currency: 'USD',
  unit: 'MT',
  unitLabel: 'Metric Ton (1,000 kg)',
  moq: '18 MT',
  moqTons: 18,
  lastUpdated: null,
  disclaimer:
    'Prices are supplier-based reference prices and may fluctuate with raw material costs. Final quotations are confirmed based on current pricing, quantity, packaging requirements, and shipping terms.',
  terms: {
    EXW: {
      label: 'EXW',
      description: 'Ex Works — buyer arranges pickup and shipping',
      options: [
        {
          id: 'exw-goods-only',
          packaging: 'Goods Only + Inner Plastic',
          supplierPrice: 1475,
          pricingBasis: 'per_mt',
          shippingTerm: 'EXW',
          markup: null,
          finalBuyerPrice: null,
        },
        {
          id: 'exw-masterbox',
          packaging: 'Masterbox Doublewall 10kg',
          supplierPrice: 1550,
          pricingBasis: 'per_mt',
          shippingTerm: 'EXW',
          markup: null,
          finalBuyerPrice: null,
        },
        {
          id: 'exw-innerbox-masterbox',
          packaging: 'Innerbox 1kg + Masterbox 10kg',
          supplierPrice: 1600,
          pricingBasis: 'per_mt',
          shippingTerm: 'EXW',
          markup: null,
          finalBuyerPrice: null,
        },
      ],
    },
    FOB: {
      label: 'FOB',
      description: 'Free on Board — price includes loading onto vessel',
      options: [
        {
          id: 'fob-goods-only',
          packaging: 'Goods Only + Inner Plastic',
          supplierPrice: 1500,
          pricingBasis: 'per_mt',
          shippingTerm: 'FOB',
          markup: null,
          finalBuyerPrice: null,
        },
        {
          id: 'fob-masterbox',
          packaging: 'Masterbox Doublewall 10kg',
          supplierPrice: 1575,
          pricingBasis: 'per_mt',
          shippingTerm: 'FOB',
          markup: null,
          finalBuyerPrice: null,
        },
        {
          id: 'fob-innerbox-masterbox',
          packaging: 'Innerbox 1kg + Masterbox 10kg',
          supplierPrice: 1625,
          pricingBasis: 'per_mt',
          shippingTerm: 'FOB',
          markup: null,
          finalBuyerPrice: null,
        },
      ],
    },
  },
  referencePrice: {
    amount: 1450,
    term: 'EXW',
    packaging: 'Goods Only + Inner Plastic',
    note: 'Subject to current raw material pricing.',
  },
};

export const CV_LAB_SPECS: LabSpec[] = [
  {
    parameter: 'Moisture',
    unit: 'Pct',
    wetBasis: 5.43,
    dryBasis: null,
    method: 'ASTM D1762-84 (REAPPROVED 2021)',
  },
  {
    parameter: 'Ash Content',
    unit: 'Pct',
    wetBasis: 1.79,
    dryBasis: 1.89,
    method: 'ASTM D1762-84 (REAPPROVED 2021)',
  },
  {
    parameter: 'Volatile Matter',
    unit: 'Pct',
    wetBasis: 15.55,
    dryBasis: 16.44,
    method: 'ASTM D1762-84 (REAPPROVED 2021)',
  },
  {
    parameter: 'Fixed Carbon',
    unit: 'Pct',
    wetBasis: 77.23,
    dryBasis: 81.67,
    method: 'By Calculation',
  },
  {
    parameter: 'Gross Calorific Value',
    unit: 'Kcal/kg',
    wetBasis: 7211,
    dryBasis: 7625,
    method: 'ASTM D 5865-19',
  },
];

export const COMMERCIAL_PARAMS = [
  { label: 'PRODUCT', value: 'Coconut Shell Shisha Charcoal' },
  { label: 'MATERIAL', value: '100% Selected Coconut Shell' },
  { label: 'SIZE', value: 'Available on request (Standard Cube Formats)' },
  { label: 'PACKAGING', value: 'Available on request (Masterbox 10kg, Innerbox 1kg, etc.)' },
  { label: 'MOQ', value: '18 Metric Tons (18 MT / 1x 20ft FCL)' },
  { label: 'ORIGIN', value: 'Available on request' },
  { label: 'AVAILABILITY', value: 'Subject to batch schedule & order confirmation' },
];

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: 'charcoal-vault-gold',
    code: '01',
    name: 'CHARCOAL VAULT GOLD',
    tagline: 'Standard 25mm Cube Briquettes',
    badge: '72 CUBES',
    sizeBadge: '25 x 25 x 25 mm',
    image: '/img/charcoal-vault-gold.jpg',
    colorTheme: 'gold',
    weight: '1 Kilogram',
    contains: '72 cubes',
    size: '25 x 25 x 25 mm',
    specs: [
      { label: 'Weight', value: '1 Kilogram' },
      { label: 'Contains', value: '72 cubes' },
      { label: 'Size', value: '25 x 25 x 25 mm' },
      { label: 'Shape', value: 'Cube' },
      { label: 'Material', value: '100% Coconut Shell' },
      { label: 'Ash Content', value: '2% – 2.5%' },
      { label: 'Burning Time', value: '90 – 120 Minutes' },
      { label: 'Lighting Time', value: '10 Minutes' },
    ],
    description:
      'The classic 25mm cube format designed for versatile heat management. Perfectly proportioned for standard hookah heads with smooth burning, zero odor, and minimal ash.',
  },
  {
    id: 'charcoal-vault-blue',
    code: '02',
    name: 'CHARCOAL VAULT BLUE',
    tagline: 'Large 28mm Cube Briquettes',
    badge: '48 CUBES',
    sizeBadge: '28 x 28 x 28 mm',
    image: '/img/charcoal-vault-blue.jpg',
    colorTheme: 'blue',
    weight: '1 Kilogram',
    contains: '48 cubes',
    size: '28 x 28 x 28 mm',
    specs: [
      { label: 'Weight', value: '1 Kilogram' },
      { label: 'Contains', value: '48 cubes' },
      { label: 'Size', value: '28 x 28 x 28 mm' },
      { label: 'Shape', value: 'Cube' },
      { label: 'Material', value: '100% Coconut Shell' },
      { label: 'Ash Content', value: '2% – 2.5%' },
      { label: 'Burning Time', value: '90 – 120 Minutes' },
      { label: 'Lighting Time', value: '10 Minutes' },
    ],
    description:
      'Engineered for extended shisha sessions and high-traffic hookah lounges. The larger 28mm density sustains prolonged high caloric heat output with fewer coals needed.',
  },
  {
    id: 'charcoal-vault-hexa',
    code: '03',
    name: 'CHARCOAL VAULT HEXA',
    tagline: 'Hexagonal Cut Briquettes',
    badge: '64 PCS',
    sizeBadge: '24 x 40 mm',
    image: '/img/charcoal-vault-hexa.jpg',
    colorTheme: 'purple',
    weight: '1 Kilogram',
    contains: '64 pcs',
    size: '24 x 40 mm',
    specs: [
      { label: 'Weight', value: '1 Kilogram' },
      { label: 'Contains', value: '64 pcs' },
      { label: 'Size', value: '24 x 40 mm' },
      { label: 'Shape', value: 'Hexagonal (Hexa)' },
      { label: 'Material', value: '100% Coconut Shell' },
      { label: 'Ash Content', value: '2% – 2.5%' },
      { label: 'Burning Time', value: '90 – 120 Minutes' },
      { label: 'Lighting Time', value: '10 Minutes' },
    ],
    description:
      'Precision-extruded hexagonal charcoal with central aeration channels. Provides stable resting on heat management devices with consistent continuous draft.',
  },
];

export const FACTORY_CAPABILITIES = {
  warehouse: [
    { label: 'Warehouse Raw Material Capacity', value: '100 Tons', desc: 'Secure storage for aged, selected coconut shells' },
    { label: 'Warehouse Ready to Ship Capacity', value: '75 Tons', desc: 'Finished goods storage awaiting container dispatch' },
    { label: 'Production Availability', value: '50 Tons', desc: 'Immediate stock ready for prompt container allocation' },
  ],
  production: {
    machinery: '1 Line + 1 Mixer Machine + 1 Printing Machine',
    rates: [
      { period: 'Daily', value: '3.8 Tons / Day' },
      { period: 'Weekly', value: '25 Tons / Week' },
      { period: 'Monthly', value: '100 Tons / Month' },
    ],
  },
  drying: {
    machinery: '3 Industrial Ovens (Capacity 2.5 Tons / Oven)',
    rates: [
      { period: 'Daily', value: '7.5 Tons / Day' },
      { period: 'Weekly', value: '52.5 Tons / Week' },
      { period: 'Monthly', value: '225 Tons / Month' },
    ],
  },
  packaging: {
    rates: [
      { period: 'Daily', value: '4 Tons / Day' },
      { period: 'Weekly', value: '28 Tons / Week' },
      { period: 'Monthly', value: '120 Tons / Month' },
    ],
  },
  innerPlastic: [
    { feature: 'Sealing Technology', detail: 'Machine Sealed (Airtight moisture barrier)' },
    { feature: 'Branding / Printing', detail: 'Printed with custom branding (By request)' },
    { feature: 'Desiccant Preservation', detail: 'Silica Gel packet included (By request)' },
  ],
  boxCapability: [
    { feature: 'Inner Box Material', detail: 'Inner Box 345 E–Flute (Duplex) 125 Medium E–Flute + 125 Kraft' },
    { feature: 'Carton Sealing', detail: 'Machine Sealed for reinforced edge protection' },
    { feature: 'Master Box', detail: 'Master Box Single Wall, One Printing Color (As requested)' },
  ],
};

export const PRODUCT_PROFILE_SPECS = [
  { parameter: 'Ash Content', value: '2% – 2.5%' },
  { parameter: 'Moisture', value: '5% – 7%' },
  { parameter: 'Volatile Matter', value: '15% – 16%' },
  { parameter: 'Fixed Carbon', value: '77% – 83%' },
  { parameter: 'Caloric Value', value: '7,000 – 7,500 Kcal/kg' },
  { parameter: 'Odor', value: 'Odorless' },
  { parameter: 'Smoke', value: 'Smokeless' },
  { parameter: 'Period of Lighting', value: '10 Minutes' },
  { parameter: 'Coal Burning', value: '90 – 120 Minutes' },
  { parameter: 'Shape Finishing', value: 'Smooth' },
  { parameter: 'Shape Cutting', value: 'Hard' },
  { parameter: 'Color Before Use', value: 'Black Metallic' },
  { parameter: 'Coal Power After Lighting', value: 'Hard' },
];

export const WHY_POINTS = [
  {
    number: '01',
    title: 'RELIABLE SOURCING',
    body: 'Access to supplier-supported charcoal supply without unnecessary complexity.',
  },
  {
    number: '02',
    title: 'FLEXIBLE CONTAINER SUPPLY',
    body: 'Designed to support regional distributors, lounge networks, and growing brands starting from single 18 MT container shipments.',
  },
  {
    number: '03',
    title: 'DIRECT COMMUNICATION',
    body: 'Clear product information, pricing, and order coordination.',
  },
];

export const SUPPLY_STEPS = [
  { number: '01', text: 'Tell us what you need.' },
  { number: '02', text: 'We confirm available products and pricing.' },
  { number: '03', text: 'You approve the order.' },
  { number: '04', text: 'We coordinate supply and delivery.' },
];

export const FAQ_ITEMS = [
  {
    question: 'What type of charcoal do you supply?',
    answer:
      'We supply coconut shell shisha charcoal, primarily in cube format. If you need specific product details, reach out and we can share current specifications.',
  },
  {
    question: 'Can small traders order?',
    answer:
      'Yes. We work with businesses of different sizes, including smaller traders and resellers who are building their supply chain, provided orders meet the 18 MT minimum quantity.',
  },
  {
    question: 'What is the minimum order quantity?',
    answer:
      'Our minimum order quantity (MOQ) is 18 Metric Tons (18 MT / 18,000 kg). Contact us to discuss your order schedule and container requirements.',
  },
  {
    question: 'Can I request a price list?',
    answer:
      "Yes. Use the contact form or reach out via WhatsApp and we'll send you current pricing based on what you need.",
  },
  {
    question: 'Are the listed prices fixed or subject to change?',
    answer:
      'All prices displayed on the site are supplier reference rates and are subject to change at any time without prior notice due to market fluctuations in coconut shell raw material costs, seasonal yields, and currency exchange rates. Binding quotations are confirmed directly upon placing an official inquiry.',
  },
  {
    question: 'Do you support recurring orders?',
    answer:
      'Yes. If you need regular supply, we can coordinate recurring orders based on your schedule and volume.',
  },
  {
    question: 'How do I place an order?',
    answer:
      "Fill out the contact form below or message us directly. We'll confirm product availability, pricing, and coordinate the order from there.",
  },
];

export function computeFinalPrices(data: PricingData): void {
  (['EXW', 'FOB'] as const).forEach((termKey) => {
    data.terms[termKey].options.forEach((opt) => {
      if (opt.markup === null) {
        opt.finalBuyerPrice = null;
      } else if (typeof opt.markup === 'number') {
        opt.finalBuyerPrice = opt.supplierPrice + opt.markup;
      } else if (opt.markup && typeof opt.markup.percent === 'number') {
        opt.finalBuyerPrice = Math.round(opt.supplierPrice * (1 + opt.markup.percent / 100));
      }
    });
  });
}

export function getPriceDisplay(option: { finalBuyerPrice: number | null }): string | null {
  if (option.finalBuyerPrice !== null) {
    return 'USD ' + option.finalBuyerPrice.toLocaleString() + ' / MT';
  }
  return null;
}

export function buildInquiryMessage(data: InquiryFormData): string {
  const productName = PRODUCT_LABELS[data.product] || data.product || 'Not specified';
  const lines = [
    'NEW B2B SUPPLY INQUIRY — CHARCOAL VAULT',
    '═══════════════════════════════════════',
    'Name: ' + (data.name || '-'),
    'Business / Brand: ' + (data.business || '-'),
    'Client WhatsApp: ' + (data.whatsapp || '-'),
    'Client Email: ' + (data.email || '-'),
    'Product: ' + productName,
    'Estimated Quantity: ' + (data.quantity || '18 MT (MOQ)'),
    '───────────────────────────────────────',
    'Message:',
    data.message || '(No additional message provided)',
    '═══════════════════════════════════════',
  ];
  return lines.join('\n');
}

export function buildMailtoUrl(data: InquiryFormData): string {
  const productName = PRODUCT_LABELS[data.product] || data.product || '';
  const subject =
    'B2B Charcoal Supply Inquiry' +
    (productName ? ' [' + productName + ']' : '') +
    ' — ' +
    (data.name || 'Client');
  const body = buildInquiryMessage(data);
  return 'mailto:' + TARGET_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

export function buildWhatsAppUrl(data: Partial<InquiryFormData>): string {
  if (data && (data.name || data.business || data.product || data.quantity || data.message)) {
    const productName = (data.product && PRODUCT_LABELS[data.product]) || data.product || '-';
    const msg =
      'Hello Charcoal Vault, I would like to submit a B2B supply inquiry:\n\n' +
      '• Name: ' +
      (data.name || '-') +
      '\n' +
      '• Business: ' +
      (data.business || '-') +
      '\n' +
      '• Product: ' +
      productName +
      '\n' +
      '• Quantity: ' +
      (data.quantity || '18 MT (MOQ)') +
      '\n' +
      '• Email: ' +
      (data.email || '-') +
      '\n' +
      '• My WhatsApp: ' +
      (data.whatsapp || '-') +
      '\n' +
      (data.message ? '• Notes: ' + data.message : '');
    return 'https://wa.me/' + TARGET_WA_NUM + '?text=' + encodeURIComponent(msg);
  }
  return 'https://wa.me/' + TARGET_WA_NUM + '?text=' + encodeURIComponent(DEFAULT_WA_TEXT);
}
