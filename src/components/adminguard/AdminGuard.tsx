"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Decode token
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role !== "admin") {
        router.push("/");
      }

      // ⏱ Auto logout timer (extra safety)
      const expTime = payload.exp * 1000;
      const now = Date.now();

      if (expTime < now) {
        document.cookie = "token=; max-age=0";
        router.push("/admin/login");
      } else {
        setTimeout(() => {
          document.cookie = "token=; max-age=0";
          router.push("/admin/login");
        }, expTime - now);
      }
    } catch {
      router.push("/admin/login");
    }
  }, []);

  return <>{children}</>;
}