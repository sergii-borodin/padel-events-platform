import {
  HydratedDocument,
  Model,
  Schema,
  model,
  models,
  SchemaDefinitionProperty,
} from "mongoose";

export interface EventDocument {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
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

function requireTrimmedString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} is required.`);
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

function normalizeDateInput(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("date must be a valid date.");
  }

  // Persist dates in ISO format so queries and comparisons stay predictable.
  return parsedDate.toISOString();
}

function normalizeTimeInput(value: string): string {
  const normalized = value.trim();

  const twentyFourHourMatch = normalized.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (twentyFourHourMatch) {
    const [, hours, minutes] = twentyFourHourMatch;
    return `${hours.padStart(2, "0")}:${minutes}`;
  }

  const twelveHourMatch = normalized.match(
    /^(0?[1-9]|1[0-2]):([0-5]\d)\s*([AaPp][Mm])$/,
  );

  if (!twelveHourMatch) {
    throw new Error("time must use HH:MM or H:MM AM/PM format.");
  }

  const [, rawHours, minutes, meridiem] = twelveHourMatch;
  let hours = Number.parseInt(rawHours, 10);

  if (meridiem.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  }

  if (meridiem.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  // Store time in 24-hour format for consistent display and filtering.
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

const stringField = (fieldName: string): SchemaDefinitionProperty<string> => ({
  type: String,
  required: [true, `${fieldName} is required.`],
  trim: true,
  validate: {
    validator: (value: string) => value.trim().length > 0,
    message: `${fieldName} is required.`,
  },
});

const eventSchema = new Schema<EventDocument, EventModel>(
  {
    title: stringField("title"),
    slug: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
    description: stringField("description"),
    overview: stringField("overview"),
    image: stringField("image"),
    venue: stringField("venue"),
    location: stringField("location"),
    date: stringField("date"),
    time: stringField("time"),
    venueType: {
      type: String,
      required: [true, "venueType is required."],
      trim: true,
      enum: {
        values: ["inside", "outside"],
        message: "venueType must be either inside or outside.",
      },
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "venueType is required.",
      },
    },
    minRating: {
      type: Number,
      required: [true, "minRating is required."],
    },
    maxRating: {
      type: Number,
      required: [true, "maxRating is required."],
    },
    maxParticipants: {
      type: Number,
      required: [true, "maxParticipants is required."],
    },
    duration: {
      type: Number,
      required: [true, "duration is required."],
    },
    organizer: stringField("organizer"),
    tags: {
      type: [String],
      required: [true, "tags are required."],
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every(
            (tag) => typeof tag === "string" && tag.trim().length > 0,
          ),
        message: "tags must contain at least one non-empty string.",
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

eventSchema.index({ slug: 1 }, { unique: true });

eventSchema.pre(
  "save",
  function preSave(this: HydratedDocument<EventDocument>) {
    this.title = requireTrimmedString(this.title, "title");
    this.description = requireTrimmedString(this.description, "description");
    this.overview = requireTrimmedString(this.overview, "overview");
    this.image = requireTrimmedString(this.image, "image");
    this.venue = requireTrimmedString(this.venue, "venue");
    this.location = requireTrimmedString(this.location, "location");
    this.venueType = requireTrimmedString(
      this.venueType,
      "venueType",
    ) as EventDocument["venueType"];
    this.organizer = requireTrimmedString(this.organizer, "organizer");
    this.date = normalizeDateInput(requireTrimmedString(this.date, "date"));
    this.time = normalizeTimeInput(requireTrimmedString(this.time, "time"));
    this.tags = this.tags.map((tag) => requireTrimmedString(tag, "tags"));

    if (this.isModified("title") || !this.slug) {
      this.slug = createSlug(this.title);
    }
  },
);

export const Event =
  (models.Event as EventModel | undefined) ??
  model<EventDocument, EventModel>("Event", eventSchema);
