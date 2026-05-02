import type { Metadata } from "next";
import AboutUsClient from "./AboutUsClient";

export const metadata: Metadata = {
  title: "About Us | API Tech",
  description:
    "Learn about API Tech—our mission, vision, and commitment to building reliable, secure digital infrastructure.",
};

export default function AboutUsPage() {
  return <AboutUsClient />;
}