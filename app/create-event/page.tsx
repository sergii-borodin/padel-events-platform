"use client";
import React from "react";
import CreateEventForm from "../components/CreateEventForm";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";

const CreateNewEvent = () => {
  const router = useRouter();
  const { user, loading, login, signup, logout } = useAuth();
  return <>{user ? <CreateEventForm /> : router.push("/auth")}</>;
};

export default CreateNewEvent;
