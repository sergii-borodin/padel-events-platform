"use client";
import React, { useEffect } from "react";
import CreateEventForm from "../components/CreateEventForm";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";

const CreateNewEvent = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return <CreateEventForm />;
};

export default CreateNewEvent;
