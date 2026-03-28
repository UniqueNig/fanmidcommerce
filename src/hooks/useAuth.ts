"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login"); // Redirect if not logged in
    } else {
      setLoading(false); // User is authenticated
    }
  }, [router]);

  return { loading };
};