"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";
import PadelCatcherLoader from "@/app/components/PadelCatcherLoader";
import Link from "next/link";

const BookEvent = ({
  eventId,
  slug,
  userId,
  alreadyBooked,
}: {
  eventId: string;
  slug: string;
  userId: string;
  alreadyBooked: boolean;
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getErrorMessage = (reason: string) => {
    switch (reason) {
      case "duplicate":
        return "This email has already booked a spot for this event.";
      case "full":
        return "Sorry, this event is fully booked.";
      case "event-not-found":
      case "invalid-event":
        return "This event is no longer available.";
      case "unauthorized":
        return "Sign in to book this event.";
      default:
        return "Booking failed. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await createBooking({
        eventId,
        slug,
      });

      if (result.success) {
        setSubmitted(true);
        router.refresh();
        posthog.capture("event_booked", { eventId, slug, userId });
      } else {
        console.error("Booking creation failed");
        posthog.captureException("Booking creation failed");
        setError(getErrorMessage(result.reason));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return userId !== "" ? (
    <div id="book-event">
      {submitting && <PadelCatcherLoader overlay label="Booking your spot…" />}
      {submitted || alreadyBooked ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <button type="submit" className="button-submit" disabled={submitting}>
            {submitting ? "Booking…" : "Book"}
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      )}
    </div>
  ) : (
    <>
      <p className="text-sm text-red-500">
        To book an event, you need to have an account and be logged in.
      </p>
      <Link href="/auth" className="text-sm underline">
        Go to Login/Register page
      </Link>
    </>
  );
};
export default BookEvent;
