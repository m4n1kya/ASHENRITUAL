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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const PROCESS_STEPS = [
  { id: "INPUT", label: "Establish Baseline", num: "01" },
  { id: "SCANNING", label: "Align Architecture", num: "02" },
  { id: "ANALYZING", label: "Interpreting Proportions", num: "03" },
  { id: "REPORT", label: "Tailoring Recommendation", num: "04" },
];

export default function SizeIntelligencePage() {
  const router = useRouter();
  const { landmarker, isInitializing, error } = useMediaPipe();
  const { profile, setProfile } = useSizeStore();

  const [step, setStep] = useState<
    "INPUT" | "SCANNING" | "ANALYZING" | "REPORT"
  >("INPUT");

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

  // Start Camera
  const pendingStream = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      pendingStream.current = stream;
      setStep("SCANNING");
    } catch (err) {
      console.error("Camera access denied:", err);
      alert(
        "Camera access is required for Architectural Body Analysis. Please ensure no other app is using it."
      );
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

          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
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
              ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
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
              if (stableFrames.current > 60) {
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
      })) as any;

      const profileData: BodyProfile = {
        id: "bp-" + Date.now(),
        measurements: finalMeasurements,
        bodyType: response.bodyType || "Balanced",
        preferredFit: preferredFit as any,
        gender,
        confidenceScore: response.confidenceScore || 92,
        lastUpdated: new Date().toISOString(),
      };

      setProfile(profileData);

      // Log this consultation into Vesper chat store so it shares the same history in All Chats!
      const vesperStore = useVesperStore.getState();
      vesperStore.addMessage({
        id: `size-report-${Date.now()}`,
        role: "model",
        content: `Architectural Size Analysis calibrated successfully.\n\n• Body Type: ${profileData.bodyType}\n• Proportions: ${finalMeasurements.shoulderWidthCm}cm shoulders, ${finalMeasurements.chestCircumferenceCm}cm chest, ${finalMeasurements.waistCircumferenceCm}cm waist\n• Tailoring Confidence: ${profileData.confidenceScore}%\n\n${response.report || "Proportions successfully integrated into your personal architectural profile."}`,
      });

      setStep("REPORT");
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please try again.");
      setStep("INPUT");
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto px-4 sm:px-6 md:px-10 pt-28 md:pt-32 pb-16 hide-scrollbar relative">
      <div className="max-w-7xl mx-auto min-h-full flex flex-col justify-center">
        {/* Header */}
        <header className="mb-8 md:mb-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-1 font-heading">
            Vesper Intelligence Layer
          </p>
          <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-[0.2em] text-[#FDFCFB]">
            Size Intelligence
          </h1>
          <p className="text-[11px] text-[#666] tracking-wider uppercase mt-1">
            Architectural Body Analysis &amp; Silhouette Synthesis
          </p>
        </header>

        {/* 3-Column Layout: Left Space | Center Camera Window | Right Space */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ── Left Side Space: Baseline Specs & Privacy ── */}
          <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col gap-5">
            <div className="border border-white/10 rounded-3xl bg-[#0A0A0A]/70 backdrop-blur-xl p-5 shadow-lg">
              <div className="flex items-center gap-2.5 mb-3 text-white">
                <Layers className="h-4 w-4 text-[#888]" />
                <h4 className="font-heading text-xs uppercase tracking-[0.2em]">
                  Calibration Profile
                </h4>
              </div>
              <p className="text-[11px] text-[#777] leading-relaxed mb-4 font-sans">
                Real-time landmark vectors calibrate your silhouette against
                ASHENRITUAL architectural tailoring foundations.
              </p>

              <div className="space-y-3 pt-2 border-t border-white/5 text-[10px] uppercase tracking-wider font-heading">
                <div className="flex items-center justify-between text-[#888]">
                  <span>Target Gender</span>
                  <span className="text-white font-medium">{gender === "M" ? "Masculine" : "Feminine"}</span>
                </div>
                <div className="flex items-center justify-between text-[#888]">
                  <span>Silhouette Fit</span>
                  <span className="text-white font-medium">{preferredFit}</span>
                </div>
                <div className="flex items-center justify-between text-[#888]">
                  <span>Sensor Engine</span>
                  <span className="text-[#888]">MediaPipe GPU</span>
                </div>
              </div>
            </div>

            <div className="border border-white/10 rounded-3xl bg-[#0A0A0A]/70 backdrop-blur-xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-2 text-white">
                <ShieldCheck className="h-4 w-4 text-[#888]" />
                <h5 className="font-heading text-[11px] uppercase tracking-[0.2em]">
                  Local Edge Privacy
                </h5>
              </div>
              <p className="text-[10px] text-[#666] leading-relaxed">
                All vision landmarks are computed in-memory via WebAssembly.
                Camera streams are never recorded or transmitted.
              </p>
            </div>
          </div>

          {/* ── Center Column: Modern Sleek Curved Camera Window ── */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center">
            <div className="w-full relative border border-white/15 bg-[#0A0A0A]/95 backdrop-blur-2xl rounded-[36px] shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden min-h-[460px] md:min-h-[500px] flex flex-col justify-center before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:z-30">
              <AnimatePresence mode="wait">
                {step === "INPUT" && (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col items-center justify-center p-8 md:p-12 text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5 text-[#E8E8E8] shadow-inner">
                      <Camera className="w-6 h-6 stroke-[1.5]" />
                    </div>

                    <h3 className="font-heading text-base md:text-lg uppercase tracking-[0.25em] text-[#FDFCFB] mb-2">
                      Establish Baseline
                    </h3>
                    <p className="text-[11px] text-[#777] max-w-sm mb-8 font-sans">
                      Position yourself in natural light. Provide your baseline to
                      anchor landmark pixel proportions.
                    </p>

                    {/* Sleek Curved Pill Inputs */}
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-6">
                      <div className="flex flex-col text-left">
                        <label className="text-[9px] uppercase tracking-widest text-[#888] mb-1.5 font-heading pl-3">
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          value={heightCm}
                          onChange={(e) => setHeightCm(e.target.value)}
                          className="w-full rounded-full bg-white/[0.04] border border-white/10 px-5 py-3 text-center text-sm font-medium text-white placeholder:text-[#555] focus:border-white/40 focus:bg-white/[0.07] outline-none transition-all shadow-inner"
                        />
                      </div>
                      <div className="flex flex-col text-left">
                        <label className="text-[9px] uppercase tracking-widest text-[#888] mb-1.5 font-heading pl-3">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          value={weightKg}
                          onChange={(e) => setWeightKg(e.target.value)}
                          className="w-full rounded-full bg-white/[0.04] border border-white/10 px-5 py-3 text-center text-sm font-medium text-white placeholder:text-[#555] focus:border-white/40 focus:bg-white/[0.07] outline-none transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Preferred Fit Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-sm">
                      {["Slim", "Regular", "Relaxed", "Oversized"].map((fit) => (
                        <button
                          key={fit}
                          type="button"
                          onClick={() => setPreferredFit(fit)}
                          className={cn(
                            "rounded-full px-4 py-1.5 text-[9px] uppercase tracking-widest font-heading transition-all duration-300 border",
                            preferredFit === fit
                              ? "bg-white text-black border-white shadow-sm"
                              : "bg-white/[0.02] text-[#888] border-white/10 hover:border-white/30 hover:text-white"
                          )}
                        >
                          {fit}
                        </button>
                      ))}
                    </div>

                    {/* Sleek Curved Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
                      <button
                        onClick={startCamera}
                        disabled={isInitializing}
                        className="w-full sm:flex-1 rounded-full bg-white text-black px-6 py-3.5 uppercase tracking-[0.2em] text-[10px] font-heading font-medium hover:bg-[#E8E8E8] transition-all duration-300 disabled:opacity-40 shadow-md"
                      >
                        {isInitializing ? "Initializing..." : "Initialize Camera"}
                      </button>

                      <button
                        onClick={() => {
                          setStep("SCANNING");
                          setIsStable(true);
                          setEstimates({ shoulderWidthCm: 48 });
                        }}
                        className="w-full sm:flex-1 rounded-full border border-white/15 bg-white/[0.03] text-[#AAA] px-6 py-3.5 uppercase tracking-[0.2em] text-[10px] font-heading hover:bg-white/10 hover:text-white transition-all duration-300"
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
                    className="absolute inset-0 bg-black rounded-[36px] overflow-hidden"
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover opacity-60 -scale-x-100 rounded-[36px]"
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full object-cover mix-blend-screen -scale-x-100 rounded-[36px]"
                    />

                    {/* Sleek Modern Scanning Reticle */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                      <div className="w-52 h-52 md:w-64 md:h-64 rounded-full border border-white/20 animate-pulse flex items-center justify-center relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
                        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                      </div>

                      {step === "SCANNING" && (
                        <div className="absolute bottom-6 left-0 right-0 text-center">
                          <p className="rounded-full px-5 py-2 border border-white/20 bg-black/80 backdrop-blur-md text-[10px] tracking-widest text-[#E8E8E8] uppercase font-mono shadow-xl inline-flex items-center gap-2">
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              isStable ? "bg-emerald-400 animate-ping" : "bg-amber-400 animate-pulse"
                            )} />
                            {isStable
                              ? "Proportions Acquired • Ready"
                              : "Align Silhouette In Frame..."}
                          </p>
                        </div>
                      )}

                      {step === "ANALYZING" && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center rounded-[36px]">
                          <RefreshCw className="w-8 h-8 text-white animate-spin mb-4" />
                          <p className="font-heading text-xs uppercase tracking-[0.25em] text-white mb-1">
                            Synthesizing Silhouette
                          </p>
                          <p className="text-[10px] text-[#777] tracking-wider uppercase font-sans">
                            Consulting Gemini Pro Tailoring Reasoning...
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right Side Space: The Process & Live Intelligence ── */}
          <div className="lg:col-span-3 order-3 flex flex-col gap-5">
            <div className="border border-white/10 rounded-3xl bg-[#0A0A0A]/70 backdrop-blur-xl p-5 shadow-lg">
              <AnimatePresence mode="wait">
                {step === "INPUT" && (
                  <motion.div
                    key="process-guide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h4 className="font-heading text-xs uppercase tracking-[0.2em] text-[#FDFCFB] mb-3">
                      The Process
                    </h4>
                    <p className="text-[11px] text-[#888] leading-relaxed mb-5 font-sans">
                      Our vision pipeline constructs an anatomical proportion
                      matrix to recommend harmonious garment dimensions.
                    </p>

                    <div className="space-y-3">
                      {PROCESS_STEPS.map((ps) => {
                        const isCurrent = ps.id === step;
                        return (
                          <div
                            key={ps.id}
                            className={cn(
                              "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border text-[10px] uppercase tracking-wider font-heading transition-all",
                              isCurrent
                                ? "bg-white/10 border-white/20 text-white"
                                : "border-transparent text-[#666]"
                            )}
                          >
                            <span className="font-mono text-[9px] text-[#555]">
                              {ps.num}
                            </span>
                            <span>{ps.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === "SCANNING" && (
                  <motion.div
                    key="live-metrics"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                      <h4 className="font-heading text-xs uppercase tracking-[0.2em] text-white">
                        Live Metrics
                      </h4>
                      <RefreshCw className="w-3.5 h-3.5 text-white/50 animate-spin" />
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                        <p className="text-[9px] uppercase tracking-widest text-[#888] font-heading mb-1">
                          Shoulder Width
                        </p>
                        <p className="font-mono text-xl text-white">
                          {estimates.shoulderWidthCm
                            ? `${estimates.shoulderWidthCm} cm`
                            : "---"}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                        <p className="text-[9px] uppercase tracking-widest text-[#888] font-heading mb-1">
                          Torso Alignment
                        </p>
                        <p className="font-mono text-xl text-white">
                          {isStable ? "Calibrated" : "Aligning"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={finalizeAnalysis}
                      disabled={!isStable}
                      className="w-full rounded-full bg-white text-black py-3.5 uppercase tracking-[0.2em] text-[10px] font-heading font-medium disabled:opacity-30 transition-all duration-300 shadow-md hover:bg-[#E8E8E8]"
                    >
                      Analyze Proportions
                    </button>
                  </motion.div>
                )}

                {step === "REPORT" && profile && (
                  <motion.div
                    key="report"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-2 mb-3 text-white">
                      <Sparkles className="w-3.5 h-3.5 text-[#AAA]" />
                      <h4 className="font-heading text-xs uppercase tracking-[0.2em]">
                        Body Profile Calibrated
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                        <p className="text-[8px] uppercase tracking-wider text-[#777] font-heading">
                          Type
                        </p>
                        <p className="text-xs text-white font-medium mt-0.5">
                          {profile.bodyType}
                        </p>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                        <p className="text-[8px] uppercase tracking-wider text-[#777] font-heading">
                          Confidence
                        </p>
                        <p className="text-xs text-white font-medium mt-0.5">
                          {profile.confidenceScore}%
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#888] leading-relaxed mb-6 font-sans">
                      Shoulders: {profile.measurements.shoulderWidthCm}cm • Chest:{" "}
                      {profile.measurements.chestCircumferenceCm}cm. Proportions
                      are now linked to your Vesper AI concierge.
                    </p>

                    <div className="space-y-2">
                      <button
                        onClick={() => router.push("/vesper")}
                        className="w-full flex items-center justify-center gap-2 rounded-full bg-white text-black py-3 uppercase tracking-[0.18em] text-[10px] font-heading font-medium hover:bg-[#E8E8E8] transition-all shadow-md"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Consult Vesper in Chat
                      </button>

                      <button
                        onClick={() => router.push("/vesper/preview")}
                        className="w-full flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] text-[#AAA] py-3 uppercase tracking-[0.18em] text-[10px] font-heading hover:bg-white/10 hover:text-white transition-all"
                      >
                        Fit Preview <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
