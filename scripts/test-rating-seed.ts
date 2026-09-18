import assert from "node:assert/strict";
import { comparePlayersByRating } from "../lib/rating/seed";

const ratings = new Map([
  ["u-high", { rating: 900, careerWins: 1 }],
  ["u-mid", { rating: 500, careerWins: 8 }],
  ["u-unrated", { rating: null, careerWins: 0 }],
]);

const players = [
  { userId: "u-unrated", name: "Zoe" },
  { userId: undefined, name: "Guest" },
  { userId: "u-mid", name: "Mia" },
  { userId: "u-high", name: "Alex" },
];

players.sort((a, b) => comparePlayersByRating(a, b, ratings));

assert.deepEqual(
  players.map((player) => player.name),
  ["Alex", "Mia", "Zoe", "Guest"],
);

console.log("test-rating-seed: ok");
