import { PricingData, LabSpec, InquiryFormData } from '../types';

export const TARGET_EMAIL = 'charcoalvault@gmail.com';
export const TARGET_WA_NUM = '6281294779925';
export const TARGET_WA_DISPLAY = '+62 812-9477-9925';
export const DEFAULT_WA_TEXT = 'Hello Charcoal Vault, I would like to inquire about shisha charcoal supply.';

export const PRODUCT_LABELS: Record<string, string> = {
  'cube-charcoal': 'Cube Charcoal',
  'bulk-supply': 'Bulk Supply',
  'other': 'Other / Special Request',
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
