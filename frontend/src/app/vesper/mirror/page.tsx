/**
 * @fileoverview ASHENRITUAL Vesper Mirror — Standalone Real-Time Virtual Try-On
 * @module page.tsx
 *
 * Implements two distinct fitting experiences:
 * 1. White Mask Silhouette (Architectural monochrome vector silhouette)
 * 2. Softwear 3D Colored Collection (Real-time textured 3D GLB mesh fitting)
 *
 * Garment drawer is permanently fixed on the RIGHT side of the window.
 * Website products and 3D assets remain separate.
 */
"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  RefreshCw,
  Scan,
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
import { drawWhiteGarmentSilhouette } from "@/lib/vto/WhiteSilhouetteRenderer";
import {
  ASHEN_TRYON_CATALOGUE,
  TryOnProduct,
  WardrobeSection,
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
type RenderMode = "SILHOUETTE" | "3D";

export default function VesperMirrorPage() {
  // ─── State ────────────────────────────────────────────────────────────────
  const [status, setStatus] = useState<MirrorStatus>("IDLE");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active section: "silhouette" (White Mask Silhouette) or "softwear-3d" (3D Colored Mesh)
  const [activeSection, setActiveSection] = useState<WardrobeSection>("silhouette");
  const [selectedProduct, setSelectedProduct] = useState<TryOnProduct>(
    ASHEN_TRYON_CATALOGUE.find((p) => p.section === "silhouette") || ASHEN_TRYON_CATALOGUE[0]
  );
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [renderMode, setRenderMode] = useState<RenderMode>("SILHOUETTE");
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
  const selectedProductRef = useRef<TryOnProduct>(selectedProduct);

  // Synchronize ref with active product
  useEffect(() => {
    selectedProductRef.current = selectedProduct;
  }, [selectedProduct]);

  // Performance telemetry counters
  const frameCountRef = useRef<number>(0);
  const lastFpsTimestampRef = useRef<number>(performance.now());

  // ─── Filtered Products per Active Section & Category ───────────────────────
  const filteredProducts = useMemo(() => {
    const sectionProducts = ASHEN_TRYON_CATALOGUE.filter(
      (p) => p.section === activeSection
    );
    if (activeCategory === "all") return sectionProducts;
    return sectionProducts.filter((p) => p.category === activeCategory);
  }, [activeSection, activeCategory]);

  // ─── Fit Scale Mapping ────────────────────────────────────────────────────
  useEffect(() => {
    if (!poseEngineRef.current) return;
    if (fitMode === "Snug") poseEngineRef.current.userFitScale = 0.92;
    else if (fitMode === "Relaxed") poseEngineRef.current.userFitScale = 1.12;
    else poseEngineRef.current.userFitScale = 1.0;
  }, [fitMode]);

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
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
        outputSegmentationMasks: false,
      });
      landmarkerRef.current = landmarker;
      return landmarker;
    } catch (err) {
      console.error("Vesper Mirror: Failed to initialize MediaPipe vision task", err);
      setStatus("ERROR");
      setErrorMessage(
        "Failed to load vision tracking models. Please verify your internet connection."
      );
      return null;
    }
  }, []);

  // ─── Initialize Three.js WebGL Engine ─────────────────────────────────────
  const initThreeEngine = useCallback(() => {
    if (!threeCanvasRef.current || garmentRendererRef.current) return;
    try {
      const stage = stageRef.current;
      garmentRendererRef.current = new GarmentRenderer(threeCanvasRef.current);
      if (stage) {
        garmentRendererRef.current.resize(stage.clientWidth, stage.clientHeight);
      }
      poseEngineRef.current = new VtoPoseEngine();
    } catch (err) {
      console.warn("Vesper Mirror: WebGL initialization failed, using White Silhouette Mask", err);
      setRenderMode("SILHOUETTE");
    }
  }, []);

  // ─── Switch Garment Selection ─────────────────────────────────────────────
  const handleSelectProduct = useCallback(
    async (product: TryOnProduct) => {
      setSelectedProduct(product);

      if (product.section === "softwear-3d" && product.model3DPath) {
        setRenderMode("3D");
        if (garmentRendererRef.current) {
          try {
            setModelLoadingProgress(10);
            const stats = await garmentRendererRef.current.loadGarment(
              product.model3DPath,
              (percent) => setModelLoadingProgress(percent)
            );
            setMeshStats(stats);
            setModelLoadingProgress(null);
          } catch (err) {
            console.warn(`3D model load failed for ${product.name}, falling back to White Mask Silhouette.`, err);
            setModelLoadingProgress(null);
            setRenderMode("SILHOUETTE");
          }
        }
      } else {
        setRenderMode("SILHOUETTE");
        if (garmentRendererRef.current) {
          garmentRendererRef.current.clearCurrentModel();
        }
      }
    },
    []
  );

  // ─── Start Camera & Live Tracking ─────────────────────────────────────────
  const startCamera = async () => {
    try {
      setStatus("REQUESTING_CAMERA");
      setErrorMessage(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
          frameRate: { ideal: 60, min: 30 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      initThreeEngine();
      const landmarker = await initMediaPipe();
      if (!landmarker) return;

      setStatus("SEARCHING_BODY");

      // If user had a 3D model active, preload it
      if (selectedProduct.section === "softwear-3d" && selectedProduct.model3DPath && garmentRendererRef.current) {
        garmentRendererRef.current.loadGarment(selectedProduct.model3DPath).catch(() => {});
      }
    } catch (err) {
      console.error("Vesper Mirror: Camera access failed", err);
      const isDenied =
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "PermissionDeniedError");
      setStatus(isDenied ? "CAMERA_DENIED" : "ERROR");
      setErrorMessage(
        isDenied
          ? "Camera permission was denied. Please allow camera access in your browser to experience live fitting."
          : "Unable to start webcam. Please ensure your camera is not in use by another application."
      );
    }
  };

  // ─── Stop Camera & Comprehensive Cleanup ──────────────────────────────────
  const stopCamera = useCallback(() => {
    // 1. Cancel animation loop
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // 2. Stop all media stream tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }

    // 3. Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // 4. Clear WebGL models
    if (garmentRendererRef.current) {
      garmentRendererRef.current.clearCurrentModel();
    }

    // 5. Clear overlay & debug canvases
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
      const renderer = garmentRendererRef.current;
      const poseEngine = poseEngineRef.current;

      if (video && landmarker && renderer && poseEngine && video.readyState >= 2) {
        const now = performance.now();

        // Calculate telemetry FPS
        frameCountRef.current++;
        if (now - lastFpsTimestampRef.current >= 500) {
          const elapsed = (now - lastFpsTimestampRef.current) / 1000;
          setFps(Math.round(frameCountRef.current / elapsed));
          frameCountRef.current = 0;
          lastFpsTimestampRef.current = now;
        }

        // Only infer on new video frames
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;

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

              // 3. Render White Mask Silhouette or Clear
              if (renderMode === "SILHOUETTE" && overlayCanvasRef.current) {
                const currentProd = selectedProductRef.current;
                drawWhiteGarmentSilhouette(
                  overlayCanvasRef.current,
                  poseState,
                  currentProd.category,
                  currentProd.id,
                  {
                    fitScale: poseEngineRef.current?.userFitScale || 1.0,
                    showSeams: true,
                  }
                );
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
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    ctx.restore();
  };

  // ─── Capture Snapshot ─────────────────────────────────────────────────────
  const captureSnapshot = useCallback(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current;
    const snapshotCanvas = document.createElement("canvas");
    snapshotCanvas.width = stage.clientWidth;
    snapshotCanvas.height = stage.clientHeight;
    const sCtx = snapshotCanvas.getContext("2d");
    if (!sCtx) return;

    // Flip horizontally to capture exactly what the user saw in mirror mode
    sCtx.save();
    sCtx.translate(snapshotCanvas.width, 0);
    sCtx.scale(-1, 1);

    // 1. Draw video feed
    if (videoRef.current && videoRef.current.readyState >= 2) {
      sCtx.drawImage(videoRef.current, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
    }

    // 2. Draw active garment layer
    if (renderMode === "SILHOUETTE" && overlayCanvasRef.current) {
      sCtx.drawImage(overlayCanvasRef.current, 0, 0);
    } else if (renderMode === "3D" && threeCanvasRef.current) {
      sCtx.drawImage(threeCanvasRef.current, 0, 0);
    }

    sCtx.restore();

    // 3. Editorial Watermark
    sCtx.font = "600 11px sans-serif";
    sCtx.fillStyle = "rgba(255, 255, 255, 0.9)";
    sCtx.fillText("ASHENRITUAL • VESPER MIRROR", 24, snapshotCanvas.height - 30);
    sCtx.font = "400 9px monospace";
    sCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
    sCtx.fillText(
      `${selectedProduct.name.toUpperCase()} • ${shoulderCm}CM SPAN • ${new Date().toLocaleDateString()}`,
      24,
      snapshotCanvas.height - 16
    );

    // Trigger download
    const link = document.createElement("a");
    link.download = `ashenritual-look-${selectedProduct.id}-${Date.now()}.png`;
    link.href = snapshotCanvas.toDataURL("image/png");
    link.click();
  }, [selectedProduct, shoulderCm, renderMode]);

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-black text-white flex flex-col overflow-hidden select-none font-sans">
      {/* ─── TOP BAR: NAVIGATION & HUD ─────────────────────────────────────── */}
      <header className="relative z-40 h-14 border-b border-white/[0.08] bg-[#0A0A0A]/95 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/vesper"
            onClick={() => stopCamera()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white hover:text-black font-heading text-[10px] uppercase tracking-[0.2em] transition-all duration-300 text-white/80 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Vesper Chat</span>
          </Link>

          <div className="hidden sm:block h-4 w-[1px] bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <h1 className="font-heading text-xs uppercase tracking-[0.25em] text-white font-semibold">
              Vesper — Mirror
            </h1>
            <span className="text-white/20 hidden md:inline">/</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/50 hidden md:inline">
              Architectural Virtual Dressing
            </span>
          </div>
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
              <span className="text-white/20">•</span>
              <span>{trackingConfidence}% Conf</span>
              {renderMode === "3D" && meshStats && (
                <>
                  <span className="text-white/20">•</span>
                  <span>{(meshStats.triangles / 1000).toFixed(1)}k Tris</span>
                </>
              )}
            </div>
          )}

          {/* Active Mode Indicator */}
          <span
            className={cn(
              "hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase border",
              renderMode === "3D"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-white/10 text-white border-white/20"
            )}
          >
            {renderMode === "3D" ? "Softwear 3D Colored Mesh" : "White Mask Silhouette"}
          </span>

          {status === "TRACKING_LOCKED" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase bg-white/10 text-white border border-white/20">
              <CheckCircle2 className="w-3 h-3 text-white" />
              Locked
            </span>
          ) : status === "SEARCHING_BODY" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase bg-white/5 text-white/70 border border-white/10">
              <Scan className="w-3 h-3 animate-spin text-white/70" />
              Calibrating
            </span>
          ) : null}

          {status === "TRACKING_LOCKED" || status === "SEARCHING_BODY" ? (
            <button
              onClick={stopCamera}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase bg-white/5 text-white/70 hover:bg-white hover:text-black border border-white/10 transition-colors"
            >
              <CameraOff className="w-3 h-3" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : null}
        </div>
      </header>

      {/* ─── MAIN WORKSPACE: CAMERA STAGE + RIGHT CLOTHES DRAWER ─────────── */}
      <div className="relative flex-1 w-full h-[calc(100vh-56px)] flex flex-col md:flex-row overflow-hidden">
        {/* ─── LEFT/CENTER: FULL HEIGHT CAMERA VIEWPORT ────────────────────── */}
        <main className="relative flex-1 h-full overflow-hidden flex items-center justify-center bg-black">
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

            {/* 3. White Mask Silhouette Canvas (Mirrored) */}
            <canvas
              ref={overlayCanvasRef}
              className={cn(
                "absolute inset-0 w-full h-full pointer-events-none -scale-x-100 z-10",
                renderMode === "SILHOUETTE" ? "block" : "hidden"
              )}
            />

            {/* 4. Debug Skeleton Landmarks Canvas (Mirrored) */}
            <canvas
              ref={debugCanvasRef}
              className={cn(
                "absolute inset-0 w-full h-full pointer-events-none -scale-x-100 z-20",
                showLandmarks ? "block" : "hidden"
              )}
            />

            {/* 5. 3D Model Loading Overlay */}
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
                className="absolute top-8 left-1/2 -translate-x-1/2 z-30 px-6 py-3 rounded-full border border-white/20 bg-black/80 backdrop-blur-2xl text-center pointer-events-none shadow-2xl"
              >
                <p className="font-heading text-[10px] uppercase tracking-[0.25em] text-white mb-1">
                  Position Upper Torso in Frame
                </p>
                <p className="font-mono text-[9px] text-white/50 tracking-wider">
                  Step 1.5 - 2.5m back • Ensure shoulders are visible
                </p>
              </motion.div>
            )}

            {/* 7. Idle Splash / Activation State */}
            {status === "IDLE" && (
              <div className="relative z-30 max-w-lg w-full mx-4 p-8 rounded-[32px] border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-2xl text-center shadow-2xl">
                <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-white">
                  <Camera className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h2 className="font-heading text-lg uppercase tracking-[0.3em] text-white font-medium mb-2">
                  Vesper Mirror
                </h2>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-3">
                  Architectural White Mask Silhouette & 3D Colored Dressing
                </p>
                <p className="text-white/70 text-xs font-sans leading-relaxed mb-6 max-w-md mx-auto">
                  Live webcam body tracking calibrated to human shoulder span and torso geometry. Pure monochrome silhouette mask & real-time 3D textured mesh with zero cloud uploads.
                </p>
                <button
                  onClick={startCamera}
                  className="px-8 py-3.5 rounded-full bg-white text-black font-heading text-[10px] font-semibold uppercase tracking-[0.25em] hover:bg-neutral-200 transition-all duration-300 shadow-xl"
                >
                  Initialize Live Mirror
                </button>
              </div>
            )}

            {/* 8. Initializing / Requesting Camera State */}
            {(status === "INITIALIZING_VISION" ||
              status === "REQUESTING_CAMERA") && (
              <div className="relative z-30 max-w-sm w-full mx-4 p-8 rounded-[32px] border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-2xl text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-white" />
                <h3 className="font-heading text-xs uppercase tracking-[0.25em] text-white mb-2">
                  {status === "INITIALIZING_VISION"
                    ? "Loading Vision Landmarker..."
                    : "Connecting Video Stream..."}
                </h3>
                <p className="text-white/50 text-[10px] font-mono tracking-wider">
                  Edge computer vision pipeline calibrating
                </p>
              </div>
            )}

            {/* 9. Error / Denied State */}
            {(status === "CAMERA_DENIED" || status === "ERROR") && (
              <div className="relative z-30 max-w-md w-full mx-4 p-8 rounded-[28px] border border-white/20 bg-[#0A0A0A]/95 backdrop-blur-2xl text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white">
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
                  className="px-6 py-3 rounded-full bg-white text-black font-heading text-[10px] font-semibold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                >
                  Retry Activation
                </button>
              </div>
            )}

            {/* 10. Floating HUD Controls (Top Right of Stage) */}
            {(status === "TRACKING_LOCKED" || status === "SEARCHING_BODY") && (
              <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
                {/* Snapshot Button */}
                <button
                  onClick={captureSnapshot}
                  className="w-10 h-10 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-lg"
                  title="Capture & Save Look"
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* Mode Toggle: White Mask Silhouette vs 3D */}
                {selectedProduct.is3DSupported && (
                  <button
                    onClick={() =>
                      setRenderMode((m) => (m === "SILHOUETTE" ? "3D" : "SILHOUETTE"))
                    }
                    className="w-10 h-10 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-lg font-mono text-[9px] font-bold"
                    title={`Switch Mode: Currently ${renderMode === "SILHOUETTE" ? "White Mask Silhouette" : "3D Mesh"}`}
                  >
                    {renderMode === "SILHOUETTE" ? <Layers className="w-4 h-4" /> : <Box className="w-4 h-4" />}
                  </button>
                )}

                {/* Landmarks Wireframe Toggle */}
                <button
                  onClick={() => setShowLandmarks((s) => !s)}
                  className={cn(
                    "w-10 h-10 rounded-full border backdrop-blur-xl flex items-center justify-center transition-all shadow-lg",
                    showLandmarks
                      ? "bg-white text-black border-white"
                      : "border-white/15 bg-black/60 text-white hover:bg-white hover:text-black"
                  )}
                  title="Toggle Skeleton Landmarks Overlay"
                >
                  {showLandmarks ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        </main>

        {/* ─── RIGHT PANEL: VERTICAL CLOTHES SELECTION DRAWER ──────────────── */}
        <aside className="relative z-30 w-full md:w-80 lg:w-96 h-auto md:h-full flex flex-col border-t md:border-t-0 md:border-l border-white/[0.08] bg-[#0A0A0A]/95 backdrop-blur-2xl shrink-0 overflow-hidden">
          {/* Panel Header */}
          <div className="p-4 border-b border-white/[0.08]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading text-[10px] uppercase tracking-[0.25em] text-white/50">
                Architectural Wardrobe
              </span>
              <span className="font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/20 bg-white/5 text-white/80">
                {activeSection === "softwear-3d" ? "3D Textured Mesh" : "White Mask Silhouette"}
              </span>
            </div>

            {/* Section Switcher Tabs: White Silhouette vs Softwear 3D Colored */}
            <div className="grid grid-cols-2 p-1 rounded-full border border-white/10 bg-white/[0.03] mb-3">
              <button
                type="button"
                onClick={() => {
                  setActiveSection("silhouette");
                  const firstSil = ASHEN_TRYON_CATALOGUE.find((p) => p.section === "silhouette");
                  if (firstSil) handleSelectProduct(firstSil);
                }}
                className={cn(
                  "py-1.5 px-2 rounded-full font-heading text-[8.5px] uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-1.5",
                  activeSection === "silhouette"
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-white/60 hover:text-white"
                )}
              >
                <span>White Silhouette</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSection("softwear-3d");
                  const first3D = ASHEN_TRYON_CATALOGUE.find((p) => p.section === "softwear-3d");
                  if (first3D) handleSelectProduct(first3D);
                }}
                className={cn(
                  "py-1.5 px-2 rounded-full font-heading text-[8.5px] uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-1.5",
                  activeSection === "softwear-3d"
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-white/60 hover:text-white"
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Softwear 3D Color</span>
              </button>
            </div>

            {/* Active Selected Garment Summary Card */}
            <div className="p-3 rounded-2xl border border-white/15 bg-white/[0.03] flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-heading text-xs uppercase tracking-wider text-white truncate font-medium">
                  {selectedProduct.name}
                </span>
                <span className="font-mono text-[10px] text-white/60">
                  ₹{selectedProduct.price.toLocaleString("en-IN")}
                </span>
                <span className="font-mono text-[8px] uppercase text-white/40 tracking-wider">
                  {selectedProduct.section === "softwear-3d"
                    ? "3D Real-Time Textured Mesh"
                    : `Cut: ${selectedProduct.category.toUpperCase()} • ${selectedProduct.fitProfile}`}
                </span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: "all", label: "All" },
              { id: "jackets", label: "Outerwear" },
              { id: "shirts", label: "Shirts" },
              { id: "tshirts", label: "Tees" },
              { id: "suits", label: "Suits" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-3 py-1 rounded-full font-heading text-[8px] uppercase tracking-[0.2em] transition-all whitespace-nowrap",
                  activeCategory === cat.id
                    ? "bg-white text-black font-bold shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Vertical Garment List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
            {filteredProducts.map((product) => {
              const isSelected = product.id === selectedProduct.id;
              return (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className={cn(
                    "group w-full rounded-2xl p-2.5 border transition-all text-left flex items-center gap-3 overflow-hidden",
                    isSelected
                      ? "border-white bg-white/[0.08] shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.section === "softwear-3d" && (
                      <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded text-[7px] font-mono font-bold bg-emerald-500/90 text-black border border-white/20">
                        3D
                      </span>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-heading text-[10px] uppercase tracking-wider text-white truncate font-medium">
                      {product.name}
                    </span>
                    <span className="font-mono text-[9px] text-white/50">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-white/40 mt-0.5">
                      {product.section === "softwear-3d"
                        ? "Softwear 3D • Colored Mesh"
                        : `${product.category} • Silhouette`}
                    </span>
                  </div>

                  {/* Radio / Selection Indicator */}
                  <div className="shrink-0 pr-1">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                        isSelected
                          ? "border-white bg-white"
                          : "border-white/20 group-hover:border-white/40"
                      )}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Panel Footer: Fit Scale & Summary */}
          <div className="p-4 border-t border-white/[0.08] bg-black/40 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-heading text-[8px] uppercase tracking-widest text-white/50">
                Fit Calibration
              </span>
              <div className="flex items-center gap-1">
                {(["Snug", "Standard", "Relaxed"] as FitMode[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFitMode(f)}
                    className={cn(
                      "px-2.5 py-1 rounded-full font-heading text-[8px] uppercase tracking-wider transition-colors border",
                      fitMode === f
                        ? "bg-white text-black font-bold border-white"
                        : "text-white/60 hover:text-white border-white/10 bg-white/[0.02]"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">
                {activeSection === "softwear-3d" ? "WebGL Three.js Engine" : "Monochrome Vector Mask"}
              </span>
              <span className="font-mono text-[8px] text-white/70">
                {shoulderCm > 0 ? `${shoulderCm}cm Calibrated` : "Awaiting Frame"}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
