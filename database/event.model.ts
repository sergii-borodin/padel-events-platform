import {
  HydratedDocument,
  Model,
  Schema,
  SchemaDefinitionProperty,
  model,
  models,
} from "mongoose";

/* =========================
   Types
========================= */

export interface EventDocument {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: Date; // ✅ FIXED: real Date
  time: string; // HH:MM
  venueType: "inside" | "outside";
  minRating: number;
  maxRating: number;
  maxParticipants: number;
  duration: number;
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

type EventModel = Model<EventDocument>;

/* =========================
   Helpers
========================= */

function requireTrimmedString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required.`);
  }
  return value.trim();
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeTime(value: string): string {
  const v = value.trim();

  const match24 = v.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (match24) {
    return `${match24[1].padStart(2, "0")}:${match24[2]}`;
  }

  const match12 = v.match(/^(0?[1-9]|1[0-2]):([0-5]\d)\s*([AaPp][Mm])$/);

  if (!match12) {
    throw new Error("Invalid time format (HH:MM or HH:MM AM/PM)");
  }

  let hours = parseInt(match12[1], 10);
  const minutes = match12[2];
  const period = match12[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

/* =========================
   Schema Fields
========================= */

const stringField = (name: string): SchemaDefinitionProperty<string> => ({
  type: String,
  required: [true, `${name} is required.`],
  trim: true,
  validate: {
    validator: (v: string) => v.trim().length > 0,
    message: `${name} cannot be empty.`,
  },
});

/* =========================
   Schema
========================= */

const eventSchema = new Schema<EventDocument, EventModel>(
  {
    title: stringField("title"),

    slug: {
      type: String,
      // unique: true,
      index: true,
      trim: true,
    },

    description: stringField("description"),
    overview: stringField("overview"),
    image: stringField("image"),
    venue: stringField("venue"),
    location: stringField("location"),

    date: {
      type: Date,
      required: [true, "date is required."],
    },

    time: stringField("time"),

    venueType: {
      type: String,
      required: true,
      enum: ["inside", "outside"],
    },

    minRating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    maxRating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },

    duration: {
      type: Number,
      required: true,
      min: 1, // minutes
    },

    organizer: stringField("organizer"),

    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) =>
          Array.isArray(arr) &&
          arr.length > 0 &&
          arr.every((t) => typeof t === "string" && t.trim()),
        message: "tags must contain non-empty strings",
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

/* =========================
   Indexes (important)
========================= */

// fast lookup
eventSchema.index({ slug: 1 }, { unique: true });

// real-world queries
eventSchema.index({ date: 1, location: 1 });
eventSchema.index({ venueType: 1, date: 1 });

/* =========================
   Pre-save logic
========================= */

eventSchema.pre("save", async function () {
  const doc = this as HydratedDocument<EventDocument>;

  // sanitize strings
  doc.title = requireTrimmedString(doc.title, "title");
  doc.description = requireTrimmedString(doc.description, "description");
  doc.overview = requireTrimmedString(doc.overview, "overview");
  doc.image = requireTrimmedString(doc.image, "image");
  doc.venue = requireTrimmedString(doc.venue, "venue");
  doc.location = requireTrimmedString(doc.location, "location");
  doc.organizer = requireTrimmedString(doc.organizer, "organizer");

  doc.time = normalizeTime(requireTrimmedString(doc.time, "time"));
  doc.tags = doc.tags.map((t) => requireTrimmedString(t, "tag"));

  // cross-field validation
  if (doc.minRating > doc.maxRating) {
    throw new Error("minRating cannot be greater than maxRating");
  }

  // slug generation + collision handling
  if (doc.isModified("title") || !doc.slug) {
    const baseSlug = createSlug(doc.title);

    let slug = baseSlug;
    let counter = 1;

    while (
      await (doc.constructor as EventModel).exists({
        slug,
        _id: { $ne: doc._id },
      })
    ) {
      slug = `${baseSlug}-${counter++}`;
    }

    doc.slug = slug;
  }
});

/* =========================
   Model export
========================= */

export const Event =
  (models.Event as EventModel | undefined) ||
  model<EventDocument, EventModel>("Event", eventSchema);
