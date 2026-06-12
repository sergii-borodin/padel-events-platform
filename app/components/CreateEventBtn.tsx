"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import posthog from "posthog-js";

const CreateEventBtn = () => {
  return (
    <button
      type="button"
      id="create-event-btn"
      className="mt-7 mx-auto"
      onClick={() => {
        posthog.capture("create_new-event_clicked");
        redirect("/create-event");
      }}>
      <a href="#events">
        Create New Event
        <Image
          src="/icons/calendar.svg"
          alt="calendar"
          width={24}
          height={24}
        />
      </a>
    </button>
  );
};

export default CreateEventBtn;
