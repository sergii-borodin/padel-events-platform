import { cookies } from "next/headers";
import { Types } from "mongoose";
import { getAdminAuth } from "@/lib/firebase/admin";
import { User } from "@/database";
import { upsertUserFromFirebase } from "@/lib/actions/user.actions";
import connectDB from "@/lib/mongodb";

const SESSION_COOKIE_NAME = "session";

export async function getCurrentUser() {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    return decoded; // uid, email, etc.
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function getCurrentMongoUserId(): Promise<Types.ObjectId | null> {
  const decoded = await getCurrentUser();
  const firebaseUid = decoded?.uid?.trim();
  if (!firebaseUid) return null;

  try {
    await connectDB();

    const user = await User.findOne({ firebaseUid })
      .select("_id")
      .lean<{ _id: unknown } | null>();

    if (!user?._id) return null;

    return user._id instanceof Types.ObjectId
      ? user._id
      : new Types.ObjectId(String(user._id));
  } catch (error) {
    console.error("getCurrentMongoUserId failed", error);
    return null;
  }
}

export type OrganizerDisplayName =
  | {
      ok: true;
      displayName: string;
      firebaseUid: string;
      userId: string;
    }
  | {
      ok: false;
      status: 401 | 409;
      message: string;
    };

export async function requireOrganizerDisplayName(): Promise<OrganizerDisplayName> {
  let decoded;
  try {
    decoded = await requireUser();
  } catch {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  const firebaseUid = decoded.uid?.trim();
  if (!firebaseUid) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  const email = typeof decoded.email === "string" ? decoded.email : "";
  const tokenName = typeof decoded.name === "string" ? decoded.name : undefined;

  if (!email) {
    return {
      ok: false,
      status: 409,
      message: "Add your first and last name before hosting an event.",
    };
  }

  const result = await upsertUserFromFirebase({
    firebaseUid,
    email,
    displayName: tokenName,
  });

  if (result.status !== "created" && result.status !== "updated") {
    return {
      ok: false,
      status: 409,
      message: "Add your first and last name before hosting an event.",
    };
  }

  const firstName = String(result.user.firstName ?? "").trim();
  const lastName = String(result.user.lastName ?? "").trim();

  if (!firstName || !lastName) {
    return {
      ok: false,
      status: 409,
      message: "Add your first and last name before hosting an event.",
    };
  }

  return {
    ok: true,
    displayName: `${firstName} ${lastName}`,
    firebaseUid,
    userId: result.user.id,
  };
}
