import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FanMidCommerce",
  description:
    "A fan-made e-commerce website built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
