"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (reason: string) => {
    switch (reason) {
      case "duplicate":
        return "This email has already booked a spot for this event.";
      case "full":
        return "Sorry, this event is fully booked.";
      case "event-not-found":
      case "invalid-event":
        return "This event is no longer available.";
      default:
        return "Booking failed. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await createBooking({ eventId, email });

    if (result.success) {
      setSubmitted(true);
      posthog.capture("event_booked", { eventId, slug, email });
    } else {
      console.error("Booking creation failed");
      posthog.captureException("Booking creation failed");
      setError(getErrorMessage(result.reason));
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email address"
            />
          </div>

          <button type="submit" className="button-submit">
            Submit
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      )}
    </div>
  );
};
export default BookEvent;
