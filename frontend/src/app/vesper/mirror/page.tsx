/**
 * @fileoverview ASHENRITUAL Vesper Mirror — Standalone Real-Time Virtual Try-On
 * @module page.tsx
 */
"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Sparkles,
  RefreshCw,
  Scan,
  Maximize2,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Download,
  Box,
  Layers,
} from "lucide-react";
import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { VtoPoseEngine, ComputedPoseState } from "@/lib/vto/PoseEngine";
import { GarmentRenderer, GarmentMeshStats } from "@/lib/vto/GarmentRenderer";
import {
  ASHEN_TRYON_CATALOGUE,
  TryOnProduct,
} from "@/lib/vto/garmentCatalog";
import { cn } from "@/lib/utils";

type MirrorStatus =
  | "IDLE"
  | "INITIALIZING_VISION"
  | "REQUESTING_CAMERA"
  | "SEARCHING_BODY"
  | "TRACKING_LOCKED"
  | "CAMERA_DENIED"
  | "ERROR";

type FitMode = "Snug" | "Standard" | "Relaxed";
type RenderMode = "3D" | "2D";

export default function VesperMirrorPage() {
  // ─── State ────────────────────────────────────────────────────────────────
  const [status, setStatus] = useState<MirrorStatus>("IDLE");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<TryOnProduct>(
    ASHEN_TRYON_CATALOGUE[0]
  );
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [renderMode, setRenderMode] = useState<RenderMode>("3D");
  const [fitMode, setFitMode] = useState<FitMode>("Standard");
  const [showLandmarks, setShowLandmarks] = useState<boolean>(false);

  // Live telemetry metrics
  const [fps, setFps] = useState<number>(0);
  const [trackingConfidence, setTrackingConfidence] = useState<number>(0);
  const [shoulderCm, setShoulderCm] = useState<number>(0);
  const [chestYawDeg, setChestYawDeg] = useState<number>(0);
  const [meshStats, setMeshStats] = useState<GarmentMeshStats | null>(null);
  const [modelLoadingProgress, setModelLoadingProgress] = useState<number | null>(
    null
  );

  // ─── DOM & Engine References ──────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const threeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const debugCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const poseEngineRef = useRef<VtoPoseEngine | null>(null);
  const garmentRendererRef = useRef<GarmentRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const lastPoseStateRef = useRef<ComputedPoseState | null>(null);

  // Performance telemetry counters
  const frameCountRef = useRef<number>(0);
  const lastFpsTimestampRef = useRef<number>(performance.now());

  // 2D Overlay image cache
  const overlayImgRef = useRef<HTMLImageElement | null>(null);

  // ─── Filtered Products ────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return ASHEN_TRYON_CATALOGUE;
    return ASHEN_TRYON_CATALOGUE.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // ─── Fit Scale Mapping ────────────────────────────────────────────────────
  useEffect(() => {
    if (!poseEngineRef.current) return;
    if (fitMode === "Snug") poseEngineRef.current.userFitScale = 0.92;
    else if (fitMode === "Relaxed") poseEngineRef.current.userFitScale = 1.12;
    else poseEngineRef.current.userFitScale = 1.0;
  }, [fitMode]);

  // ─── Preload 2D Overlay Image ─────────────────────────────────────────────
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = selectedProduct.overlay2DPath;
    img.onload = () => {
      overlayImgRef.current = img;
    };
  }, [selectedProduct]);

  // ─── Initialize MediaPipe Tasks Vision ────────────────────────────────────
  const initMediaPipe = useCallback(async (): Promise<PoseLandmarker | null> => {
    if (landmarkerRef.current) return landmarkerRef.current;
    try {
      setStatus("INITIALIZING_VISION");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
        minPoseDetectionConfidence: 0.45,
        minPosePresenceConfidence: 0.45,
        minTrackingConfidence: 0.45,
      });

      landmarkerRef.current = landmarker;
      return landmarker;
    } catch (err) {
      console.error("Vesper Mirror: MediaPipe vision failed to initialize:", err);
      setStatus("ERROR");
      setErrorMessage("Could not load neural vision landmarker model.");
      return null;
    }
  }, []);

  // ─── Load Selected 3D Model ───────────────────────────────────────────────
  const loadActive3DModel = useCallback(
    async (product: TryOnProduct) => {
      if (!garmentRendererRef.current) return;
      if (!product.is3DSupported || !product.model3DPath) {
        setRenderMode("2D");
        garmentRendererRef.current.clearCurrentModel();
        return;
      }

      try {
        setModelLoadingProgress(10);
        const stats = await garmentRendererRef.current.loadGarment(
          product.model3DPath,
          (percent) => setModelLoadingProgress(percent)
        );
        setMeshStats(stats);
        setModelLoadingProgress(null);
      } catch (err) {
        console.warn(
          `Vesper Mirror: 3D model load failed for ${product.name}, falling back to 2D adaptive overlay.`,
          err
        );
        setModelLoadingProgress(null);
        setRenderMode("2D");
      }
    },
    []
  );

  // ─── Start Camera & Live Tracking ─────────────────────────────────────────
  const startCamera = async () => {
    try {
      setStatus("REQUESTING_CAMERA");
      setErrorMessage(null);

      // 1. Initialize vision model
      const landmarker = await initMediaPipe();
      if (!landmarker) return;

      // 2. Request user webcam with optimal resolution
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: "user",
          frameRate: { ideal: 30, max: 60 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => console.warn("Video play:", e));
        };
      }

      // 3. Initialize Pose Engine
      if (!poseEngineRef.current) {
        poseEngineRef.current = new VtoPoseEngine();
      } else {
        poseEngineRef.current.reset();
      }

      // 4. Initialize Three.js Garment Renderer
      if (threeCanvasRef.current && !garmentRendererRef.current) {
        garmentRendererRef.current = new GarmentRenderer(threeCanvasRef.current);
      }

      // 5. Load initial product model
      await loadActive3DModel(selectedProduct);

      setStatus("SEARCHING_BODY");
    } catch (err: unknown) {
      console.error("Vesper Mirror: Camera start error:", err);
      const isDenied =
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "PermissionDeniedError");
      if (isDenied) {
        setStatus("CAMERA_DENIED");
        setErrorMessage(
          "Camera access was denied. Please allow camera permissions in your browser to activate Vesper Mirror."
        );
      } else {
        setStatus("ERROR");
        setErrorMessage(
          "Unable to start camera stream. Verify your device camera is connected."
        );
      }
    }
  };

  // ─── Stop Camera & Full Resource Cleanup ──────────────────────────────────
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (garmentRendererRef.current) {
      garmentRendererRef.current.clearCurrentModel();
    }

    // Clear 2D & debug canvases
    if (debugCanvasRef.current) {
      const ctx = debugCanvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, debugCanvasRef.current.width, debugCanvasRef.current.height);
    }
    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
    }

    lastPoseStateRef.current = null;
    setStatus("IDLE");
  }, []);

  // Guarantee cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (garmentRendererRef.current) {
        garmentRendererRef.current.dispose();
        garmentRendererRef.current = null;
      }
    };
  }, [stopCamera]);

  // ─── Main Real-Time Inference & Render Loop ───────────────────────────────
  useEffect(() => {
    if (status !== "SEARCHING_BODY" && status !== "TRACKING_LOCKED") return;

    let isRunning = true;
    let lastVideoTime = -1;

    const renderLoop = () => {
      if (!isRunning) return;

      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      const poseEngine = poseEngineRef.current;
      const renderer = garmentRendererRef.current;

      if (video && video.readyState >= 2 && landmarker && renderer && poseEngine) {
        const currentTime = video.currentTime;

        // Telemetry FPS calculation
        frameCountRef.current++;
        const now = performance.now();
        if (now - lastFpsTimestampRef.current >= 1000) {
          setFps(frameCountRef.current);
          frameCountRef.current = 0;
          lastFpsTimestampRef.current = now;
        }

        // Process new frame
        if (currentTime !== lastVideoTime) {
          lastVideoTime = currentTime;

          // Resize canvases if stage size shifted
          const stage = stageRef.current;
          if (stage) {
            const w = stage.clientWidth;
            const h = stage.clientHeight;

            if (threeCanvasRef.current && (threeCanvasRef.current.width !== w || threeCanvasRef.current.height !== h)) {
              renderer.resize(w, h);
            }
            if (debugCanvasRef.current && (debugCanvasRef.current.width !== w || debugCanvasRef.current.height !== h)) {
              debugCanvasRef.current.width = w;
              debugCanvasRef.current.height = h;
            }
            if (overlayCanvasRef.current && (overlayCanvasRef.current.width !== w || overlayCanvasRef.current.height !== h)) {
              overlayCanvasRef.current.width = w;
              overlayCanvasRef.current.height = h;
            }
          }

          // 1. Run MediaPipe Pose Detection
          const detectionResult = landmarker.detectForVideo(video, now);
          const hasPose =
            detectionResult.landmarks && detectionResult.landmarks.length > 0;

          if (hasPose) {
            const rawLandmarks = detectionResult.landmarks[0];
            const worldLandmarks = detectionResult.worldLandmarks?.[0];

            // 2. Compute 3D Body Frame & Transforms
            const poseState = poseEngine.update(
              rawLandmarks,
              worldLandmarks,
              renderer.camera,
              renderMode === "3D" ? renderer.rootGroup : null
            );

            if (poseState && poseState.shouldersDetected) {
              if (status !== "TRACKING_LOCKED") setStatus("TRACKING_LOCKED");
              lastPoseStateRef.current = poseState;

              setTrackingConfidence(Math.round(poseState.confidence * 100));
              setShoulderCm(poseState.shoulderWidthCm);
              setChestYawDeg(Math.round((poseState.yawAngle * 180) / Math.PI));

              // 3. Render 2D Adaptive Overlay if active
              if (renderMode === "2D" && overlayCanvasRef.current && overlayImgRef.current) {
                render2DGarment(overlayCanvasRef.current, overlayImgRef.current, poseState);
              } else if (overlayCanvasRef.current) {
                const ctx = overlayCanvasRef.current.getContext("2d");
                ctx?.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
              }

              // 4. Draw Debug Landmarks if enabled
              if (showLandmarks && debugCanvasRef.current) {
                drawLandmarkSkeleton(debugCanvasRef.current, rawLandmarks, poseState);
              } else if (debugCanvasRef.current) {
                const ctx = debugCanvasRef.current.getContext("2d");
                ctx?.clearRect(0, 0, debugCanvasRef.current.width, debugCanvasRef.current.height);
              }
            } else {
              if (status !== "SEARCHING_BODY") setStatus("SEARCHING_BODY");
            }
          } else {
            if (status !== "SEARCHING_BODY") setStatus("SEARCHING_BODY");
          }
        }

        // 5. Render Three.js Scene (for 3D mode)
        if (renderMode === "3D") {
          renderer.render();
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [status, renderMode, showLandmarks]);

  // ─── 2D Adaptive Garment Overlay Function ─────────────────────────────────
  const render2DGarment = (
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    pose: ComputedPoseState
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    // Anchor: shoulder midpoint mapped to canvas pixels
    // Since stage is mirrored horizontally via CSS, x coordinates match directly
    const anchorX = pose.shoulderMidpoint.x * w;
    const anchorY = pose.shoulderMidpoint.y * h;

    // Garment dimensions derived from human shoulder span
    const garmentWidth = pose.shoulderWidthNorm * w * 2.3 * (poseEngineRef.current?.userFitScale || 1.0);
    const aspect = img.naturalHeight / Math.max(img.naturalWidth, 1);
    const garmentHeight = garmentWidth * aspect;

    ctx.save();
    // Translate to shoulder line center
    ctx.translate(anchorX, anchorY);
    // Rotate to match user's shoulder tilt (roll angle)
    ctx.rotate(pose.rollAngle);

    // Draw garment centered horizontally at origin, with neck sitting at shoulder line
    const drawX = -garmentWidth / 2;
    const drawY = -garmentHeight * 0.18; // Neckline alignment

    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 10;

    ctx.drawImage(img, drawX, drawY, garmentWidth, garmentHeight);
    ctx.restore();
  };

  // ─── Draw Cyber-Minimalist Debug Skeleton ─────────────────────────────────
  const drawLandmarkSkeleton = (
    canvas: HTMLCanvasElement,
    landmarks: { x: number; y: number; visibility?: number }[],
    pose: ComputedPoseState
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    const connections = [
      [11, 12], // Shoulders
      [11, 23], // Left Torso
      [12, 24], // Right Torso
      [23, 24], // Hips
      [11, 13], // Left upper arm
      [13, 15], // Left forearm
      [12, 14], // Right upper arm
      [14, 16], // Right forearm
    ];

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 1.5;

    for (const [from, to] of connections) {
      const p1 = landmarks[from];
      const p2 = landmarks[to];
      if (p1 && p2 && (p1.visibility ?? 1) > 0.3 && (p2.visibility ?? 1) > 0.3) {
        ctx.beginPath();
        ctx.moveTo(p1.x * w, p1.y * h);
        ctx.lineTo(p2.x * w, p2.y * h);
        ctx.stroke();
      }
    }

    // Draw joints
    for (const idx of [11, 12, 13, 14, 15, 16, 23, 24]) {
      const lm = landmarks[idx];
      if (lm && (lm.visibility ?? 1) > 0.3) {
        ctx.beginPath();
        ctx.arc(lm.x * w, lm.y * h, 3.5, 0, 2 * Math.PI);
        ctx.fillStyle = idx === 11 || idx === 12 ? "#FDFCFB" : "rgba(255, 255, 255, 0.7)";
        ctx.fill();
      }
    }

    // Torso center indicator
    ctx.beginPath();
    ctx.arc(pose.torsoCenter.x * w, pose.torsoCenter.y * h, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#22c55e";
    ctx.fill();

    ctx.restore();
  };

  // ─── Garment Switcher ─────────────────────────────────────────────────────
  const handleSelectProduct = async (product: TryOnProduct) => {
    setSelectedProduct(product);
    if (product.is3DSupported && product.model3DPath) {
      await loadActive3DModel(product);
    } else {
      setRenderMode("2D");
      garmentRendererRef.current?.clearCurrentModel();
    }
  };

  // ─── Capture Snapshot ─────────────────────────────────────────────────────
  const captureSnapshot = () => {
    if (!videoRef.current || !stageRef.current) return;
    const stage = stageRef.current;
    const offscreen = document.createElement("canvas");
    offscreen.width = stage.clientWidth * 2;
    offscreen.height = stage.clientHeight * 2;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return;

    ctx.save();
    // Mirror horizontally to match selfie view
    ctx.scale(-1, 1);
    ctx.translate(-offscreen.width, 0);

    // 1. Draw video background
    ctx.drawImage(videoRef.current, 0, 0, offscreen.width, offscreen.height);

    // 2. Draw active garment
    if (renderMode === "3D" && threeCanvasRef.current) {
      ctx.drawImage(threeCanvasRef.current, 0, 0, offscreen.width, offscreen.height);
    } else if (renderMode === "2D" && overlayCanvasRef.current) {
      ctx.drawImage(overlayCanvasRef.current, 0, 0, offscreen.width, offscreen.height);
    }
    ctx.restore();

    // 3. Watermark
    ctx.fillStyle = "#FDFCFB";
    ctx.font = "600 24px 'Chakra Petch', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("ASHENRITUAL // VESPER MIRROR", 40, offscreen.height - 40);

    ctx.font = "400 16px 'Geist Mono', monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.textAlign = "right";
    ctx.fillText(
      `${selectedProduct.name.toUpperCase()} • FIT: ${fitMode.toUpperCase()}`,
      offscreen.width - 40,
      offscreen.height - 40
    );

    // Trigger download
    const link = document.createElement("a");
    link.download = `ashenritual-ritual-tryon-${Date.now()}.png`;
    link.href = offscreen.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#050505] text-[#FDFCFB] flex flex-col overflow-hidden select-none">
      {/* ─── TOP BAR: STRICTLY NO TABS — ONLY BACK TO VESPER CHAT & HUD ─── */}
      <header className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-white/[0.08] bg-[#0A0A0A]/90 backdrop-blur-2xl">
        {/* Back Button */}
        <Link
          href="/vesper"
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white hover:text-black transition-all duration-300 font-heading text-[10px] font-semibold uppercase tracking-[0.25em] shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Vesper Chat</span>
        </Link>

        {/* Brand / Mode Title */}
        <div className="hidden md:flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-heading text-[11px] uppercase tracking-[0.3em] font-medium text-white/90">
            Vesper — Mirror
          </span>
          <span className="text-white/20">/</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/50">
            Real-Time Virtual Fitting
          </span>
        </div>

        {/* Telemetry Status Chips */}
        <div className="flex items-center gap-2 sm:gap-3">
          {status === "TRACKING_LOCKED" && (
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] font-mono text-[9px] text-white/70">
              <span>{fps} FPS</span>
              <span className="text-white/20">•</span>
              <span>{shoulderCm}cm Span</span>
              <span className="text-white/20">•</span>
              <span>Yaw {chestYawDeg}°</span>
            </div>
          )}

          {status === "TRACKING_LOCKED" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              Locked
            </span>
          ) : status === "SEARCHING_BODY" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Scan className="w-3 h-3 animate-spin" />
              Calibrating
            </span>
          ) : null}

          {status === "TRACKING_LOCKED" || status === "SEARCHING_BODY" ? (
            <button
              onClick={stopCamera}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors text-red-400 font-heading text-[9px] uppercase tracking-widest"
              title="Stop Camera Stream"
            >
              <CameraOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : null}
        </div>
      </header>

      {/* ─── CENTRAL STAGE: MIRROR & GARMENT PROJECTION ──────────────────── */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-black">
        <div
          ref={stageRef}
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
        >
          {/* 1. Live Video Feed (Mirrored) */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={cn(
              "absolute inset-0 w-full h-full object-cover -scale-x-100 transition-opacity duration-700",
              status === "TRACKING_LOCKED" || status === "SEARCHING_BODY"
                ? "opacity-100"
                : "opacity-0"
            )}
          />

          {/* 2. WebGL 3D Garment Canvas (Mirrored) */}
          <canvas
            ref={threeCanvasRef}
            className={cn(
              "absolute inset-0 w-full h-full pointer-events-none -scale-x-100 z-10",
              renderMode === "3D" ? "block" : "hidden"
            )}
          />

          {/* 3. 2D Adaptive Garment Canvas (Mirrored) */}
          <canvas
            ref={overlayCanvasRef}
            className={cn(
              "absolute inset-0 w-full h-full pointer-events-none -scale-x-100 z-10",
              renderMode === "2D" ? "block" : "hidden"
            )}
          />

          {/* 4. Debug Landmarks Canvas (Mirrored) */}
          <canvas
            ref={debugCanvasRef}
            className={cn(
              "absolute inset-0 w-full h-full pointer-events-none -scale-x-100 z-20",
              showLandmarks ? "block" : "hidden"
            )}
          />

          {/* 5. Model Loading Overlay */}
          {modelLoadingProgress !== null && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-full border border-white/15 bg-black/80 backdrop-blur-xl flex items-center gap-3">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              <span className="font-mono text-[10px] tracking-widest text-white/90">
                LOADING 3D MESH ({modelLoadingProgress}%)
              </span>
            </div>
          )}

          {/* 6. Guidance Overlay when Searching Body */}
          {status === "SEARCHING_BODY" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-12 left-1/2 -translate-x-1/2 z-30 px-6 py-3 rounded-full border border-white/15 bg-black/75 backdrop-blur-2xl text-center pointer-events-none shadow-2xl"
            >
              <p className="font-heading text-[11px] uppercase tracking-[0.25em] text-white">
                Step back until your shoulders are visible
              </p>
            </motion.div>
          )}

          {/* 7. Initial Inactive State / Permission Modal */}
          {status === "IDLE" && (
            <div className="relative z-30 max-w-md w-full mx-4 p-8 sm:p-10 rounded-[32px] border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-3xl text-center shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full border border-white/15 bg-white/[0.05] flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>

              <h2 className="font-display italic text-3xl sm:text-4xl text-white mb-2">
                Enter the Mirror
              </h2>
              <p className="text-white/60 text-xs sm:text-sm font-sans leading-relaxed mb-8">
                Experience real-time neural body tracking and 3D architectural
                draping directly through your webcam. Video is processed locally
                on your device.
              </p>

              <button
                onClick={startCamera}
                className="w-full py-4 rounded-full bg-white text-black font-heading text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#E8E8E8] transition-all duration-300 shadow-[0_4px_24px_rgba(255,255,255,0.25)] flex items-center justify-center gap-3"
              >
                <Sparkles className="w-4 h-4" />
                <span>Activate Live Mirror</span>
              </button>

              <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-white/30">
                WebGL 2.0 • MediaPipe Pose • Zero Server Transmission
              </p>
            </div>
          )}

          {/* 8. Initializing / Camera Requesting State */}
          {(status === "INITIALIZING_VISION" ||
            status === "REQUESTING_CAMERA") && (
            <div className="relative z-30 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="font-heading text-[10px] uppercase tracking-[0.25em] text-white/80">
                {status === "INITIALIZING_VISION"
                  ? "Loading Neural Vision Models..."
                  : "Connecting to Device Camera..."}
              </p>
            </div>
          )}

          {/* 9. Error / Denied State */}
          {(status === "CAMERA_DENIED" || status === "ERROR") && (
            <div className="relative z-30 max-w-md w-full mx-4 p-8 rounded-[28px] border border-red-500/20 bg-[#0A0A0A]/95 backdrop-blur-2xl text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-sm uppercase tracking-widest text-white mb-2">
                Camera Access Needed
              </h3>
              <p className="text-white/60 text-xs font-sans leading-relaxed mb-6">
                {errorMessage || "Unable to access webcam."}
              </p>
              <button
                onClick={startCamera}
                className="px-6 py-3 rounded-full bg-white text-black font-heading text-[10px] font-semibold uppercase tracking-widest hover:bg-white/90 transition-colors"
              >
                Retry Activation
              </button>
            </div>
          )}

          {/* 10. HUD Floating Action Panel (Right Side) */}
          {(status === "TRACKING_LOCKED" || status === "SEARCHING_BODY") && (
            <div className="absolute top-6 right-6 z-30 flex flex-col gap-2.5">
              {/* Snapshot Button */}
              <button
                onClick={captureSnapshot}
                className="w-11 h-11 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
                title="Capture & Save Look"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Render Mode Toggle (3D vs 2D) */}
              {selectedProduct.is3DSupported && (
                <button
                  onClick={() =>
                    setRenderMode((m) => (m === "3D" ? "2D" : "3D"))
                  }
                  className="w-11 h-11 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 shadow-lg font-mono text-[9px] font-bold"
                  title={`Switch to ${renderMode === "3D" ? "2D Adaptive" : "3D Mesh"} Mode`}
                >
                  {renderMode === "3D" ? <Box className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                </button>
              )}

              {/* Landmarks Wireframe Toggle */}
              <button
                onClick={() => setShowLandmarks((s) => !s)}
                className={cn(
                  "w-11 h-11 rounded-full border backdrop-blur-xl flex items-center justify-center transition-all duration-300 shadow-lg",
                  showLandmarks
                    ? "bg-white text-black border-white"
                    : "border-white/15 bg-black/60 text-white hover:bg-white hover:text-black"
                )}
                title="Toggle Skeleton Landmarks Overlay"
              >
                {showLandmarks ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              {/* Fit Scale Presets */}
              <div className="flex flex-col gap-1 p-1 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl">
                {(["Snug", "Standard", "Relaxed"] as FitMode[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFitMode(f)}
                    className={cn(
                      "px-2 py-1 rounded-xl font-heading text-[8px] uppercase tracking-wider transition-colors",
                      fitMode === f
                        ? "bg-white text-black font-bold"
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    {f[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─── BOTTOM PRODUCT DRAWER: REAL ASHENRITUAL CATALOGUE ──────────── */}
      <footer className="relative z-30 border-t border-white/[0.08] bg-[#0A0A0A]/95 backdrop-blur-2xl px-4 sm:px-8 py-3.5">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-3">
          {/* Category Tabs & Active Garment Info */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: "all", label: "All Garments" },
                { id: "jackets", label: "Outerwear" },
                { id: "shirts", label: "Shirts" },
                { id: "tshirts", label: "T-Shirts" },
                { id: "suits", label: "Suits" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full font-heading text-[9px] uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap",
                    activeCategory === cat.id
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Active Garment Banner */}
            <div className="flex items-center gap-3">
              <span className="font-heading text-[10px] uppercase tracking-widest text-white/50 hidden sm:inline">
                Selected Garment:
              </span>
              <span className="font-heading text-[11px] uppercase tracking-[0.2em] font-semibold text-white">
                {selectedProduct.name}
              </span>
              <span className="font-mono text-[10px] text-white/80">
                ₹{selectedProduct.price.toLocaleString("en-IN")}
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full font-mono text-[8px] uppercase tracking-widest",
                  selectedProduct.is3DSupported && renderMode === "3D"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                )}
              >
                {selectedProduct.is3DSupported && renderMode === "3D"
                  ? "3D Real-Time Mesh"
                  : "2D Adaptive Overlay"}
              </span>
            </div>
          </div>

          {/* Garment Cards Carousel */}
          <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none">
            {filteredProducts.map((product) => {
              const isSelected = product.id === selectedProduct.id;
              return (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className={cn(
                    "group relative flex-shrink-0 w-24 sm:w-28 rounded-2xl p-2 border transition-all duration-400 text-left flex flex-col gap-2 overflow-hidden",
                    isSelected
                      ? "border-white bg-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#111] flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="112px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.is3DSupported && (
                      <span className="absolute top-1 right-1 px-1 py-0.5 rounded text-[7px] font-mono font-bold bg-black/80 text-white border border-white/20">
                        3D
                      </span>
                    )}
                  </div>

                  {/* Title & Price */}
                  <div className="flex flex-col min-w-0">
                    <span className="font-heading text-[9px] uppercase tracking-wider text-white truncate group-hover:text-white">
                      {product.name}
                    </span>
                    <span className="font-mono text-[8px] text-white/50">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
