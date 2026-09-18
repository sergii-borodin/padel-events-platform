"use server";

import { Event, Tournament, User } from "@/database";
import { getCurrentMongoUserId } from "@/lib/auth/server";
import connectDB from "@/lib/mongodb";

export type LeaderboardRow = {
  userId: string;
  rank: number;
  name: string;
  rating: number;
  eventsPlayed: number;
  careerWins: number;
};

export type RatingLastEvent = {
  title: string;
  slug: string;
};

export type MyRating = {
  userId: string;
  name: string;
  rating: number | null;
  rank: number | null;
  eventsPlayed: number;
  careerWins: number;
  lastEvent: RatingLastEvent | null;
};

type RatedUserLean = {
  _id: unknown;
  firstName?: string;
  lastName?: string;
  rating: number;
  eventsPlayed?: number;
  careerWins?: number;
};

function displayName(firstName?: string, lastName?: string): string {
  return [firstName?.trim(), lastName?.trim()].filter(Boolean).join(" ") || "Player";
}

export async function getLeaderboard(): Promise<LeaderboardRow[]> {
  try {
    await connectDB();

    const users = await User.find({ rating: { $ne: null } })
      .select("firstName lastName rating eventsPlayed careerWins")
      .sort({ rating: -1, careerWins: -1, lastName: 1, firstName: 1 })
      .lean<RatedUserLean[]>();

    return users.map((user, index) => ({
      userId: String(user._id),
      rank: index + 1,
      name: displayName(user.firstName, user.lastName),
      rating: user.rating,
      eventsPlayed: user.eventsPlayed ?? 0,
      careerWins: user.careerWins ?? 0,
    }));
  } catch (error) {
    console.error("getLeaderboard failed", error);
    return [];
  }
}

async function getLastFinishedEvent(
  userId: string,
): Promise<RatingLastEvent | null> {
  const tournament = await Tournament.findOne({
    status: "finished",
    "players.userId": userId,
  })
    .sort({ updatedAt: -1 })
    .select("eventId slug")
    .lean<{ eventId?: unknown; slug?: string } | null>();

  if (!tournament?.eventId) return null;

  const event = await Event.findById(tournament.eventId)
    .select("title slug")
    .lean<{ title?: string; slug?: string } | null>();

  const title = event?.title?.trim();
  const slug = event?.slug?.trim() || tournament.slug?.trim();
  if (!title || !slug) return null;

  return { title, slug };
}

export async function getMyRating(): Promise<MyRating | null> {
  try {
    const mongoUserId = await getCurrentMongoUserId();
    if (!mongoUserId) return null;

    await connectDB();

    const user = await User.findById(mongoUserId)
      .select("firstName lastName rating eventsPlayed careerWins")
      .lean<{
        _id: unknown;
        firstName?: string;
        lastName?: string;
        rating?: number | null;
        eventsPlayed?: number;
        careerWins?: number;
      } | null>();

    if (!user) return null;

    const userId = String(user._id);
    const rating = user.rating ?? null;
    const leaderboard = rating == null ? [] : await getLeaderboard();
    const ranked = leaderboard.find((row) => row.userId === userId);

    return {
      userId,
      name: displayName(user.firstName, user.lastName),
      rating,
      rank: ranked?.rank ?? null,
      eventsPlayed: user.eventsPlayed ?? 0,
      careerWins: user.careerWins ?? 0,
      lastEvent: await getLastFinishedEvent(userId),
    };
  } catch (error) {
    console.error("getMyRating failed", error);
    return null;
  }
}
