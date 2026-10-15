"use server";

import { User } from "@/database";
import connectDB from "@/lib/mongodb";

export type UpsertUserFromFirebaseInput = {
  firebaseUid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  /** Firebase display name, used only to fill a missing first or last name. */
  displayName?: string;
};

export type UpsertedUser = {
  id: string;
  firebaseUid: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type UpsertUserResult =
  | { status: "created" | "updated"; user: UpsertedUser }
  | { status: "skipped" }
  | { status: "error" };

type UserLean = {
  _id: unknown;
  firebaseUid: string;
  email: string;
  firstName: string;
  lastName: string;
};

const isDuplicateKeyError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: unknown }).code === 11000;

function namesFromDisplayName(displayName?: string): {
  firstName: string;
  lastName: string;
} {
  const parts = displayName?.trim().split(/\s+/).filter(Boolean) ?? [];
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

function serializeUser(user: UserLean): UpsertedUser {
  return {
    id: String(user._id),
    firebaseUid: user.firebaseUid,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

function profileUpdates(
  existing: UserLean,
  normalizedUid: string,
  normalizedEmail: string,
  normalizedFirstName: string,
  normalizedLastName: string,
): Partial<UserLean> {
  const updates: Partial<UserLean> = {};

  if (existing.firebaseUid !== normalizedUid) {
    updates.firebaseUid = normalizedUid;
  }
  if (existing.email !== normalizedEmail) {
    updates.email = normalizedEmail;
  }
  if (!existing.firstName?.trim() && normalizedFirstName) {
    updates.firstName = normalizedFirstName;
  }
  if (!existing.lastName?.trim() && normalizedLastName) {
    updates.lastName = normalizedLastName;
  }

  return updates;
}

async function saveProfile(
  existing: UserLean,
  updates: Partial<UserLean>,
): Promise<UpsertedUser> {
  if (Object.keys(updates).length > 0) {
    await User.updateOne({ _id: existing._id }, { $set: updates });
  }

  return serializeUser({ ...existing, ...updates });
}

export const upsertUserFromFirebase = async ({
  firebaseUid,
  email,
  firstName,
  lastName,
  displayName,
}: UpsertUserFromFirebaseInput): Promise<UpsertUserResult> => {
  const normalizedUid = firebaseUid.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const fromDisplayName = namesFromDisplayName(displayName);
  const normalizedFirstName = firstName?.trim() || fromDisplayName.firstName;
  const normalizedLastName = lastName?.trim() || fromDisplayName.lastName;

  if (!normalizedUid || !normalizedEmail) {
    return { status: "error" };
  }

  try {
    await connectDB();

    const existingByUid = await User.findOne({
      firebaseUid: normalizedUid,
    }).lean<UserLean | null>();

    if (existingByUid) {
      return {
        status: "updated",
        user: await saveProfile(
          existingByUid,
          profileUpdates(
            existingByUid,
            normalizedUid,
            normalizedEmail,
            normalizedFirstName,
            normalizedLastName,
          ),
        ),
      };
    }

    // The same email can already belong to a profile created under an older
    // Firebase account. Keep that profile and point it at the current login.
    const existingByEmail = await User.findOne({
      email: normalizedEmail,
    }).lean<UserLean | null>();

    if (existingByEmail) {
      return {
        status: "updated",
        user: await saveProfile(
          existingByEmail,
          profileUpdates(
            existingByEmail,
            normalizedUid,
            normalizedEmail,
            normalizedFirstName,
            normalizedLastName,
          ),
        ),
      };
    }

    if (!normalizedFirstName || !normalizedLastName) {
      return { status: "skipped" };
    }

    try {
      const created = await User.create({
        firebaseUid: normalizedUid,
        email: normalizedEmail,
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
      });

      return {
        status: "created",
        user: serializeUser(created),
      };
    } catch (error) {
      if (!isDuplicateKeyError(error)) {
        throw error;
      }

      const raced =
        (await User.findOne({ firebaseUid: normalizedUid }).lean<
          UserLean | null
        >()) ??
        (await User.findOne({ email: normalizedEmail }).lean<UserLean | null>());

      if (!raced) {
        return { status: "error" };
      }

      return {
        status: "updated",
        user: await saveProfile(
          raced,
          profileUpdates(
            raced,
            normalizedUid,
            normalizedEmail,
            normalizedFirstName,
            normalizedLastName,
          ),
        ),
      };
    }
  } catch (error) {
    console.error("upsert user from firebase failed", error);
    return { status: "error" };
  }
};
