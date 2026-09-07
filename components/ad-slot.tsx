import { getAdConfig } from "../lib/monetization";

export function AdSlot({ slot }: { slot: string }) {
  const config = getAdConfig(slot);
  return (
    <aside className="ad-slot" aria-label="Advertisement" data-slot={slot} data-provider={config.provider}>
      {config.enabled ? "Advertisement" : "Ruang iklan"}
    </aside>
  );
}
