const EventDetailsPage = async ({ params }: any) => {
  const { slug } = await params;
  return <div>Event {slug}</div>;
};

export default EventDetailsPage;
