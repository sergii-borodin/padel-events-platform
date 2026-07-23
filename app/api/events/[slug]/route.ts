import { NextResponse } from "next/server";
import { Error as MongooseError } from "mongoose";

import { getEventBySlug } from "@/lib/actions/event.actions";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeAndValidateSlug(rawSlug: string | undefined): string {
  const slug = rawSlug?.trim();

  if (!slug) {
    throw new Error("Missing required route parameter: slug.");
  }

  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(
      "Invalid slug format. Use lowercase letters, numbers, and hyphens only.",
    );
  }

  return slug;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    // Next.js 15+ passes params as a Promise — must await before use.
    const { slug: rawSlug } = await context.params;
    const slug = normalizeAndValidateSlug(rawSlug);
    const event = await getEventBySlug(slug);

    if (!event) {
      return NextResponse.json(
        { message: `Event not found for slug "${slug}".` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully.", event },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (
        error.message === "Missing required route parameter: slug." ||
        error.message.startsWith("Invalid slug format")
      ) {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
    }

    if (error instanceof MongooseError.ValidationError) {
      return NextResponse.json(
        {
          message: "Validation error while fetching event.",
          error: error.message,
        },
        { status: 400 },
      );
    }

    console.error("Failed to fetch event by slug:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching event." },
      { status: 500 },
    );
  }
}
