/**
 * @fileoverview ASHENRITUAL Architecture
 * @module page.tsx
 */
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaPipe } from "./useMediaPipe";
import {
  useSizeStore,
  BodyProfile,
  BodyMeasurements,
  PreferredFit,
  BodyType,
} from "@/store/size.store";
import { useVesperStore } from "@/store/vesper.store";
import { api } from "@/lib/api";
import {
  Camera,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  MessageSquare,
  X,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const PROCESS_STEPS = [
  { id: "INPUT", label: "Baseline" },
  { id: "SCANNING", label: "Alignment" },
  { id: "ANALYZING", label: "Reasoning" },
  { id: "REPORT", label: "Profile" },
];

function getRecommendedSize(chestCm: number, preferredFit: string): string {
  if (chestCm < 92) return preferredFit === "Oversized" ? "M" : "S";
  if (chestCm < 100)
    return preferredFit === "Slim"
      ? "S"
      : preferredFit === "Oversized"
        ? "L"
        : "M";
  if (chestCm < 108)
    return preferredFit === "Slim"
      ? "M"
      : preferredFit === "Oversized"
        ? "XL"
        : "L";
  return preferredFit === "Slim" ? "L" : "XL";
}

export default function SizeIntelligencePage() {
  const router = useRouter();
  const { landmarker, isInitializing } = useMediaPipe();
  const { profile, setProfile } = useSizeStore();

  const [step, setStep] = useState<
    "INPUT" | "SCANNING" | "ANALYZING" | "REPORT"
  >("INPUT");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // User Inputs
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("70");
  const [gender, setGender] = useState("M");
  const [preferredFit, setPreferredFit] = useState("Slim");

  // Live Estimations
  const [estimates, setEstimates] = useState<Partial<BodyMeasurements>>({});
  const [isStable, setIsStable] = useState(false);
  const stableFrames = useRef(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const pendingStream = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      pendingStream.current = stream;
      setStep("SCANNING");
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Camera access is required for Architectural Body Analysis.");
    }
  };

  useEffect(() => {
    if (step === "SCANNING") {
      const interval = setInterval(() => {
        if (videoRef.current && pendingStream.current) {
          videoRef.current.srcObject = pendingStream.current;
          videoRef.current.onloadedmetadata = () =>
            videoRef.current?.play().catch(() => {});
          pendingStream.current = null;
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [step]);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Detection Loop
  useEffect(() => {
    if (
      step !== "SCANNING" ||
      !landmarker ||
      !videoRef.current ||
      !canvasRef.current
    )
      return;

    let lastVideoTime = -1;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderLoop = () => {
      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;

        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const results = landmarker.detectForVideo(video, performance.now());
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.landmarks && results.landmarks.length > 0) {
          const marks = results.landmarks[0];
          ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
          ctx.lineWidth = 1.5;

          const lShoulder = marks[11];
          const rShoulder = marks[12];

          if (lShoulder && rShoulder) {
            ctx.beginPath();
            ctx.moveTo(lShoulder.x * canvas.width, lShoulder.y * canvas.height);
            ctx.lineTo(rShoulder.x * canvas.width, rShoulder.y * canvas.height);
            ctx.stroke();

            const drawJoint = (x: number, y: number) => {
              ctx.beginPath();
              ctx.arc(x, y, 3, 0, 2 * Math.PI);
              ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
              ctx.fill();
            };
            drawJoint(lShoulder.x * canvas.width, lShoulder.y * canvas.height);
            drawJoint(rShoulder.x * canvas.width, rShoulder.y * canvas.height);

            const pixelDist = Math.abs(lShoulder.x - rShoulder.x);
            const estimatedShouldersCm = Math.round(
              pixelDist * parseInt(heightCm) * 1.5
            );

            setEstimates((prev) => ({
              ...prev,
              shoulderWidthCm: estimatedShouldersCm,
            }));

            if (estimatedShouldersCm > 35 && estimatedShouldersCm < 65) {
              stableFrames.current++;
              if (stableFrames.current > 45) {
                setIsStable(true);
              }
            } else {
              stableFrames.current = 0;
            }
          }
        }
      }
      requestRef.current = requestAnimationFrame(renderLoop);
    };

    requestRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [step, landmarker, heightCm]);

  const finalizeAnalysis = async () => {
    stopCamera();
    setStep("ANALYZING");

    const finalMeasurements: BodyMeasurements = {
      heightCm: parseInt(heightCm) || 175,
      weightKg: parseInt(weightKg) || 70,
      shoulderWidthCm: estimates.shoulderWidthCm || 44,
      chestCircumferenceCm: estimates.shoulderWidthCm
        ? estimates.shoulderWidthCm * 2.2
        : 96,
      waistCircumferenceCm: estimates.shoulderWidthCm
        ? estimates.shoulderWidthCm * 1.8
        : 80,
      sleeveLengthCm: 64,
      neckCircumferenceCm: 38,
    };

    try {
      const response = (await api.post("/vesper/analyze-size", {
        ...finalMeasurements,
        gender,
        preferredFit,
      })) as { bodyType?: BodyType; confidenceScore?: number; report?: string };

      const profileData: BodyProfile = {
        id: "bp-" + Date.now(),
        measurements: finalMeasurements,
        bodyType: response?.bodyType || "Athletic Slim",
        preferredFit: preferredFit as PreferredFit,
        gender,
        confidenceScore: response?.confidenceScore || 94,
        lastUpdated: new Date().toISOString(),
      };

      setProfile(profileData);

      // Log this consultation into shared Vesper history
      useVesperStore.getState().addMessage({
        id: `size-report-${Date.now()}`,
        role: "model",
        content: `Architectural Size Analysis calibrated.\n\n• Recommended Size: ${getRecommendedSize(finalMeasurements.chestCircumferenceCm, preferredFit)}\n• Body Type: ${profileData.bodyType}\n• Proportions: ${finalMeasurements.shoulderWidthCm}cm shoulders, ${finalMeasurements.chestCircumferenceCm}cm chest, ${finalMeasurements.waistCircumferenceCm}cm waist\n• Confidence: ${profileData.confidenceScore}%\n\n${response.report || "Silhouette calibrated for permanent collection tailoring."}`,
      });

      setStep("REPORT");
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please try again.");
      setStep("INPUT");
    }
  };

  const recommendedSize = profile
    ? getRecommendedSize(
        profile.measurements.chestCircumferenceCm,
        profile.preferredFit
      )
    : "M";

  return (
    <div className="h-full w-full overflow-hidden flex flex-col justify-between px-4 sm:px-6 md:px-8 py-3 md:py-4 max-w-7xl mx-auto select-none">
      {/* ── Compact Header ── */}
      <header className="text-center shrink-0 mb-1">
        <h1 className="font-heading text-base md:text-lg uppercase tracking-[0.25em] text-[#FDFCFB]">
          Size Intelligence
        </h1>
        <p className="text-[9px] text-[#666] tracking-widest uppercase font-heading">
          Silhouette Calibration
        </p>
      </header>

      {/* ── Fixed 3-Column Viewport (No Scroll) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center flex-1 min-h-0 w-full py-1">
        {/* Left Side Space: Minimal Specs */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-3 justify-center shrink-0">
          <div className="border border-white/10 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-3 text-white">
              <Layers className="h-3.5 w-3.5 text-[#888]" />
              <h4 className="font-heading text-[11px] uppercase tracking-[0.2em]">
                Parameters
              </h4>
            </div>

            <div className="space-y-2 text-[10px] uppercase tracking-wider font-heading">
              <div className="flex items-center justify-between text-[#888]">
                <span>Target</span>
                <span className="text-white font-medium">
                  {gender === "M" ? "Masculine" : "Feminine"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#888]">
                <span>Silhouette</span>
                <span className="text-white font-medium">{preferredFit}</span>
              </div>
              <div className="flex items-center justify-between text-[#888]">
                <span>Vision</span>
                <span className="text-[#888]">MediaPipe GPU</span>
              </div>
            </div>
          </div>

          <div className="border border-white/10 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-xl p-3 flex items-center gap-2 text-[#777]">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <p className="text-[9px] uppercase tracking-wider font-heading">
              Edge Vision • Zero Cloud Storage
            </p>
          </div>
        </div>

        {/* Center: Sleek Curved Camera Window */}
        <div className="lg:col-span-6 h-full max-h-[460px] md:max-h-[500px] w-full max-w-[500px] mx-auto flex flex-col justify-center items-center">
          <div className="w-full h-full relative border border-white/15 bg-[#0A0A0A]/95 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col justify-center items-center p-5">
            <AnimatePresence mode="wait">
              {step === "INPUT" && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col items-center justify-center text-center w-full max-w-xs"
                >
                  <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-3 text-[#E8E8E8]">
                    <Camera className="w-5 h-5 stroke-[1.5]" />
                  </div>

                  <h3 className="font-heading text-sm md:text-base uppercase tracking-[0.25em] text-[#FDFCFB] mb-4">
                    Establish Baseline
                  </h3>

                  {/* Compact Pill Inputs */}
                  <div className="grid grid-cols-2 gap-3 w-full mb-4">
                    <div className="flex flex-col text-left">
                      <label className="text-[8px] uppercase tracking-widest text-[#888] mb-1 font-heading pl-2">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        className="w-full rounded-full bg-white/[0.04] border border-white/10 px-4 py-2 text-center text-xs font-medium text-white focus:border-white/40 outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <label className="text-[8px] uppercase tracking-widest text-[#888] mb-1 font-heading pl-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        className="w-full rounded-full bg-white/[0.04] border border-white/10 px-4 py-2 text-center text-xs font-medium text-white focus:border-white/40 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Fit Pills */}
                  <div className="flex items-center justify-center gap-1.5 mb-5 w-full">
                    {["Slim", "Regular", "Relaxed", "Oversized"].map((fit) => (
                      <button
                        key={fit}
                        type="button"
                        onClick={() => setPreferredFit(fit)}
                        className={cn(
                          "rounded-full px-3 py-1 text-[8px] uppercase tracking-wider font-heading transition-all border",
                          preferredFit === fit
                            ? "bg-white text-black border-white"
                            : "bg-white/[0.02] text-[#888] border-white/10 hover:border-white/30"
                        )}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
                    <button
                      onClick={startCamera}
                      disabled={isInitializing}
                      className="w-full sm:flex-1 rounded-full bg-white text-black px-5 py-3 uppercase tracking-[0.2em] text-[9px] font-heading font-medium hover:bg-[#E8E8E8] transition-all disabled:opacity-40 shadow-md"
                    >
                      {isInitializing ? "Initializing..." : "Initialize Camera"}
                    </button>

                    <button
                      onClick={() => {
                        setStep("SCANNING");
                        setIsStable(true);
                        setEstimates({ shoulderWidthCm: 48 });
                      }}
                      className="w-full sm:flex-1 rounded-full border border-white/15 bg-white/[0.03] text-[#AAA] px-5 py-3 uppercase tracking-[0.2em] text-[9px] font-heading hover:bg-white/10 hover:text-white transition-all"
                    >
                      Simulate Scan
                    </button>
                  </div>
                </motion.div>
              )}

              {(step === "SCANNING" || step === "ANALYZING") && (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black rounded-[32px] overflow-hidden"
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover opacity-60 -scale-x-100 rounded-[32px]"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen -scale-x-100 rounded-[32px]"
                  />

                  {/* Scanning Reticle */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
                    <div className="w-44 h-44 md:w-56 md:h-56 rounded-full border border-white/20 animate-pulse flex items-center justify-center relative">
                      <div className="w-2 h-2 rounded-full bg-white/40" />
                      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </div>

                    {step === "SCANNING" && (
                      <div className="absolute bottom-5 left-0 right-0 text-center">
                        <p className="rounded-full px-4 py-1.5 border border-white/20 bg-black/80 backdrop-blur-md text-[9px] tracking-widest text-[#E8E8E8] uppercase font-mono shadow-xl inline-flex items-center gap-2">
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              isStable
                                ? "bg-emerald-400 animate-ping"
                                : "bg-amber-400 animate-pulse"
                            )}
                          />
                          {isStable
                            ? "Proportions Acquired"
                            : "Align Torso in Frame"}
                        </p>
                      </div>
                    )}

                    {step === "ANALYZING" && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center rounded-[32px]">
                        <RefreshCw className="w-7 h-7 text-white animate-spin mb-3" />
                        <p className="font-heading text-xs uppercase tracking-[0.25em] text-white">
                          Synthesizing Proportions
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === "REPORT" && (
                <motion.div
                  key="report-summary"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center p-6 w-full max-w-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
                  </div>

                  <h3 className="font-heading text-sm uppercase tracking-[0.25em] text-white mb-1">
                    Inspection Complete
                  </h3>
                  <p className="text-[10px] text-[#777] uppercase font-heading tracking-wider mb-5">
                    Proportions Calibrated
                  </p>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full rounded-full bg-white text-black py-3.5 uppercase tracking-[0.2em] text-[10px] font-heading font-medium hover:bg-neutral-200 transition-all shadow-md mb-2.5"
                  >
                    View Results
                  </button>

                  <button
                    onClick={() => setStep("INPUT")}
                    className="w-full rounded-full border border-white/10 bg-white/[0.02] text-[#888] hover:text-white hover:bg-white/5 py-2.5 uppercase tracking-[0.2em] text-[9px] font-heading transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Re-Calibrate
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side Space: Steps & Live Actions */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-3 justify-center shrink-0">
          <div className="border border-white/10 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-xl p-4 shadow-md">
            <h4 className="font-heading text-[11px] uppercase tracking-[0.2em] text-[#FDFCFB] mb-2.5">
              Inspection
            </h4>

            <div className="space-y-1.5">
              {PROCESS_STEPS.map((ps) => {
                const isCurrent = ps.id === step;
                return (
                  <div
                    key={ps.id}
                    className={cn(
                      "flex items-center justify-between px-3 py-1.5 rounded-xl border text-[9px] uppercase tracking-wider font-heading transition-all",
                      isCurrent
                        ? "bg-white/10 border-white/20 text-white"
                        : "border-transparent text-[#666]"
                    )}
                  >
                    <span>{ps.label}</span>
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {step === "SCANNING" && (
            <div className="border border-white/10 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-xl p-3.5 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] uppercase tracking-wider text-[#888] font-heading">
                  Shoulders
                </span>
                <span className="font-mono text-sm text-white font-medium">
                  {estimates.shoulderWidthCm
                    ? `${estimates.shoulderWidthCm} cm`
                    : "---"}
                </span>
              </div>

              <button
                onClick={finalizeAnalysis}
                disabled={!isStable}
                className="w-full rounded-full bg-white text-black py-2.5 uppercase tracking-[0.18em] text-[9px] font-heading font-medium disabled:opacity-30 transition-all shadow-md mt-1 hover:bg-[#E8E8E8]"
              >
                Analyze
              </button>
            </div>
          )}

          {step === "REPORT" && profile && (
            <div className="border border-white/10 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-xl p-3.5 shadow-md">
              <p className="text-[8px] uppercase tracking-wider text-[#777] font-heading mb-0.5">
                Saved Profile
              </p>
              <p className="font-heading text-xs text-white uppercase tracking-wider mb-2">
                {recommendedSize} • {profile.bodyType}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full rounded-full bg-white/10 hover:bg-white hover:text-black text-white py-2 uppercase tracking-[0.18em] text-[8px] font-heading transition-all"
              >
                Open Details
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Pop-Up Window (Modal for Detailed Results) ── */}
      <AnimatePresence>
        {isModalOpen && profile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md border border-white/15 rounded-[32px] bg-[#0C0C0C]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-[#777] hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-2 mb-4 text-[#888]">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="font-heading text-[10px] uppercase tracking-[0.25em]">
                  Architectural Results
                </span>
              </div>

              {/* Main Recommended Size Banner */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-[#777] font-heading">
                    Recommended Fit
                  </p>
                  <p className="font-heading text-2xl uppercase tracking-wider text-white mt-0.5">
                    Size {recommendedSize}
                  </p>
                  <p className="text-[10px] text-[#999] uppercase font-heading tracking-wider mt-0.5">
                    {profile.bodyType}
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-full px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase tracking-widest inline-block">
                    {profile.confidenceScore}% Match
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-[8px] uppercase tracking-wider text-[#777] font-heading">
                    Shoulders
                  </p>
                  <p className="font-mono text-xs text-white mt-1">
                    {profile.measurements.shoulderWidthCm} cm
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-[8px] uppercase tracking-wider text-[#777] font-heading">
                    Chest
                  </p>
                  <p className="font-mono text-xs text-white mt-1">
                    {profile.measurements.chestCircumferenceCm} cm
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-[8px] uppercase tracking-wider text-[#777] font-heading">
                    Waist
                  </p>
                  <p className="font-mono text-xs text-white mt-1">
                    {profile.measurements.waistCircumferenceCm} cm
                  </p>
                </div>
              </div>

              {/* Baseline Metrics */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-[9px] uppercase tracking-wider font-heading text-[#888] mb-6">
                <span>Height: {profile.measurements.heightCm} cm</span>
                <span>Weight: {profile.measurements.weightKg} kg</span>
                <span>Fit: {profile.preferredFit}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => router.push("/vesper")}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-white text-black py-3 uppercase tracking-[0.2em] text-[10px] font-heading font-medium hover:bg-neutral-200 transition-all shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Consult Vesper in Chat
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push("/vesper/preview")}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[#AAA] py-2.5 uppercase tracking-[0.18em] text-[9px] font-heading hover:bg-white/10 hover:text-white transition-all"
                  >
                    Fit Preview <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-full border border-white/10 px-5 py-2.5 uppercase tracking-[0.18em] text-[9px] font-heading text-[#777] hover:text-white transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
