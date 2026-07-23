import { cacheLife } from "next/cache";
import EventCard from "../components/EventCard";
import type { IEvent } from "@/database/event.model";
import CreateEventBtn from "../components/CreateEventBtn";
import { getEvents } from "@/lib/actions/event.actions";

const Home = async () => {
  "use cache";
  cacheLife("minutes");
  const events: IEvent[] = await getEvents();

  return (
    <section className="relative">
      <CreateEventBtn />
      <div className="mt-20 space-y-7">
        <h3>Explore and book a game you like</h3>
        {events.length === 0 ? (
          <p>
            Unfortunately, no events to join at the moment. Please, check later
            for updates. Remember you can always create your own event here.
          </p>
        ) : (
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
                  bookingsCount={event.bookingsCount ?? 0}
                  maxParticipants={event.maxParticipants}
                  duration={event.duration}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Home;
