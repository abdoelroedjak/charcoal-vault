export interface PricingOption {
  id: string;
  packaging: string;
  supplierPrice: number;
  pricingBasis: string;
  shippingTerm: 'EXW' | 'FOB';
  markup: number | { percent: number } | null;
  finalBuyerPrice: number | null;
}

export interface PricingTerm {
  label: string;
  description: string;
  options: PricingOption[];
}

export interface PricingData {
  currency: string;
  unit: string;
  unitLabel: string;
  moq: string;
  moqTons: number;
  lastUpdated: string | null;
  disclaimer: string;
  terms: {
    EXW: PricingTerm;
    FOB: PricingTerm;
  };
  referencePrice: {
    amount: number;
    term: string;
    packaging: string;
    note: string;
  };
}

export interface LabSpec {
  parameter: string;
  unit: string;
  wetBasis: number;
  dryBasis: number | null;
  method: string;
}

export interface InquiryFormData {
  name: string;
  business: string;
  whatsapp: string;
  email: string;
  product: string;
  quantity: string;
  message: string;
}

export interface FormStatusState {
  type: 'success' | 'error' | null;
  message: string;
  mailtoUrl?: string;
  waUrl?: string;
  isFallback?: boolean;
  name?: string;
}

export interface ProductSpecItem {
  label: string;
  value: string;
}

export interface CatalogProduct {
  id: string;
  code: string;
  name: string;
  tagline: string;
  badge: string;
  sizeBadge: string;
  image: string;
  colorTheme: 'gold' | 'blue' | 'purple';
  weight: string;
  contains: string;
  size: string;
  specs: ProductSpecItem[];
  description: string;
}

export interface FactoryCapacityRate {
  period: string;
  value: string;
}

export interface FactoryPackagingFeature {
  feature: string;
  detail: string;
}

declare global {
  interface Window {
    __CV_PRICING: PricingData;
    __CV_LAB_SPECS: LabSpec[];
    __CV_computePrices: () => void;
    __CV_getPriceDisplay: typeof import('../data/charcoalData').getPriceDisplay;
  }
}

