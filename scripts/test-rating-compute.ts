import assert from "node:assert/strict";
import { computeUserRating } from "../lib/rating/compute";

const rated = computeUserRating([
  { points: 105, matchesPlayed: 5, pointsTo: 32, wins: 3 },
  { points: 78, matchesPlayed: 6, pointsTo: 21, wins: 2 },
]);

assert.equal(rated.ratingPoints, 183);
assert.equal(rated.ratingPossible, 286);
assert.equal(rated.eventsPlayed, 2);
assert.equal(rated.careerWins, 5);
assert.equal(rated.rating, 640);

const empty = computeUserRating([]);
assert.equal(empty.rating, null);
assert.equal(empty.ratingPoints, 0);
assert.equal(empty.eventsPlayed, 0);

const sitOutOnly = computeUserRating([
  { points: 0, matchesPlayed: 0, pointsTo: 21, wins: 0 },
]);
assert.equal(sitOutOnly.rating, null);
assert.equal(sitOutOnly.eventsPlayed, 0);

const mixedWithSitOut = computeUserRating([
  { points: 0, matchesPlayed: 0, pointsTo: 21, wins: 0 },
  { points: 105, matchesPlayed: 5, pointsTo: 32, wins: 3 },
]);
assert.equal(mixedWithSitOut.eventsPlayed, 1);
assert.equal(mixedWithSitOut.ratingPossible, 160);
assert.equal(mixedWithSitOut.rating, Math.round((1000 * 105) / 160));

console.log("test-rating-compute: ok");
