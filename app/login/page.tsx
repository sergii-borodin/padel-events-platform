"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { useAuth } from "@/app/providers/AuthProvider";

type AuthMode = "login" | "signup";

function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      default:
        break;
    }
  }

  return "Something went wrong. Please try again.";
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, signup, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
    }
  }, [loading, user, router, redirectTo]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      router.push(redirectTo);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
  };

  if (loading || user) {
    return <p className="text-light-200 text-center text-sm">Redirecting...</p>;
  }

  return (
    <div id="login" className="mx-auto w-full max-w-md">
      <h1 className="text-center text-4xl max-sm:text-3xl">
        {mode === "login" ? "Welcome back" : "Create account"}
      </h1>
      <p className="text-light-200 mt-3 text-center text-sm">
        {mode === "login"
          ? "Sign in to create and manage padel events."
          : "Sign up to start organizing padel events."}
      </p>

      <div className="mt-8 flex gap-2">
        <button
          type="button"
          className={`flex-1 rounded-[6px] px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "login"
              ? "bg-primary text-black"
              : "bg-dark-200 text-light-200 hover:text-white"
          }`}
          onClick={() => switchMode("login")}
          disabled={submitting}>
          Sign in
        </button>
        <button
          type="button"
          className={`flex-1 rounded-[6px] px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "signup"
              ? "bg-primary text-black"
              : "bg-dark-200 text-light-200 hover:text-white"
          }`}
          onClick={() => switchMode("signup")}
          disabled={submitting}>
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            autoComplete="email"
            disabled={submitting}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            minLength={6}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            disabled={submitting}
          />
        </div>

        {error && (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting
            ? "Please wait..."
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <p className="text-light-200 text-center text-sm">Loading...</p>
      }>
      <LoginForm />
    </Suspense>
  );
}
