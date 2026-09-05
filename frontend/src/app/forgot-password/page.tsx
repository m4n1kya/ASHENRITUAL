/**
 * @fileoverview ASHENRITUAL Architecture
 * @module page.tsx
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type Form = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: Form) {
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", data);
      setSuccess(true);
      toast.success("Recovery email sent.");
    } catch {
      // Don't leak user existence
      setSuccess(true);
      toast.success("Recovery email sent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-8 pt-[60px] texture-grain">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-[360px]"
      >
        <div className="mb-12 text-center">
          <Link
            href="/"
            className="font-heading text-[13px] font-semibold tracking-[0.3em] text-[#E8E8E8] transition-opacity hover:opacity-60"
          >
            ASHENRITUAL
          </Link>
          <h1 className="mt-8 font-heading text-3xl font-semibold uppercase tracking-[0.1em] text-[#E8E8E8]">
            Reset Password
          </h1>
          <p className="mt-2 text-[12px] text-[#8D8D8D]">
            Enter your email to receive recovery instructions.
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <p className="text-[13px] text-[#E8E8E8]">
              If an account exists for that email, we have sent instructions to
              reset your password.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D] hover:text-[#E8E8E8] transition-colors"
            >
              Return to login <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-2 block font-heading text-[9px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D]">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                autoComplete="email"
                className={cn(
                  "w-full border bg-transparent px-4 py-3 text-[13px] text-[#E8E8E8] placeholder:text-[#8D8D8D]/30",
                  "focus:outline-none transition-colors duration-300",
                  errors.email
                    ? "border-red-900/60 focus:border-red-700"
                    : "border-[#202020] focus:border-[#E8E8E8]/30",
                )}
              />
              {errors.email && (
                <p className="mt-1.5 text-[10px] text-red-500/80">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex h-11 w-full items-center justify-center gap-4 border border-[#E8E8E8]/20 text-[10px] font-medium uppercase tracking-[0.3em] text-[#E8E8E8] transition-all duration-500 hover:bg-[#E8E8E8] hover:text-[#0A0A0A] disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Send Instructions
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        )}

        {!success && (
          <p className="mt-10 text-center text-[11px] text-[#8D8D8D]">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-[#E8E8E8] transition-colors hover:text-[#8D8D8D]"
            >
              Sign in
            </Link>
          </p>
        )}
      </motion.div>
    </main>
  );
}
