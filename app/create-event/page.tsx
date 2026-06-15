"use client";
import React from "react";
import CreateEventForm from "../components/CreateEventForm";
import { useAuth } from "../providers/AuthProvider";
import { redirect } from "next/navigation";

const CreateNewEvent = () => {
  const { user, loading, login, signup, logout } = useAuth();
  return <>{user ? <CreateEventForm /> : redirect("/login")}</>;
};

export default CreateNewEvent;
