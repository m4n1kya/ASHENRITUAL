/**
 * @fileoverview ASHENRITUAL Architecture
 * @module page.tsx
 */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        await api.post("/auth/verify-email", { token });
        setStatus("success");
        toast.success("Email verified successfully.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err) {
        setStatus("error");
        toast.error("Verification failed. Token may be invalid or expired.");
      }
    };

    verify();
  }, [token, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-[360px] text-center"
    >
      <div className="mb-12">
        <Link
          href="/"
          className="font-heading text-[13px] font-semibold tracking-[0.3em] text-[#E8E8E8] transition-opacity hover:opacity-60"
        >
          ASHENRITUAL
        </Link>
        <h1 className="mt-8 font-heading text-3xl font-semibold uppercase tracking-[0.1em] text-[#E8E8E8]">
          Identity Verification
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6">
        {status === "loading" && (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-[#8D8D8D]" />
            <p className="text-[12px] text-[#8D8D8D]">
              Verifying your email...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-8 w-8 text-green-500/80" />
            <p className="text-[12px] text-[#8D8D8D]">
              Your email has been verified. Redirecting to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-8 w-8 text-red-500/80" />
            <p className="text-[12px] text-[#8D8D8D]">
              Verification link is invalid or expired.
            </p>
            <Link
              href="/login"
              className="mt-6 flex h-11 w-full items-center justify-center gap-4 border border-[#E8E8E8]/20 text-[10px] font-medium uppercase tracking-[0.3em] text-[#E8E8E8] transition-all duration-500 hover:bg-[#E8E8E8] hover:text-[#0A0A0A]"
            >
              Return to Login
            </Link>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-8 pt-[60px] texture-grain">
      <Suspense
        fallback={<Loader2 className="h-6 w-6 animate-spin text-[#8D8D8D]" />}
      >
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}
