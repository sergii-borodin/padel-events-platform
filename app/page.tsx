import ExploreBtn from "./components/ExploreBtn";

const Home = async () => {
  return (
    <section className="relative">
      <h1 className="text-center p-3">The Hub for Every Padel Player</h1>
      <h3 className="text-center p-3">
        Here you can browse, book and create padel events
      </h3>
      <p className="text-center mt-5">
        Rating, Marketplace, News and chats are coming soon...
      </p>

      <ExploreBtn />
    </section>
  );
};

export default Home;
