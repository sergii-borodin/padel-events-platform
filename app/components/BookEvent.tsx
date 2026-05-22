"use client";

import React from "react";
import { useState } from "react";

const BookEvent = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTimeout(() => {
      setSubmitted((prevState) => !prevState);
    }, 1000);
  };
  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing in!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
