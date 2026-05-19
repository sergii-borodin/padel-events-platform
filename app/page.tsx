import EventCard from "./components/EventCard";
import ExploreBtn from "./components/ExploreBtn";
import type { IEvent } from "@/database/event.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const bookingCountsBySlug: Record<string, number> = {
  "sunset-padel-open": 36,
  "weekend-champions-cup": 46,
  "city-club-night-matches": 33,
  "coastal-doubles-challenge": 21,
  "rising-stars-qualifier": 20,
  "grand-slam-training-day": 16,
};

const Home = async () => {
  const response = await fetch(`${BASE_URL}/api/events`, {
    cache: "no-store",
  });
  const data = await response.json();
  const events: IEvent[] =
    response.ok && Array.isArray(data.events) ? data.events : [];

  return (
    <section className="relative">
      <h1 className="text-center pb-1">The Hub for Every Padel Player</h1>
      <p className="text-center mt-5">Events, Statistic, Marketplace</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Future Events</h3>
        <ul className="events">
          {events.map((event: IEvent) => (
            <li key={event.slug}>
              <EventCard
                title={event.title}
                image={event.image}
                slug={event.slug}
                location={event.location}
                date={event.date}
                time={event.time}
                venueType={event.venueType}
                minRating={event.minRating}
                maxRating={event.maxRating}
                bookingsCount={bookingCountsBySlug[event.slug] ?? 0}
                maxParticipants={event.maxParticipants}
                duration={event.duration}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
