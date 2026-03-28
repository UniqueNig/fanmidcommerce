"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/src/lib/authClient";
import { client } from "@/src/lib/apolloClient";

export const useAutoLogout = () => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (!token) return;

      if (isTokenExpired(token)) {
        // console.log("⏰ Token expired — logging out");

        localStorage.removeItem("token");
        client.clearStore();

        router.push("/login");
      }
    };

    // Run immediately
    checkToken();

    // Run every 1 minute
    const interval = setInterval(checkToken, 60 * 1000);

    return () => clearInterval(interval);
  }, [router]);
};