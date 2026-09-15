export type RatingEventResult = {
  points: number;
  matchesPlayed: number;
  pointsTo: number;
  wins: number;
};

export type UserRating = {
  rating: number | null;
  ratingPoints: number;
  ratingPossible: number;
  eventsPlayed: number;
  careerWins: number;
};

const UNRATED: UserRating = {
  rating: null,
  ratingPoints: 0,
  ratingPossible: 0,
  eventsPlayed: 0,
  careerWins: 0,
};

export function computeUserRating(
  results: RatingEventResult[],
): UserRating {
  let ratingPoints = 0;
  let ratingPossible = 0;
  let eventsPlayed = 0;
  let careerWins = 0;

  for (const result of results) {
    if (result.matchesPlayed <= 0 || result.pointsTo <= 0) continue;

    ratingPoints += result.points;
    ratingPossible += result.matchesPlayed * result.pointsTo;
    eventsPlayed += 1;
    careerWins += result.wins;
  }

  if (ratingPossible <= 0) {
    return { ...UNRATED };
  }

  return {
    rating: Math.min(
      1000,
      Math.max(0, Math.round((1000 * ratingPoints) / ratingPossible)),
    ),
    ratingPoints,
    ratingPossible,
    eventsPlayed,
    careerWins,
  };
}
