"use server";

import connectDB from "@/lib/mongodb";
import { Event, type IEvent } from "@/database/event.model";
import { Booking } from "@/database/booking.model";

export const getSimilarEventBySlug = async (slug: string) => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug }).lean<
      IEvent & { _id: string }
    >();

    if (!event) {
      return [];
    }

    return await Event.aggregate<IEvent>([
      {
        $match: {
          _id: { $ne: event._id },
          tags: { $in: event.tags },
          minRating: { $lte: event.maxRating },
          maxRating: { $gte: event.minRating },
        },
      },
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
    ]);
  } catch {
    return [];
  }
};
