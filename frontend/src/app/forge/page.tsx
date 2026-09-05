/**
 * @fileoverview ASHENRITUAL Architecture
 * @module page.tsx
 */
import { Suspense } from "react";
import type { Metadata } from "next";
import { ForgeClient } from "./ForgeClient";

export const metadata: Metadata = {
  title: "FORGE — ASHENRITUAL",
  description:
    "Explore the Forge, where every ASHENRITUAL collection begins through thoughtful material selection, architectural design, and timeless craftsmanship.",
};

export default function ForgePage() {
  return (
    <main className="min-h-screen bg-background texture-grain">
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="h-4 w-4 bg-[#202020] animate-ping rounded-full" />
          </div>
        }
      >
        <ForgeClient />
      </Suspense>
    </main>
  );
}
