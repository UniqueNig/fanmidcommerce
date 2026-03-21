"use client";

import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();
  setTimeout(() => {
    router.push("/");
  }, 5000);
  return (
    <>
      <div>Not Found bro</div>
      <div>Navigating to homepage in 5s</div>
    </>
  );
};

export default NotFound;
