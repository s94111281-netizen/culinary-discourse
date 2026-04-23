"use client";

import type { Restaurant } from "@/data/restaurants";
import clsx from "clsx";
import { useMemo, useState } from "react";

const audienceMeta = {
  local: { label: "Local discourse", chip: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  tourist: { label: "Tourist discourse", chip: "bg-rose-50 text-rose-700 ring-rose-200" },
  mixed: { label: "Mixed discourse", chip: "bg-amber-50 text-amber-800 ring-amber-200" }
} as const;

const levelMeta = {
  high: { label: "High", chip: "bg-black/5 text-ink ring-black/10" },
  medium: { label: "Medium", chip: "bg-black/5 text-ink ring-black/10" },
  low: { label: "Low", chip: "bg-black/5 text-ink ring-black/10" }
} as const;

function Badge({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        className
      )}
    >
      {children}
    </span>
  );
}

export function RestaurantCard({
  restaurant
}: {
  restaurant: Restaurant;
}) {
  const audience = audienceMeta[restaurant.discourse_tags.audience];
  const backupImage = useMemo(() => {
    // Always use a real photo as backup (no gradients/placeholders).
    // Use Wikimedia Commons FilePath to tolerate CDN variations.
    switch (restaurant.discourse_tags.audience) {
      case "local":
        return "https://commons.wikimedia.org/wiki/Special:FilePath/Tim_Ho_Wan_restaurant_at_Sham_Shui_Po_(20190126130901).jpg";
      case "tourist":
        return "https://commons.wikimedia.org/wiki/Special:FilePath/Afternoon_Tea_in_the_Peninsula%2C_Hong_Kong.jpg";
      case "mixed":
        return "https://commons.wikimedia.org/wiki/Special:FilePath/Temple_Street_Night_Market%2C_Kowloon%2C_Hong_Kong_3.jpg";
    }
  }, [restaurant.discourse_tags.audience]);

  const [imgSrc, setImgSrc] = useState(restaurant.image);

  return (
    <div className="w-[320px] overflow-hidden rounded-2xl bg-card shadow-lg ring-1 ring-border transition-shadow hover:shadow-xl">
      <div className="relative h-40 w-full">
        <img
          src={imgSrc}
          alt={`${restaurant.name} photo`}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            // If original image fails (404/hotlink), switch to a real backup photo.
            if (imgSrc !== backupImage) setImgSrc(backupImage);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <div className="absolute left-3 top-3">
          <Badge className={audience.chip}>{audience.label}</Badge>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <div className="text-sm text-muted">{restaurant.district}</div>
          <div className="text-base font-semibold leading-snug tracking-tight text-ink">
            {restaurant.name}
          </div>
          <div className="text-sm font-medium text-ink/90">{restaurant.dish}</div>
        </div>

        <p className="text-sm leading-relaxed text-muted">{restaurant.description}</p>

        <div className="flex flex-wrap gap-1.5">
          <Badge className={levelMeta[restaurant.discourse_tags.authenticity].chip}>
            Authenticity: {levelMeta[restaurant.discourse_tags.authenticity].label}
          </Badge>
          <Badge className={levelMeta[restaurant.discourse_tags.trendiness].chip}>
            Trendiness: {levelMeta[restaurant.discourse_tags.trendiness].label}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {restaurant.keywords.map((k) => (
            <Badge
              key={k}
              className="bg-white text-ink ring-black/10 shadow-[0_1px_0_rgba(17,24,39,0.06)]"
            >
              {k}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

