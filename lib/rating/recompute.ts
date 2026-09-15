import { Types } from "mongoose";

import { Tournament, User } from "@/database";
import {
  computeUserRating,
  type RatingEventResult,
} from "@/lib/rating/compute";
import { computeStandings } from "@/lib/tournament";
import type { ResultSorting } from "@/lib/tournament";
import connectDB from "@/lib/mongodb";

type FinishedTournamentLean = {
  _id: unknown;
  pointsTo: number;
  resultSorting?: ResultSorting;
  players: Array<{ id: string; name: string; userId?: string }>;
  rounds: Parameters<typeof computeStandings>[1];
};

function toObjectId(id: string): Types.ObjectId | null {
  if (!Types.ObjectId.isValid(id)) return null;
  const objectId = new Types.ObjectId(id);
  return String(objectId) === id ? objectId : null;
}

function collectResultsByUser(
  tournaments: FinishedTournamentLean[],
  userIds: Set<string>,
): Map<string, RatingEventResult[]> {
  const resultsByUser = new Map<string, RatingEventResult[]>();
  for (const userId of userIds) {
    resultsByUser.set(userId, []);
  }

  for (const tournament of tournaments) {
    const standings = computeStandings(
      tournament.players,
      tournament.rounds,
      tournament.resultSorting ?? "pointsFirst",
    );
    const standingByPlayerId = new Map(
      standings.map((row) => [row.playerId, row]),
    );
    const countedUsers = new Set<string>();

    for (const player of tournament.players) {
      const userId = player.userId?.trim();
      if (!userId || !userIds.has(userId) || countedUsers.has(userId)) {
        continue;
      }

      const standing = standingByPlayerId.get(player.id);
      if (!standing) continue;

      countedUsers.add(userId);
      resultsByUser.get(userId)?.push({
        points: standing.points,
        matchesPlayed: standing.matchesPlayed,
        pointsTo: tournament.pointsTo,
        wins: standing.wins,
      });
    }
  }

  return resultsByUser;
}

export async function recomputeUserRatings(
  userIds: Array<string | undefined | null>,
): Promise<void> {
  const uniqueIds = [
    ...new Set(
      userIds
        .map((id) => id?.trim())
        .filter((id): id is string => Boolean(id && toObjectId(id))),
    ),
  ];

  if (uniqueIds.length === 0) return;

  await connectDB();

  const tournaments = await Tournament.find({
    status: "finished",
    "players.userId": { $in: uniqueIds },
  })
    .select("players rounds pointsTo resultSorting")
    .lean<FinishedTournamentLean[]>();

  const resultsByUser = collectResultsByUser(tournaments, new Set(uniqueIds));

  const updates = uniqueIds.flatMap((userId) => {
    const objectId = toObjectId(userId);
    if (!objectId) return [];

    const rating = computeUserRating(resultsByUser.get(userId) ?? []);
    return [
      {
        updateOne: {
          filter: { _id: objectId },
          update: {
            $set: {
              rating: rating.rating,
              ratingPoints: rating.ratingPoints,
              ratingPossible: rating.ratingPossible,
              eventsPlayed: rating.eventsPlayed,
              careerWins: rating.careerWins,
            },
          },
        },
      },
    ];
  });

  if (updates.length === 0) return;

  await User.bulkWrite(updates, { ordered: false });
}
