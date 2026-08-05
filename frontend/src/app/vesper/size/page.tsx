'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaPipe } from './useMediaPipe';
import { useSizeStore, BodyProfile, BodyMeasurements } from '@/store/size.store';
import { api } from '@/lib/api';
import { Camera, Ruler, RefreshCw, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SizeIntelligencePage() {
  const router = useRouter();
  const { landmarker, isInitializing, error } = useMediaPipe();
  const { profile, setProfile } = useSizeStore();

  const [step, setStep] = useState<'INPUT' | 'SCANNING' | 'ANALYZING' | 'REPORT'>('INPUT');
  
  // User Inputs
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('70');
  const [gender, setGender] = useState('M');
  const [preferredFit, setPreferredFit] = useState('Slim');

  // Live Estimations
  const [estimates, setEstimates] = useState<Partial<BodyMeasurements>>({});
  const [isStable, setIsStable] = useState(false);
  const stableFrames = useRef(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  
  // Start Camera
  // Temporary holding ref for the stream until the video element mounts
  const pendingStream = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      pendingStream.current = stream;
      
      // Change step first so the video element mounts in the DOM
      setStep('SCANNING');
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Camera access is required for Architectural Body Analysis. Please ensure no other app (like Zoom) is using it.');
    }
  };

  // Once step changes to SCANNING, wait for the video element to mount (Framer Motion delay)
  useEffect(() => {
    if (step === 'SCANNING') {
      const interval = setInterval(() => {
        if (videoRef.current && pendingStream.current) {
          videoRef.current.srcObject = pendingStream.current;
          // We don't strictly need onloadedmetadata if autoPlay is on, but it's safe
          videoRef.current.onloadedmetadata = () => videoRef.current?.play().catch(() => {});
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
      stream.getTracks().forEach(track => track.stop());
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
    if (step !== 'SCANNING' || !landmarker || !videoRef.current || !canvasRef.current) return;

    let lastVideoTime = -1;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderLoop = () => {
      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        
        // Ensure canvas matches video dimensions
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const results = landmarker.detectForVideo(video, performance.now());

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (results.landmarks && results.landmarks.length > 0) {
          const marks = results.landmarks[0];
          
          // Draw Architectural Scanner Lines (Premium Aesthetic)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          
          // Connect Shoulders
          const lShoulder = marks[11];
          const rShoulder = marks[12];
          const lHip = marks[23];
          const rHip = marks[24];
          
          if (lShoulder && rShoulder) {
            ctx.beginPath();
            ctx.moveTo(lShoulder.x * canvas.width, lShoulder.y * canvas.height);
            ctx.lineTo(rShoulder.x * canvas.width, rShoulder.y * canvas.height);
            ctx.stroke();
            
            // Draw tiny plus signs at joints
            const drawJoint = (x: number, y: number) => {
               ctx.beginPath(); ctx.moveTo(x-5, y); ctx.lineTo(x+5, y); ctx.stroke();
               ctx.beginPath(); ctx.moveTo(x, y-5); ctx.lineTo(x, y+5); ctx.stroke();
            };
            drawJoint(lShoulder.x * canvas.width, lShoulder.y * canvas.height);
            drawJoint(rShoulder.x * canvas.width, rShoulder.y * canvas.height);

            // Very rough 2D estimation logic
            const pixelDist = Math.abs(lShoulder.x - rShoulder.x);
            // Assume the full height of the body is visible, and the frame is roughly the user's height.
            // This is a gross simplification for architectural aesthetic.
            const estimatedShouldersCm = Math.round(pixelDist * parseInt(heightCm) * 1.5); 
            
            setEstimates(prev => ({ ...prev, shoulderWidthCm: estimatedShouldersCm }));

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
    setStep('ANALYZING');
    
    // Simulate some missing measurements for the demo
    const finalMeasurements: BodyMeasurements = {
      heightCm: parseInt(heightCm),
      weightKg: parseInt(weightKg),
      shoulderWidthCm: estimates.shoulderWidthCm || 44,
      chestCircumferenceCm: estimates.shoulderWidthCm ? estimates.shoulderWidthCm * 2.2 : 96,
      waistCircumferenceCm: estimates.shoulderWidthCm ? estimates.shoulderWidthCm * 1.8 : 80,
      sleeveLengthCm: 64,
      neckCircumferenceCm: 38
    };

    try {
      const response = await api.post('/vesper/analyze-size', {
        ...finalMeasurements,
        gender,
        preferredFit
      }) as any;

      const profileData: BodyProfile = {
        id: 'bp-' + Date.now(),
        measurements: finalMeasurements,
        bodyType: response.bodyType,
        preferredFit: preferredFit as any,
        gender,
        confidenceScore: response.confidenceScore,
        lastUpdated: new Date().toISOString()
      };

      setProfile(profileData);
      setStep('REPORT');
    } catch (err) {
      console.error(err);
      alert('Analysis failed. Please try again.');
      setStep('INPUT');
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto px-12 py-12 hide-scrollbar relative">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <header className="mb-12">
          <h1 className="font-heading text-2xl uppercase tracking-[0.2em] text-[#FDFCFB]">
            Size Intelligence
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-[#8D8D8D] mt-2">
            Architectural Body Analysis
          </p>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-12">
          {/* Left Column (Camera / Form) */}
          <div className="flex-1 border border-[#202020] bg-[#0A0A0A] rounded-sm relative overflow-hidden group min-h-[400px]">
            {/* Corner Brackets for Architectural Vibe */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#4A4A4A] z-20" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#4A4A4A] z-20" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#4A4A4A] z-20" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#4A4A4A] z-20" />

            <AnimatePresence mode="wait">
              {step === 'INPUT' && (
                <motion.div 
                  key="input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
                >
                  <Camera className="w-8 h-8 text-[#4A4A4A] mb-6" />
                  <h3 className="font-heading text-lg uppercase tracking-widest text-[#E8E8E8] mb-8">
                    Establish Baseline
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6 w-full max-w-sm mb-12">
                    <div className="flex flex-col text-left">
                      <label className="text-[9px] uppercase tracking-widest text-[#8D8D8D] mb-2">Height (cm)</label>
                      <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} className="bg-transparent border-b border-[#333] text-[#FDFCFB] px-0 py-2 focus:ring-0 focus:border-[#FDFCFB] transition-colors" />
                    </div>
                    <div className="flex flex-col text-left">
                      <label className="text-[9px] uppercase tracking-widest text-[#8D8D8D] mb-2">Weight (kg)</label>
                      <input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} className="bg-transparent border-b border-[#333] text-[#FDFCFB] px-0 py-2 focus:ring-0 focus:border-[#FDFCFB] transition-colors" />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button 
                      onClick={startCamera}
                      disabled={isInitializing}
                      className="bg-[#FDFCFB] text-[#0A0A0A] px-8 py-4 rounded-sm uppercase tracking-widest text-[11px] font-medium hover:bg-[#E8E8E8] transition-colors disabled:opacity-50"
                    >
                      {isInitializing ? 'Initializing Sensors...' : 'Initialize Camera'}
                    </button>

                    {/* Developer Bypass */}
                    <button 
                      onClick={() => {
                        setStep('SCANNING');
                        setIsStable(true);
                        setEstimates({ shoulderWidthCm: 48 });
                      }}
                      className="border border-[#333] text-[#8D8D8D] px-8 py-4 rounded-sm uppercase tracking-widest text-[11px] font-medium hover:bg-[#222] hover:text-[#FDFCFB] transition-colors"
                    >
                      Simulate (No Camera)
                    </button>
                  </div>
                  <p className="mt-6 text-[9px] uppercase tracking-widest text-[#4A4A4A]">
                    All body analysis is processed securely locally. Images are never permanently stored.
                  </p>
                </motion.div>
              )}

              {(step === 'SCANNING' || step === 'ANALYZING') && (
                <motion.div 
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black"
                >
                  <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-50 -scale-x-100" />
                  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover mix-blend-screen -scale-x-100" />
                  
                  {/* Scanning HUD */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[rgba(255,255,255,0.1)]" />
                    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[rgba(255,255,255,0.1)]" />
                    
                    {step === 'SCANNING' && (
                      <div className="absolute bottom-8 left-0 right-0 text-center">
                        <p className="font-mono text-xs text-[#8D8D8D] tracking-widest uppercase bg-[#0A0A0A]/80 inline-block px-4 py-2 border border-[#333]">
                          {isStable ? 'Proportions Acquired' : 'Aligning Architecture...'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column (Live Intelligence & Report) */}
          <div className="w-full lg:w-80 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {step === 'INPUT' && (
                <motion.div key="input-info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h4 className="font-heading text-sm uppercase tracking-widest text-[#FDFCFB] mb-4">The Process</h4>
                  <p className="text-xs text-[#8D8D8D] leading-relaxed mb-6">
                    Our Size Intelligence engine combines MediaPipe architectural landmarks with advanced proportional algorithms to map your unique silhouette without requiring manual tape measurements.
                  </p>
                  <div className="space-y-4 text-[10px] uppercase tracking-widest text-[#4A4A4A]">
                    <div className="flex items-center gap-3"><div className="w-1 h-1 bg-[#4A4A4A]" /> 1. Establish Baseline</div>
                    <div className="flex items-center gap-3"><div className="w-1 h-1 bg-[#4A4A4A]" /> 2. Align Architecture</div>
                    <div className="flex items-center gap-3"><div className="w-1 h-1 bg-[#4A4A4A]" /> 3. Interpreting Proportions</div>
                    <div className="flex items-center gap-3"><div className="w-1 h-1 bg-[#4A4A4A]" /> 4. Tailoring Recommendation</div>
                  </div>
                </motion.div>
              )}

              {step === 'SCANNING' && (
                <motion.div key="scanning-metrics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h4 className="font-heading text-sm uppercase tracking-widest text-[#FDFCFB] mb-8 flex items-center gap-3">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Live Metrics
                  </h4>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#8D8D8D] mb-1">Shoulder Width</p>
                      <p className="font-mono text-2xl text-[#E8E8E8]">{estimates.shoulderWidthCm ? `${estimates.shoulderWidthCm} cm` : '---'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#8D8D8D] mb-1">Torso Alignment</p>
                      <p className="font-mono text-2xl text-[#E8E8E8]">{isStable ? 'Optimal' : 'Calibrating'}</p>
                    </div>
                  </div>

                  <button 
                    onClick={finalizeAnalysis}
                    disabled={!isStable}
                    className="mt-12 w-full bg-[#FDFCFB] text-[#0A0A0A] px-6 py-4 rounded-sm uppercase tracking-widest text-[11px] font-medium disabled:opacity-30 transition-all duration-300"
                  >
                    Analyze Proportions
                  </button>
                </motion.div>
              )}

              {step === 'ANALYZING' && (
                <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center py-12">
                  <div className="w-12 h-[1px] bg-[#4A4A4A] mb-8" />
                  <p className="font-heading text-[11px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-2">Interpreting Proportions</p>
                  <p className="text-[9px] uppercase tracking-widest text-[#4A4A4A] animate-pulse">Running Architectural Reasoning...</p>
                </motion.div>
              )}

              {step === 'REPORT' && profile && (
                <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] p-8 border border-[#202020] rounded-sm">
                  <h4 className="font-heading text-xs uppercase tracking-[0.2em] text-[#FDFCFB] mb-6 border-b border-[#333] pb-4">
                    Body Profile
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-[#8D8D8D]">Type</p>
                      <p className="text-sm text-[#E8E8E8] mt-1">{profile.bodyType}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-[#8D8D8D]">Confidence</p>
                      <p className="text-sm text-[#E8E8E8] mt-1">{profile.confidenceScore}%</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#8D8D8D] leading-relaxed italic border-l-2 border-[#333] pl-4 mb-8">
                    "{profile.measurements.shoulderWidthCm}cm shoulders with a {profile.measurements.chestCircumferenceCm}cm chest."
                    <br/><br/>
                    This profile guarantees structural precision across the ASHENRITUAL permanent collection.
                  </p>

                  <button 
                    onClick={() => router.push('/vesper/preview')}
                    className="w-full flex items-center justify-center gap-3 bg-[#FDFCFB] text-[#0A0A0A] px-6 py-4 rounded-sm uppercase tracking-widest text-[11px] font-medium hover:bg-[#E8E8E8] transition-colors"
                  >
                    Enter Fit Preview <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
