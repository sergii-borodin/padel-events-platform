import BookEvent from "@/app/components/BookEvent";
import { getCurrentBookingPrefill } from "@/lib/auth/server";

export function BookEventFallback() {
  return (
    <div id="book-event" aria-busy="true" aria-label="Loading booking form">
      <div className="h-10 animate-pulse rounded bg-white/10" />
      <div className="mt-2 h-10 animate-pulse rounded bg-white/10" />
      <div className="mt-2 h-10 animate-pulse rounded bg-white/10" />
      <div className="mt-3 h-10 animate-pulse rounded bg-white/10" />
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
  const prefill = await getCurrentBookingPrefill();

  return (
    <BookEvent
      eventId={eventId}
      slug={slug}
      defaultFirstName={prefill?.firstName ?? ""}
      defaultLastName={prefill?.lastName ?? ""}
      defaultEmail={prefill?.email ?? ""}
    />
  );
}
