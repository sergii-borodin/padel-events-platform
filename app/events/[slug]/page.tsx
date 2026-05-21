import { notFound } from "next/navigation";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const formatEventDate = (date: string | Date): string => {
  const parsed = typeof date === "string" ? new Date(date) : date;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatVenueType = (venueType: string): string =>
  venueType.charAt(0).toUpperCase() + venueType.slice(1);

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const response = await fetch(`${BASE_URL}/api/events/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) return notFound();

  const {
    event: {
      title,
      description,
      overview,
      image,
      venue,
      location,
      date,
      time,
      venueType,
      minRating,
      maxRating,
      maxParticipants,
      organizer,
      tags,
      duration,
    },
  } = await response.json();

  if (!description) return notFound();

  const getGameTimeRange = (
    startTime: string,
    durationMinutes: number,
  ): string => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);

    const totalStartMinutes = startHours * 60 + startMinutes;
    const totalEndMinutes = totalStartMinutes + durationMinutes;

    const endHours = Math.floor(totalEndMinutes / 60);
    const endMinutes = totalEndMinutes % 60;

    const pad = (n: number): string => String(n).padStart(2, "0");

    return `${startTime} – ${pad(endHours)}:${pad(endMinutes)}`;
  };

  return (
    <section id="event">
      <div className="header">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        <div className="content">
          <Image
            src={image}
            alt={title}
            width={1200}
            height={457}
            className="banner"
            priority
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          {tags.length > 0 && (
            <section className="flex-col-gap-2">
              <h2>Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <span key={tag} className="pill">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={formatEventDate(date)}
            />
            <EventDetailItem
              icon="/icons/clock.svg"
              alt="clock"
              label={getGameTimeRange(time, Number(duration))}
            />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem
              icon="/icons/mode.svg"
              alt="venue"
              label={`${formatVenueType(venueType)} · ${venue}`}
            />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="participants"
              label={`0 / ${maxParticipants} participants`}
            />
            <p>
              Expected players rating: {minRating}–{maxRating}
            </p>
            <p>Duration: {duration} min</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Organizer</h2>
            <p>{organizer}</p>
          </section>
        </div>

        <aside className="booking">
          <div className="signup-card">
            <p className="text-lg font-semibold">Book Event</p>
            <p className="text-light-200 text-sm">{title}</p>
            <p className="text-light-200 text-sm">
              {formatVenueType(venueType)} · {venue}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EventDetailsPage;
