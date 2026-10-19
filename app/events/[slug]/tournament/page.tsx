import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import TournamentApp from "@/app/components/tournament/TournamentApp";
import PadelCatcherLoader from "@/app/components/PadelCatcherLoader";
import { getEventParticipants } from "@/lib/actions/booking.actions";
import { getEventBySlug } from "@/lib/actions/event.actions";
import { getTournamentBySlug } from "@/lib/actions/tournament.actions";
import { isCurrentUserOrganizer } from "@/lib/auth/server";

export default function TournamentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={<PadelCatcherLoader label="Loading tournament…" />}>
      <TournamentPageContent params={params} />
    </Suspense>
  );
}

async function TournamentPageContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return notFound();
  if (!(await isCurrentUserOrganizer(event.organizerId))) {
    redirect(`/events/${slug}`);
  }

  const [participants, tournament] = await Promise.all([
    getEventParticipants(event._id),
    getTournamentBySlug(slug),
  ]);

  const lineupNames =
    tournament?.lineupFields
      .flatMap((field) =>
        field.slots.map((slot) =>
          [slot.firstName, slot.lastName].filter(Boolean).join(" "),
        ),
      )
      .join("|") ?? "";

  return (
    <section id="tournament">
      <TournamentApp
        key={`${tournament?.id ?? "setup"}-${participants.length}-${tournament?.players.length ?? 0}-${lineupNames}`}
        slug={slug}
        eventTitle={event.title}
        participants={participants}
        maxParticipants={event.maxParticipants}
        initialTournament={tournament}
      />
    </section>
  );
}
