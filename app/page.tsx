import EventCard from "./components/EventCard";
import ExploreBtn from "./components/ExploreBtn";

const events = [
  {
    title: "Sunset Padel Open",
    imageUrl: "/images/event1.png",
    slug: "sunset-padel-open",
    location: "Barcelona, Spain",
    date: "May 18, 2026",
    time: "18:30",
  },
  {
    title: "Weekend Champions Cup",
    imageUrl: "/images/event2.png",
    slug: "weekend-champions-cup",
    location: "Lisbon, Portugal",
    date: "May 25, 2026",
    time: "10:00",
  },
  {
    title: "City Club Night Matches",
    imageUrl: "/images/event3.png",
    slug: "city-club-night-matches",
    location: "Madrid, Spain",
    date: "June 2, 2026",
    time: "20:15",
  },
  {
    title: "Coastal Doubles Challenge",
    imageUrl: "/images/event4.png",
    slug: "coastal-doubles-challenge",
    location: "Valencia, Spain",
    date: "June 9, 2026",
    time: "17:45",
  },
  {
    title: "Rising Stars Qualifier",
    imageUrl: "/images/event5.png",
    slug: "rising-stars-qualifier",
    location: "Seville, Spain",
    date: "June 14, 2026",
    time: "12:00",
  },
  {
    title: "Grand Slam Training Day",
    imageUrl: "/images/event6.png",
    slug: "grand-slam-training-day",
    location: "Malaga, Spain",
    date: "June 21, 2026",
    time: "09:30",
  },
];

const Home = () => {
  return (
    <section className="relative">
      <h1 className="text-center">The Hub for Every Padel Player</h1>
      <p className="text-center mt-5">Events, Statistic, Marketplace</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Future Events</h3>
        <ul className="events">
          {events.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
