"use client";

import { useState, SubmitEvent } from "react";
import { useAuth } from "../providers/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const submitHandler = async (e: SubmitEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div>
      <h3 className="text-center mb-2">Login form</h3>
      <form
        action="submit"
        onSubmit={(e) => submitHandler(e)}
        className="border-2 rounded-4xl">
        <div className="flex flex-col p-4 px-6">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            placeholder="Enter your email address"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            placeholder="Enter your password"
          />
          <button
            type="submit"
            className="rounded-2xl px-4 p-2 bg-slate-300 text-black mt-2">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
