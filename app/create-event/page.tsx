"use client";
import React from "react";
import CreateEventForm from "../components/CreateEventForm";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";

const CreateNewEvent = () => {
  const router = useRouter();
  const { user, loading, login, signup, logout } = useAuth();

  // const createEventHandler = async () => {
  //   await fetch("/api/events", {
  //     method: "POST",
  //     headers: { "Content-Type": "multipart/form-data" },
  //     body: JSON.stringify(),
  //   });
  // };
  return <>{user ? <CreateEventForm /> : router.push("/auth")}</>;
};

export default CreateNewEvent;
