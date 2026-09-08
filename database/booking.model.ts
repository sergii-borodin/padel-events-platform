import {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
  models,
} from "mongoose";

/* =========================
   Types
========================= */

export interface IBooking {
  eventId: Types.ObjectId;
  userId?: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

type BookingModel = Model<IBooking>;

/* =========================
   Schema
========================= */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<IBooking, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "eventId is required."],
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    firstName: {
      type: String,
      required: [true, "firstName is required."],
      trim: true,
    },

    lastName: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      required: [true, "email is required."],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => EMAIL_PATTERN.test(value),
        message: "email must be a valid email address.",
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

/* =========================
   Indexes
========================= */

// One booking per email per event
bookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

/* =========================
   Pre-save hook
========================= */

// NOTE: Event existence is intentionally not checked here.
// Validate that the referenced event exists in your route/service layer
// before creating a booking. Doing it here would:
//   1. Create a circular import risk (booking.model ↔ event.model)
//   2. Add an extra DB round-trip on every save
//   3. Duplicate logic that belongs at the API boundary

bookingSchema.pre("save", function (this: HydratedDocument<IBooking>) {
  // Mongoose schema already applies trim + lowercase, but we guard
  // against any raw pre-schema manipulation reaching this point.
  if (!EMAIL_PATTERN.test(this.email)) {
    throw new Error("email must be a valid email address.");
  }
});

/* =========================
   Model export
========================= */

// In development, drop the cached model so schema/hook edits apply after HMR.
if (process.env.NODE_ENV !== "production" && models.Booking) {
  delete models.Booking;
}

export const Booking =
  (models.Booking as BookingModel | undefined) ??
  model<IBooking, BookingModel>("Booking", bookingSchema);
