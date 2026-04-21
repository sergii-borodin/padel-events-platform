import React from "react";
import ExploreBtn from "./components/ExploreBtn";
import Image from "next/image";

const Home = () => {
  return (
    <section className="relative">
      <h1 className="text-center">The Hub for Every Padel Player</h1>
      <p className="text-center mt-5">Events, Statistic, Marketplace</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Future Games</h3>
        <ul className="events">
          {[1, 2, 3, 4, 5].map((event) => (
            <li key={event}>Event {event}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
