"use client";

import { formatRestaurantName, type Restaurant } from "@/data/restaurants";
import clsx from "clsx";
import { useEffect, useState } from "react";

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
  const discourseLabelMap: Record<Restaurant["discourse_source"][number], string> = {
    local_discourse: "Local Discourse",
    tourist: "Tourist",
    social_media: "Social Media",
    prestige_cultural: "Prestige & Cultural Discourse"
  };
  const frameLabelMap: Record<Restaurant["discourse_frame"][number], string> = {
    authenticity: "Authenticity",
    everyday_value: "Everyday value",
    trend_hype: "Trend hype"
  };
  const photoUrl = restaurant.photo_url ?? null;
  const displayName = formatRestaurantName(restaurant);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const showPhoto = Boolean(photoUrl) && !photoFailed;

  useEffect(() => {
    setPhotoLoaded(false);
    setPhotoFailed(false);
    setZoomOpen(false);
  }, [photoUrl, restaurant.id]);

  return (
    <div className="w-[320px] rounded-2xl bg-card shadow-lg ring-1 ring-border transition-shadow hover:shadow-xl">
      <div className="relative h-40 w-full overflow-hidden rounded-t-2xl bg-slate-100">
        {showPhoto ? (
          <button
            type="button"
            onClick={() => {
              if (photoLoaded) setZoomOpen(true);
            }}
            className="block h-full w-full cursor-zoom-in"
            aria-label={`View full image of ${displayName}`}
          >
            <img
              src={photoUrl ?? ""}
              alt={`${displayName} photo`}
              className={clsx(
                "h-40 w-full object-contain object-center transition-opacity duration-300",
                photoLoaded ? "opacity-100" : "opacity-0"
              )}
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={() => setPhotoLoaded(true)}
              onError={() => setPhotoFailed(true)}
            />
          </button>
        ) : null}
        {!photoLoaded && showPhoto ? (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100" />
        ) : null}
        {showPhoto && photoLoaded ? (
          <div className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white">
            Click to zoom
          </div>
        ) : null}
        {!showPhoto ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
              Photo unavailable
            </span>
          </div>
        ) : null}
      </div>
      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <div className="text-sm text-muted">{restaurant.district}</div>
          <div className="text-base font-semibold leading-snug tracking-tight text-ink">
            {displayName}
          </div>
          <div className="text-sm font-medium text-ink/90">{restaurant.amenity.replaceAll("_", " ")}</div>
        </div>

        <p className="text-sm leading-relaxed text-muted">{restaurant.address}</p>

        <div className="flex flex-wrap gap-1.5">
          <Badge className="bg-indigo-50 text-indigo-700 ring-indigo-200">
            Source: {restaurant.source.provider}
          </Badge>
          <Badge className="bg-sky-50 text-sky-700 ring-sky-200">
            Discourse: {restaurant.discourse_source.map((item) => discourseLabelMap[item]).join(" + ")}
          </Badge>
          <Badge className="bg-purple-50 text-purple-700 ring-purple-200">
            Frame: {restaurant.discourse_frame.map((item) => frameLabelMap[item]).join(" + ")}
          </Badge>
          {restaurant.opening_hours ? (
            <Badge className="bg-black/5 text-ink ring-black/10">Opening hours available</Badge>
          ) : null}
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-2">
          <div className="text-[11px] font-semibold tracking-wide text-slate-600">
            Restaurant introduction
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            {restaurant.coding_evidence[0] ?? "No introduction available."}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {restaurant.cuisine.length > 0 ? restaurant.cuisine.map((k) => (
            <Badge
              key={k}
              className="bg-white text-ink ring-black/10 shadow-[0_1px_0_rgba(17,24,39,0.06)]"
            >
              {k.replaceAll("_", " ")}
            </Badge>
          )) : <span className="text-xs text-muted">No cuisine tag on source record.</span>}
        </div>
        <a
          href={restaurant.source.osm_url}
          target="_blank"
          rel="noreferrer"
          className={clsx(
            "inline-flex rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-100"
          )}
        >
          Open source record
        </a>
      </div>

      {zoomOpen && showPhoto ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${displayName} image zoom`}
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-800 hover:bg-white"
          >
            Close
          </button>
          <img
            src={photoUrl ?? ""}
            alt={`${displayName} full photo`}
            className="max-h-[92vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}

