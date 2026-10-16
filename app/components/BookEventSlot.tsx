import BookEvent from "@/app/components/BookEvent";
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

  return (
    <BookEvent
      eventId={eventId}
      slug={slug}
      userId={userId?.toString() ?? ""}
    />
  );
}
