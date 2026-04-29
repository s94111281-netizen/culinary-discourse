import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { restaurants } from "@/data/restaurants";
import { getSupabaseServer } from "@/lib/supabase-server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const rateLimitBucket = new Map<string, number[]>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_POSTS = 5;
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;
const defaultBlockedWords = ["spam", "scam", "fake", "fraud", "shit", "垃圾", "骗子"];

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "0.0.0.0";
  return request.headers.get("x-real-ip") ?? "0.0.0.0";
}

function hashIp(ip: string) {
  const salt = process.env.COMMENTS_IP_SALT ?? "culinary-discourse-comment-salt";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

function passesRateLimit(ipHash: string, now: number) {
  const current = rateLimitBucket.get(ipHash) ?? [];
  const withinWindow = current.filter((value) => now - value <= RATE_WINDOW_MS);
  if (withinWindow.length >= RATE_MAX_POSTS) return false;
  withinWindow.push(now);
  rateLimitBucket.set(ipHash, withinWindow);
  return true;
}

function validateRestaurant(restaurantId: string) {
  return restaurants.some((restaurant) => restaurant.id === restaurantId);
}

function getBlockedWords() {
  const fromEnv = (process.env.COMMENTS_BLOCKLIST ?? "")
    .split(",")
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : defaultBlockedWords;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const supabaseServer = getSupabaseServer();
  const { id } = await context.params;
  if (!validateRestaurant(id)) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const { data, error } = await supabaseServer
    .from("restaurant_comments")
    .select("id, restaurant_id, nickname, content, rating, created_at")
    .eq("restaurant_id", id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    return NextResponse.json({ error: "Failed to load comments." }, { status: 500 });
  }

  return NextResponse.json({ comments: data ?? [] });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const supabaseServer = getSupabaseServer();
  const { id } = await context.params;
  if (!validateRestaurant(id)) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const body = (await request.json()) as {
    nickname?: string;
    content?: string;
    rating?: number | null;
  };

  const nickname = normalizeWhitespace(body.nickname ?? "");
  const content = normalizeWhitespace(body.content ?? "");
  const rating = body.rating ?? null;

  if (nickname.length < 1 || nickname.length > 40) {
    return NextResponse.json(
      { error: "Nickname must be between 1 and 40 characters." },
      { status: 400 }
    );
  }
  if (content.length < 3 || content.length > 600) {
    return NextResponse.json(
      { error: "Comment must be between 3 and 600 characters." },
      { status: 400 }
    );
  }
  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return NextResponse.json({ error: "Rating must be an integer from 1 to 5." }, { status: 400 });
  }
  const lowerContent = content.toLowerCase();
  if (getBlockedWords().some((word) => lowerContent.includes(word))) {
    return NextResponse.json(
      { error: "Your comment contains blocked words. Please revise and try again." },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  const now = Date.now();
  if (!passesRateLimit(ipHash, now)) {
    return NextResponse.json(
      { error: "Too many comments from this network. Please try again later." },
      { status: 429 }
    );
  }

  const duplicateCutoff = new Date(now - DUPLICATE_WINDOW_MS).toISOString();
  const { data: duplicateRows, error: duplicateError } = await supabaseServer
    .from("restaurant_comments")
    .select("id")
    .eq("restaurant_id", id)
    .eq("ip_hash", ipHash)
    .eq("content", content)
    .gte("created_at", duplicateCutoff)
    .limit(1);
  if (duplicateError) {
    return NextResponse.json({ error: "Failed to validate comment." }, { status: 500 });
  }
  if ((duplicateRows ?? []).length > 0) {
    return NextResponse.json(
      { error: "Duplicate comment detected. Please wait before posting again." },
      { status: 409 }
    );
  }

  const { data, error } = await supabaseServer
    .from("restaurant_comments")
    .insert({
      restaurant_id: id,
      nickname,
      content,
      rating,
      ip_hash: ipHash
    })
    .select("id, restaurant_id, nickname, content, rating, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not submit comment right now." }, { status: 500 });
  }

  return NextResponse.json({ comment: data }, { status: 201 });
}
