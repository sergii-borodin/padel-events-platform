import connectDB from "@/lib/mongodb";
import { Event, type IEvent } from "@/database/event.model";
import { Booking } from "@/database/booking.model";

type EventWithBookings = IEvent & { _id: string };

const bookingsLookupStages = [
  {
    $lookup: {
      from: Booking.collection.name,
      localField: "_id",
      foreignField: "eventId",
      as: "bookings",
    },
  },
  {
    $addFields: {
      bookingsCount: { $size: "$bookings" },
    },
  },
  {
    $project: {
      bookings: 0,
    },
  },
] as const;

function serializeEvent<T extends { _id: unknown }>(
  event: T,
): Omit<T, "_id"> & { _id: string } {
  return {
    ...event,
    _id: String(event._id),
  };
}

export const getEvents = async (): Promise<EventWithBookings[]> => {
  try {
    await connectDB();

    const events = await Event.aggregate<IEvent & { _id: unknown }>([
      ...bookingsLookupStages,
      { $sort: { createdAt: -1 } },
    ]);

    return events.map(serializeEvent);
  } catch {
    return [];
  }
};

export const getEventBySlug = async (
  slug: string,
): Promise<EventWithBookings | null> => {
  try {
    await connectDB();

    const [event] = await Event.aggregate<IEvent & { _id: unknown }>([
      { $match: { slug } },
      ...bookingsLookupStages,
      { $limit: 1 },
    ]);

    return event ? serializeEvent(event) : null;
  } catch {
    return null;
  }
};

export const getSimilarEventBySlug = async (slug: string) => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug }).lean<
      IEvent & { _id: string }
    >();

    if (!event) {
      return [];
    }

    const similar = await Event.aggregate<IEvent & { _id: unknown }>([
      {
        $match: {
          _id: { $ne: event._id },
          tags: { $in: event.tags },
          minRating: { $lte: event.maxRating },
          maxRating: { $gte: event.minRating },
        },
      },
      ...bookingsLookupStages,
    ]);

    return similar.map(serializeEvent);
  } catch {
    return [];
  }
};
