import ExploreBtn from "./components/ExploreBtn";

const Home = async () => {
  return (
    <section className="relative">
      <h1 className="text-center pb-1">The Hub for Every Padel Player</h1>
      <p className="text-center mt-5">Events, Statistic, Marketplace</p>

      <ExploreBtn />
    </section>
  );
};

export default Home;
