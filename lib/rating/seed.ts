export type PlayerRatingSeed = {
  rating: number | null;
  careerWins: number;
};

export function comparePlayersByRating(
  a: { userId?: string; name: string },
  b: { userId?: string; name: string },
  ratings: Map<string, PlayerRatingSeed>,
): number {
  const aSeed = a.userId ? ratings.get(a.userId) : undefined;
  const bSeed = b.userId ? ratings.get(b.userId) : undefined;
  const aRated = aSeed?.rating != null;
  const bRated = bSeed?.rating != null;

  if (aRated && bRated) {
    if (bSeed!.rating !== aSeed!.rating) {
      return bSeed!.rating! - aSeed!.rating!;
    }
    if (bSeed!.careerWins !== aSeed!.careerWins) {
      return bSeed!.careerWins - aSeed!.careerWins;
    }
    return a.name.localeCompare(b.name);
  }

  if (aRated) return -1;
  if (bRated) return 1;

  if (a.userId && b.userId) {
    return a.name.localeCompare(b.name);
  }
  if (a.userId) return -1;
  if (b.userId) return 1;

  return a.name.localeCompare(b.name);
}
