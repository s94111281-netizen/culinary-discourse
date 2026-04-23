import type { Restaurant } from "@/data/restaurants";
import dynamic from "next/dynamic";

// Leaflet touches `window` at import time, so we must prevent SSR from loading it.
const MapClient = dynamic(() => import("@/components/MapClient"), { ssr: false });

export function Map(props: {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return <MapClient {...props} />;
}

