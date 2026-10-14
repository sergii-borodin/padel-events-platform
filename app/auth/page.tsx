"use client";

import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

type AuthMode = "login" | "signup";

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <section className="flex flex-col items-center justify-center px-0 sm:px-4">
      <div className="w-full max-w-sm">
        {/* Tab toggle */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === "login"
                ? "border-b-2 border-slate-800 text-slate-800"
                : "text-gray-400 hover:text-gray-600"
            }`}>
            Log in
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === "signup"
                ? "border-b-2 border-slate-800 text-slate-800"
                : "text-gray-400 hover:text-gray-600"
            }`}>
            Sign up
          </button>
        </div>

        {/* Form */}
        {mode === "login" ? (
          <LoginForm />
        ) : (
          <SignupForm onSuccess={() => setMode("login")} />
        )}
      </div>
    </section>
  );
};

export default AuthPage;
