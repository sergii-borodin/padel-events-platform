import {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
  models,
} from "mongoose";

import { Event } from "./event.model";

export interface BookingDocument {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

type BookingModel = Model<BookingDocument>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<BookingDocument, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "eventId is required."],
      index: true,
    },
    email: {
      type: String,
      required: [true, "email is required."],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => emailPattern.test(value),
        message: "email must be a valid email address.",
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

bookingSchema.index({ eventId: 1, email: 1 }, { unique: true });
bookingSchema.pre(
  "save",
  async function preSave(this: HydratedDocument<BookingDocument>) {
    if (typeof this.email !== "string" || this.email.trim().length === 0) {
      throw new Error("email is required.");
    }

    this.email = this.email.trim().toLowerCase();

    if (!emailPattern.test(this.email)) {
      throw new Error("email must be a valid email address.");
    }

    const eventExists = await Event.exists({ _id: this.eventId });

    if (!eventExists) {
      throw new Error("Referenced event does not exist.");
    }
  },
);

export const Booking =
  (models.Booking as BookingModel | undefined) ??
  model<BookingDocument, BookingModel>("Booking", bookingSchema);
