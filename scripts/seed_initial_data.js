#!/usr/bin/env node

/**
 * CHARCOAL VAULT — Supabase Initial Data Seeder
 * Idempotently seeds initial catalog products, pricing matrix, FAQs,
 * site sections, contact information, and SEO metadata.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed_initial_data.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// 1. Initial Products
const INITIAL_PRODUCTS = [
  {
    code: '01',
    name: 'CHARCOAL VAULT GOLD',
    slug: 'charcoal-vault-gold',
    tagline: 'Standard 25mm Cube Briquettes',
    description:
      'The classic 25mm cube format designed for versatile heat management. Perfectly proportioned for standard hookah heads with smooth burning, zero odor, and minimal ash.',
    badge: '72 CUBES',
    size_badge: '25 x 25 x 25 mm',
    image_url: '/img/charcoal-vault-gold.jpg',
    gallery_urls: ['/img/charcoal-vault-gold.jpg'],
    color_theme: 'gold',
    weight: '1 Kilogram',
    contains: '72 cubes',
    size: '25 x 25 x 25 mm',
    grade: 'Premium Export',
    shape: 'Cube',
    ash_content: '2% – 2.5%',
    moisture: '5.43%',
    fixed_carbon: '77.23%',
    volatile_matter: '15.55%',
    caloric_value: '7,211 Kcal/kg',
    burn_time: '90 – 120 Minutes',
    light_time: '10 Minutes',
    packaging: '1kg Innerbox / 10kg Masterbox',
    moq: '18 Metric Tons (18 MT)',
    status: 'active',
    order_index: 1,
    is_featured: true,
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
  },
  {
    code: '02',
    name: 'CHARCOAL VAULT BLUE',
    slug: 'charcoal-vault-blue',
    tagline: 'Large 28mm Cube Briquettes',
    description:
      'Engineered for extended shisha sessions and high-traffic hookah lounges. The larger 28mm density sustains prolonged high caloric heat output with fewer coals needed.',
    badge: '48 CUBES',
    size_badge: '28 x 28 x 28 mm',
    image_url: '/img/charcoal-vault-blue.jpg',
    gallery_urls: ['/img/charcoal-vault-blue.jpg'],
    color_theme: 'blue',
    weight: '1 Kilogram',
    contains: '48 cubes',
    size: '28 x 28 x 28 mm',
    grade: 'Lounge Grade',
    shape: 'Cube',
    ash_content: '2% – 2.5%',
    moisture: '5% – 7%',
    fixed_carbon: '77% – 83%',
    volatile_matter: '15% – 16%',
    caloric_value: '7,200 – 7,500 Kcal/kg',
    burn_time: '90 – 120 Minutes',
    light_time: '10 Minutes',
    packaging: '1kg Innerbox / 10kg Masterbox',
    moq: '18 Metric Tons (18 MT)',
    status: 'active',
    order_index: 2,
    is_featured: true,
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
  },
  {
    code: '03',
    name: 'CHARCOAL VAULT HEXA',
    slug: 'charcoal-vault-hexa',
    tagline: 'Hexagonal Cut Briquettes',
    description:
      'Precision-extruded hexagonal charcoal with central aeration channels. Provides stable resting on heat management devices with consistent continuous draft.',
    badge: '64 PCS',
    size_badge: '24 x 40 mm',
    image_url: '/img/charcoal-vault-hexa.jpg',
    gallery_urls: ['/img/charcoal-vault-hexa.jpg'],
    color_theme: 'purple',
    weight: '1 Kilogram',
    contains: '64 pcs',
    size: '24 x 40 mm',
    grade: 'Precision Bar Format',
    shape: 'Hexagonal (Hexa)',
    ash_content: '2% – 2.5%',
    moisture: '5% – 7%',
    fixed_carbon: '77% – 83%',
    volatile_matter: '15% – 16%',
    caloric_value: '7,000 – 7,500 Kcal/kg',
    burn_time: '90 – 120 Minutes',
    light_time: '10 Minutes',
    packaging: '1kg Innerbox / 10kg Masterbox',
    moq: '18 Metric Tons (18 MT)',
    status: 'active',
    order_index: 3,
    is_featured: true,
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
  },
];

// 2. Initial Pricing
const INITIAL_PRICING = [
  {
    shipping_term: 'EXW',
    packaging: 'Goods Only + Inner Plastic',
    price_per_mt: 1505.0,
    currency: 'USD',
    moq_tons: 18,
    is_active: true,
    effective_date: new Date().toISOString().split('T')[0],
    notes: 'Reference supplier price. Subject to raw material fluctuations.',
  },
  {
    shipping_term: 'EXW',
    packaging: 'Masterbox Doublewall 10kg',
    price_per_mt: 1580.0,
    currency: 'USD',
    moq_tons: 18,
    is_active: true,
    effective_date: new Date().toISOString().split('T')[0],
    notes: 'Standard doublewall export carton.',
  },
  {
    shipping_term: 'EXW',
    packaging: 'Innerbox 1kg + Masterbox 10kg',
    price_per_mt: 1630.0,
    currency: 'USD',
    moq_tons: 18,
    is_active: true,
    effective_date: new Date().toISOString().split('T')[0],
    notes: 'Full retail presentation with individual printed 1kg boxes.',
  },
  {
    shipping_term: 'FOB',
    packaging: 'Goods Only + Inner Plastic',
    price_per_mt: 1530.0,
    currency: 'USD',
    moq_tons: 18,
    is_active: true,
    effective_date: new Date().toISOString().split('T')[0],
    notes: 'Includes port delivery and loading onto ocean vessel in Indonesia.',
  },
  {
    shipping_term: 'FOB',
    packaging: 'Masterbox Doublewall 10kg',
    price_per_mt: 1605.0,
    currency: 'USD',
    moq_tons: 18,
    is_active: true,
    effective_date: new Date().toISOString().split('T')[0],
    notes: 'Free on board with heavy-duty outer carton.',
  },
  {
    shipping_term: 'FOB',
    packaging: 'Innerbox 1kg + Masterbox 10kg',
    price_per_mt: 1655.0,
    currency: 'USD',
    moq_tons: 18,
    is_active: true,
    effective_date: new Date().toISOString().split('T')[0],
    notes: 'Complete FOB delivery with branded inner retail cartons.',
  },
];

// 3. Initial FAQs
const INITIAL_FAQS = [
  {
    order_index: 0,
    question: 'What type of charcoal do you supply?',
    answer:
      'We supply coconut shell shisha charcoal, primarily in cube format. If you need specific product details, reach out and we can share current specifications.',
    is_active: true,
  },
  {
    order_index: 1,
    question: 'Can small traders order?',
    answer:
      'Yes. We work with businesses of different sizes, including smaller traders and resellers who are building their supply chain, provided orders meet the 18 MT minimum quantity.',
    is_active: true,
  },
  {
    order_index: 2,
    question: 'What is the minimum order quantity?',
    answer:
      'Our minimum order quantity (MOQ) is 18 Metric Tons (18 MT / 18,000 kg). Contact us to discuss your order schedule and container requirements.',
    is_active: true,
  },
  {
    order_index: 3,
    question: 'Can I request a price list?',
    answer:
      "Yes. Use the contact form or reach out via WhatsApp and we'll send you current pricing based on what you need.",
    is_active: true,
  },
  {
    order_index: 4,
    question: 'Are the listed prices fixed or subject to change?',
    answer:
      'All prices displayed on the site are supplier reference rates and are subject to change at any time without prior notice due to market fluctuations in coconut shell raw material costs, seasonal yields, and currency exchange rates. Binding quotations are confirmed directly upon placing an official inquiry.',
    is_active: true,
  },
  {
    order_index: 5,
    question: 'Do you support recurring orders?',
    answer:
      'Yes. If you need regular supply, we can coordinate recurring orders based on your schedule and volume.',
    is_active: true,
  },
  {
    order_index: 6,
    question: 'How do I place an order?',
    answer:
      "Fill out the contact form below or message us directly. We'll confirm product availability, pricing, and coordinate the order from there.",
    is_active: true,
  },
];

// 4. Contact Settings (Singleton)
const CONTACT_SETTINGS = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'charcoalvault@gmail.com',
  whatsapp: '6281294779925',
  whatsapp_display: '+62 812-9477-9925',
  phone: '+62 812-9477-9925',
  instagram: 'https://instagram.com/charcoalvault',
  linkedin: 'https://linkedin.com/company/charcoalvault',
  default_wa_text: 'Hello Charcoal Vault, I would like to inquire about shisha charcoal supply.',
  cta_url: '#contact',
};

// 5. SEO Settings (Singleton)
const SEO_SETTINGS = {
  id: '00000000-0000-0000-0000-000000000002',
  meta_title: 'CHARCOAL VAULT | Premium Coconut Shell Shisha Charcoal Wholesale & Export',
  meta_description:
    'Direct Indonesian manufacturer and exporter of 100% natural coconut shell charcoal briquettes for shisha and hookah lounges worldwide. Minimum order 18 MT.',
  og_title: 'CHARCOAL VAULT | Premium Coconut Shell Shisha Charcoal',
  og_description:
    'Direct Indonesian manufacturer and exporter of 100% natural coconut shell charcoal briquettes for shisha and hookah lounges worldwide.',
  og_image_url: '/img/logo.jpg',
  canonical_url: 'https://charcoal-vault.vercel.app',
};

// 6. Site Sections
const SECTIONS = [
  {
    section_key: 'hero',
    title: 'PURE COCONUT SHELL SHISHA CHARCOAL',
    subtitle: 'SUPPLIER-SUPPORTED CONTAINER SHIPMENTS FROM INDONESIA',
    body_text:
      'Engineered for premium hookah lounges and global tobacco distributors. High-density, odor-free, 100% natural coconut shell briquettes with less than 2.5% ash and up to 120 minutes continuous burn time.',
    cta_text: 'REQUEST CONTAINER QUOTE',
    cta_url: '#contact',
    image_url: '/img/charcoal-vault-gold.jpg',
    is_enabled: true,
    order_index: 0,
    extra_data: {
      tag: 'B2B BULK & OEM PRIVATE LABEL',
    },
  },
  {
    section_key: 'about',
    title: 'THE CHARCOAL VAULT STANDARD',
    subtitle: 'UNCOMPROMISING COMBUSTION SCIENCE',
    body_text:
      'We source only mature Indonesian coconut shells, carbonized under controlled low-oxygen retorts. Our briquettes contain zero chemicals, zero nitrate binders, and produce a clean, pure heat profile that lets shisha tobacco flavors shine without tainting.',
    cta_text: 'VIEW SPECIFICATIONS',
    cta_url: '#products',
    image_url: '/img/charcoal-vault-blue.jpg',
    is_enabled: true,
    order_index: 1,
    extra_data: {
      factoryCapacity: '100 Tons / Month',
      rawMaterialReserve: '100 Tons',
    },
  },
  {
    section_key: 'process',
    title: 'ORDER & FULFILLMENT PROCESS',
    subtitle: 'TRANSPARENT 4-STEP CONTAINER LOGISTICS',
    body_text:
      'From preliminary inquiry to final bill of lading, our export team manages quality control, carton printing, container loading, and port clearance.',
    cta_text: 'START YOUR INQUIRY',
    cta_url: '#contact',
    image_url: null,
    is_enabled: true,
    order_index: 2,
    extra_data: {
      steps: [
        { step: '01', title: 'Submit Inquiry', desc: 'Select desired briquette cut, packaging type, and estimated shipping month.' },
        { step: '02', title: 'Contract & Proforma', desc: 'Confirm pricing, lead time, and OEM packaging artwork requirements.' },
        { step: '03', title: 'Batch Production & QC', desc: 'Precision extrusion, oven drying, and drop-testing before carton packing.' },
        { step: '04', title: 'Container Dispatch', desc: 'Direct stuffing at factory or port, sealed and shipped with complete export documentation.' },
      ],
    },
  },
  {
    section_key: 'cta',
    title: 'READY TO SECURE YOUR CONTAINER SUPPLY?',
    subtitle: 'DISPATCH SCHEDULES OPEN FOR UPCOMING EXPORT WINDOW',
    body_text:
      'Connect with our B2B commercial team to confirm immediate stock availability, custom private label packaging, and FOB or EXW rates.',
    cta_text: 'SUBMIT INQUIRY NOW',
    cta_url: '#contact',
    image_url: null,
    is_enabled: true,
    order_index: 3,
    extra_data: {
      waButtonText: 'CHAT ON WHATSAPP',
    },
  },
  {
    section_key: 'footer',
    title: 'CHARCOAL VAULT',
    subtitle: 'Premium Indonesian Shisha Charcoal Briquettes',
    body_text: 'Strict B2B wholesale supply. Minimum order quantity 18 MT (1x 20ft FCL). All rights reserved.',
    cta_text: 'Back to Top',
    cta_url: '#top',
    image_url: '/img/logo.jpg',
    is_enabled: true,
    order_index: 4,
    extra_data: {
      copyrightYear: 2026,
    },
  },
];

async function seed() {
  console.log('🚀 Starting CHARCOAL VAULT database seed...\n');

  // Seed Products
  console.log('📦 Seeding products...');
  for (const product of INITIAL_PRODUCTS) {
    const { error } = await supabase
      .from('products')
      .upsert(product, { onConflict: 'slug' });
    if (error) {
      console.error(`  ❌ Failed to seed product ${product.slug}:`, error.message);
    } else {
      console.log(`  ✓ Product seeded: ${product.name}`);
    }
  }

  // Seed Pricing
  console.log('\n💰 Seeding pricing...');
  for (const price of INITIAL_PRICING) {
    // Check if exists
    const { data: existing } = await supabase
      .from('pricing')
      .select('id')
      .match({
        shipping_term: price.shipping_term,
        packaging: price.packaging,
        is_active: true,
      })
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('pricing')
        .update(price)
        .eq('id', existing.id);
      if (error) {
        console.error(`  ❌ Failed to update price ${price.shipping_term} - ${price.packaging}:`, error.message);
      } else {
        console.log(`  ✓ Pricing updated: ${price.shipping_term} - ${price.packaging}`);
      }
    } else {
      const { error } = await supabase.from('pricing').insert(price);
      if (error) {
        console.error(`  ❌ Failed to insert price ${price.shipping_term} - ${price.packaging}:`, error.message);
      } else {
        console.log(`  ✓ Pricing inserted: ${price.shipping_term} - ${price.packaging}`);
      }
    }
  }

  // Seed FAQs
  console.log('\n❓ Seeding FAQs...');
  for (const faq of INITIAL_FAQS) {
    const { data: existing } = await supabase
      .from('faqs')
      .select('id')
      .eq('question', faq.question)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase.from('faqs').update(faq).eq('id', existing.id);
      if (error) console.error(`  ❌ Failed to update FAQ:`, error.message);
      else console.log(`  ✓ FAQ updated: "${faq.question.slice(0, 35)}..."`);
    } else {
      const { error } = await supabase.from('faqs').insert(faq);
      if (error) console.error(`  ❌ Failed to insert FAQ:`, error.message);
      else console.log(`  ✓ FAQ inserted: "${faq.question.slice(0, 35)}..."`);
    }
  }

  // Seed Contact Settings
  console.log('\n📞 Seeding contact settings...');
  const { error: contactErr } = await supabase
    .from('contact_settings')
    .upsert(CONTACT_SETTINGS, { onConflict: 'id' });
  if (contactErr) {
    console.error('  ❌ Failed to seed contact_settings:', contactErr.message);
  } else {
    console.log('  ✓ Contact settings seeded.');
  }

  // Seed SEO Settings
  console.log('\n🌐 Seeding SEO settings...');
  const { error: seoErr } = await supabase
    .from('seo_settings')
    .upsert(SEO_SETTINGS, { onConflict: 'id' });
  if (seoErr) {
    console.error('  ❌ Failed to seed seo_settings:', seoErr.message);
  } else {
    console.log('  ✓ SEO settings seeded.');
  }

  // Seed Sections
  console.log('\n📑 Seeding site sections...');
  for (const sec of SECTIONS) {
    const { error } = await supabase
      .from('sections')
      .upsert(sec, { onConflict: 'section_key' });
    if (error) {
      console.error(`  ❌ Failed to seed section ${sec.section_key}:`, error.message);
    } else {
      console.log(`  ✓ Section seeded: [${sec.section_key}]`);
    }
  }

  console.log('\n✨ Database seeding completed successfully!\n');
}

seed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
