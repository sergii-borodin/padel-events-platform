import BookEvent from "@/app/components/BookEvent";
import { Booking } from "@/database";
import { getCurrentMongoUserId } from "@/lib/auth/server";

export function BookEventFallback() {
  return (
    <div id="book-event" aria-busy="true" aria-label="Loading booking form">
      <div className="h-10 animate-pulse rounded bg-white/10" />
    </div>
  );
}

export default async function BookEventSlot({
  eventId,
  slug,
}: {
  eventId: string;
  slug: string;
}) {
  const userId = await getCurrentMongoUserId();

  const alreadyBooked = userId
    ? Boolean(await Booking.exists({ eventId, userId }))
    : false;

  return (
    <BookEvent
      eventId={eventId}
      slug={slug}
      userId={userId?.toString() ?? ""}
      alreadyBooked={alreadyBooked}
    />
  );
}
