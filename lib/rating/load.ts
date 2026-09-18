import { Types } from "mongoose";

import { User } from "@/database";
import connectDB from "@/lib/mongodb";
import type { PlayerRatingSeed } from "@/lib/rating/seed";

export async function loadUserRatingSeeds(
  userIds: Array<string | undefined | null>,
): Promise<Record<string, PlayerRatingSeed>> {
  const uniqueIds = [
    ...new Set(
      userIds
        .map((id) => id?.trim())
        .filter((id): id is string => {
          if (!id) return false;
          return Types.ObjectId.isValid(id);
        }),
    ),
  ];

  if (uniqueIds.length === 0) return {};

  await connectDB();

  const users = await User.find({
    _id: { $in: uniqueIds.map((id) => new Types.ObjectId(id)) },
  })
    .select("rating careerWins")
    .lean<Array<{ _id: unknown; rating?: number | null; careerWins?: number }>>();

  const seeds: Record<string, PlayerRatingSeed> = {};
  for (const user of users) {
    seeds[String(user._id)] = {
      rating: user.rating ?? null,
      careerWins: user.careerWins ?? 0,
    };
  }

  return seeds;
}
