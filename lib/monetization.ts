export type AdProvider = "adsense" | "direct";
export type AffiliateProvider = "shopee" | "generic";

export interface AdSlotConfig {
  slot: string;
  provider: AdProvider;
  enabled: boolean;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  destinationUrl: string;
  affiliateUrl?: string;
  provider: AffiliateProvider;
  disclosureRequired: boolean;
}

export function getAdConfig(slot: string): AdSlotConfig {
  return {
    slot,
    provider: "adsense",
    enabled: Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true"),
  };
}

export function toSafeAffiliateHref(product: AffiliateProduct): string {
  const href = product.affiliateUrl ?? product.destinationUrl;
  try {
    const url = new URL(href);
    if (url.protocol !== "https:") return "#";
    return url.toString();
  } catch {
    return "#";
  }
}

export function affiliateDisclosure(): string {
  return "Sebagian tautan di situs ini dapat berupa tautan affiliate. Jika kamu membeli melalui tautan tersebut, pemilik situs dapat menerima komisi sesuai ketentuan program affiliate yang berlaku, tanpa biaya tambahan bagi kamu.";
}
