import {
  getLeaderboard,
  getMyRating,
  type LeaderboardRow,
  type MyRating,
} from "@/lib/actions/rating.actions";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Rating",
};

function RatingFallback() {
  return (
    <section className="rating-page" aria-busy="true" aria-label="Loading rating">
      <div className="h-8 w-40 animate-pulse rounded bg-white/10" />
      <div className="mt-6 h-40 animate-pulse rounded-[10px] bg-white/10" />
      <div className="mt-6 h-64 animate-pulse rounded-[10px] bg-white/10" />
    </section>
  );
}

function YourRatingCard({ me }: { me: MyRating }) {
  if (me.rating == null) {
    return (
      <section className="rating-card" aria-labelledby="your-rating-heading">
        <h2 id="your-rating-heading">Your rating</h2>
        <p className="rating-card__empty">
          Play a ranked event to get a number. Finish a tournament while logged
          in and your results will count.
        </p>
      </section>
    );
  }

  return (
    <section className="rating-card" aria-labelledby="your-rating-heading">
      <h2 id="your-rating-heading">Your rating</h2>
      <p className="rating-card__value">{me.rating}</p>
      <p className="rating-card__scale">0–1000 from tournament points</p>
      <dl className="rating-card__stats">
        <div>
          <dt>Rank</dt>
          <dd>{me.rank != null ? `#${me.rank}` : "—"}</dd>
        </div>
        <div>
          <dt>Events</dt>
          <dd>{me.eventsPlayed}</dd>
        </div>
        <div>
          <dt>Wins</dt>
          <dd>{me.careerWins}</dd>
        </div>
      </dl>
      {me.lastEvent ? (
        <p className="rating-card__last">
          Last event:{" "}
          <Link href={`/events/${me.lastEvent.slug}`}>{me.lastEvent.title}</Link>
        </p>
      ) : null}
    </section>
  );
}

function LeaderboardTable({
  rows,
  currentUserId,
}: {
  rows: LeaderboardRow[];
  currentUserId?: string | null;
}) {
  if (rows.length === 0) {
    return (
      <p className="tournament-empty">
        No rated players yet. Finish a tournament while logged in to appear
        here.
      </p>
    );
  }

  return (
    <div className="standings-table-wrap">
      <table className="standings-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Player</th>
            <th scope="col">Rating</th>
            <th scope="col">Events</th>
            <th scope="col">Wins</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isYou = currentUserId === row.userId;
            return (
              <tr key={row.userId} className={isYou ? "is-you" : undefined}>
                <td>{row.rank}</td>
                <td className="standings-table__name">
                  {isYou ? `You · ${row.name}` : row.name}
                </td>
                <td>{row.rating}</td>
                <td>{row.eventsPlayed}</td>
                <td>{row.careerWins}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

async function RatingContent() {
  const [leaderboard, me] = await Promise.all([
    getLeaderboard(),
    getMyRating(),
  ]);

  return (
    <section className="rating-page">
      <header className="rating-page__header">
        <h1>Rating</h1>
        <p>
          Career score from finished americano and mexicano tournaments. Higher
          is better. Guests are not ranked.
        </p>
      </header>

      {me ? <YourRatingCard me={me} /> : null}

      <section aria-labelledby="leaderboard-heading">
        <h2 id="leaderboard-heading">Leaderboard</h2>
        <LeaderboardTable rows={leaderboard} currentUserId={me?.userId} />
      </section>
    </section>
  );
}

export default function RatingPage() {
  return (
    <Suspense fallback={<RatingFallback />}>
      <RatingContent />
    </Suspense>
  );
}
