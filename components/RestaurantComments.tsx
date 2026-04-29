"use client";

import { useEffect, useMemo, useState } from "react";

type CommentItem = {
  id: string;
  restaurant_id: string;
  nickname: string;
  content: string;
  rating: number | null;
  created_at: string;
};

export function RestaurantComments({ restaurantId }: { restaurantId: string }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const endpoint = useMemo(
    () => `/api/restaurants/${encodeURIComponent(restaurantId)}/comments`,
    [restaurantId]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(endpoint)
      .then(async (response) => {
        const payload = (await response.json()) as { comments?: CommentItem[]; error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Failed to load comments.");
        if (!cancelled) setComments(payload.comments ?? []);
      })
      .catch((fetchError: unknown) => {
        if (!cancelled) setError((fetchError as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          content,
          rating: rating === "" ? null : Number(rating)
        })
      });
      const payload = (await response.json()) as { comment?: CommentItem; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Failed to submit comment.");
      if (payload.comment) setComments((current) => [payload.comment!, ...current]);
      setContent("");
      setRating("");
      setSuccess("Comment posted.");
    } catch (submitError: unknown) {
      setError((submitError as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
      <div className="text-[11px] font-semibold tracking-wide text-slate-600">Visitor comments</div>
      <form onSubmit={handleSubmit} className="mt-2 space-y-2">
        <input
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="Nickname"
          maxLength={40}
          required
          className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Share your experience..."
          maxLength={600}
          required
          rows={3}
          className="w-full resize-y rounded-md border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
        />
        <div className="flex items-center gap-2">
          <select
            value={rating}
            onChange={(event) => setRating(event.target.value === "" ? "" : Number(event.target.value))}
            className="rounded-md border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
          >
            <option value="">No rating</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post comment"}
          </button>
        </div>
      </form>

      {error ? <div className="mt-2 text-xs text-rose-600">{error}</div> : null}
      {success ? <div className="mt-2 text-xs text-emerald-600">{success}</div> : null}

      <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
        {loading ? <div className="text-xs text-slate-500">Loading comments...</div> : null}
        {!loading && comments.length === 0 ? (
          <div className="text-xs text-slate-500">No comments yet. Be the first to share.</div>
        ) : null}
        {comments.map((item) => (
          <div key={item.id} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">{item.nickname}</span>
              <span className="text-[11px] text-slate-500">
                {item.rating ? `${item.rating}/5` : "No rating"}
              </span>
            </div>
            <div className="mt-1 text-xs leading-relaxed text-slate-600">{item.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
