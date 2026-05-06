import EventCard from "./components/EventCard";
import ExploreBtn from "./components/ExploreBtn";
import type { EventDocument } from "@/database/event.model";

const events: EventDocument[] = [
  {
    title: "Sunset Padel Open",
    slug: "sunset-padel-open",
    description: "An after-work padel competition for intermediate players.",
    overview: "Play group-stage matches at sunset with knockout rounds.",
    image: "/images/event1.png",
    venue: "Club Mar Padel",
    location: "Barcelona, Spain",
    date: new Date("May 18, 2026"),
    time: "18:30",
    venueType: "outside",
    minRating: 2.5,
    maxRating: 4.5,
    maxParticipants: 48,
    duration: 180,
    organizer: "Padel Nights",
    tags: ["sunset", "tournament", "intermediate"],
    createdAt: new Date("2026-02-01T10:00:00.000Z"),
    updatedAt: new Date("2026-02-05T14:00:00.000Z"),
  },
  {
    title: "Weekend Champions Cup",
    slug: "weekend-champions-cup",
    description: "A weekend cup focused on competitive doubles.",
    overview: "Team up and play a high-intensity weekend ladder.",
    image: "/images/event2.png",
    venue: "Arena Lisboa",
    location: "Lisbon, Portugal",
    date: new Date("May 25, 2026"),
    time: "10:00",
    venueType: "inside",
    minRating: 3,
    maxRating: 5,
    maxParticipants: 64,
    duration: 240,
    organizer: "Lisbon Padel Hub",
    tags: ["weekend", "cup", "advanced"],
    createdAt: new Date("2026-02-03T10:00:00.000Z"),
    updatedAt: new Date("2026-02-10T11:30:00.000Z"),
  },
  {
    title: "City Club Night Matches",
    slug: "city-club-night-matches",
    description: "Evening city league sessions with rotating opponents.",
    overview: "Fast-paced matches under lights in a social format.",
    image: "/images/event3.png",
    venue: "Madrid Central Club",
    location: "Madrid, Spain",
    date: new Date("June 2, 2026"),
    time: "20:15",
    venueType: "inside",
    minRating: 2,
    maxRating: 4,
    maxParticipants: 40,
    duration: 150,
    organizer: "City Club League",
    tags: ["night", "league", "social"],
    createdAt: new Date("2026-02-08T09:00:00.000Z"),
    updatedAt: new Date("2026-02-12T16:20:00.000Z"),
  },
  {
    title: "Coastal Doubles Challenge",
    slug: "coastal-doubles-challenge",
    description: "Friendly doubles challenge by the coast.",
    overview: "Compete in beachside courts and enjoy post-match networking.",
    image: "/images/event4.png",
    venue: "Valencia Sea Courts",
    location: "Valencia, Spain",
    date: new Date("June 9, 2026"),
    time: "17:45",
    venueType: "outside",
    minRating: 2,
    maxRating: 4.2,
    maxParticipants: 32,
    duration: 180,
    organizer: "Coastal Sports",
    tags: ["coast", "doubles", "community"],
    createdAt: new Date("2026-02-09T13:00:00.000Z"),
    updatedAt: new Date("2026-02-13T09:40:00.000Z"),
  },
  {
    title: "Rising Stars Qualifier",
    slug: "rising-stars-qualifier",
    description: "Qualifier for emerging players aiming for the finals.",
    overview: "Top-ranked players advance to the Rising Stars finals.",
    image: "/images/event5.png",
    venue: "Seville Premier Padel",
    location: "Seville, Spain",
    date: new Date("June 14, 2026"),
    time: "12:00",
    venueType: "inside",
    minRating: 3.2,
    maxRating: 5,
    maxParticipants: 24,
    duration: 210,
    organizer: "Rising Stars Org",
    tags: ["qualifier", "talent", "competitive"],
    createdAt: new Date("2026-02-15T08:30:00.000Z"),
    updatedAt: new Date("2026-02-15T08:30:00.000Z"),
  },
  {
    title: "Grand Slam Training Day",
    slug: "grand-slam-training-day",
    description: "Intensive training day with drills and coaching.",
    overview: "Skill clinics, endurance sessions, and tactical play.",
    image: "/images/event6.png",
    venue: "Malaga Pro Academy",
    location: "Malaga, Spain",
    date: new Date("June 21, 2026"),
    time: "09:30",
    venueType: "inside",
    minRating: 1.8,
    maxRating: 4.8,
    maxParticipants: 36,
    duration: 300,
    organizer: "Pro Padel Academy",
    tags: ["training", "coaching", "all-levels"],
    createdAt: new Date("2026-02-18T07:45:00.000Z"),
    updatedAt: new Date("2026-02-20T10:15:00.000Z"),
  },
];

const bookingCountsBySlug: Record<string, number> = {
  "sunset-padel-open": 36,
  "weekend-champions-cup": 46,
  "city-club-night-matches": 33,
  "coastal-doubles-challenge": 21,
  "rising-stars-qualifier": 20,
  "grand-slam-training-day": 16,
};

const Home = () => {
  return (
    <section className="relative">
      <h1 className="text-center pb-1">The Hub for Every Padel Player</h1>
      <p className="text-center mt-5">Events, Statistic, Marketplace</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Future Events</h3>
        <ul className="events">
          {events.map((event) => (
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
