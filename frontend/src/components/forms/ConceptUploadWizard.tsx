/**
 * @fileoverview ASHENRITUAL Architecture
 * @module ConceptUploadWizard.tsx
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, ArrowRight, Loader2, Check } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const STEPS = ['MEDIA', 'DETAILS', 'PUBLISH'] as const;

export function ConceptUploadWizard() {
  const { isUploadWizardOpen, closeUploadWizard } = useUIStore();
  const [step, setStep] = useState<typeof STEPS[number]>('MEDIA');
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Concept Art',
    description: '',
    materials: '',
    software: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUploadWizardOpen) {
      document.body.style.overflow = 'hidden';
      setStep('MEDIA');
      setFile(null);
      setPreviewUrl(null);
      setFormData({ title: '', type: 'Concept Art', description: '', materials: '', software: '' });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isUploadWizardOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setStep('DETAILS');
    }
  };

  const handlePublish = async () => {
    if (!file || !formData.title) return;
    setUploading(true);

    try {
      // 1. Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file, 'concepts');

      // 2. Format tags
      const materialsArray = formData.materials.split(',').map(s => s.trim()).filter(Boolean);
      const softwareArray = formData.software.split(',').map(s => s.trim()).filter(Boolean);

      // 3. Create Concept in backend
      await api.post('/concepts', {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        image: imageUrl,
        materials: materialsArray,
        software: softwareArray,
      });

      toast.success('Concept uploaded successfully');
      setStep('PUBLISH');
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isUploadWizardOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={closeUploadWizard}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
          >
            {/* Left Panel: Preview / Dropzone */}
            <div className="w-full md:w-1/2 bg-[#121212] border-r border-white/5 relative flex items-center justify-center p-8 group">
              {previewUrl ? (
                <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg" />
                  {step === 'DETAILS' && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="bg-white/10 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">Change Image</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full min-h-[400px] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-4 hover:border-white/30 hover:bg-white/[0.02] transition-colors"
                >
                  <UploadCloud className="w-8 h-8 text-white/40" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white/80">Upload Concept Image</p>
                    <p className="text-xs text-white/40 mt-1">High-res JPEG, PNG, or WEBP</p>
                  </div>
                </button>
              )}
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
            </div>

            {/* Right Panel: Form / Success */}
            <div className="w-full md:w-1/2 flex flex-col h-full bg-[#050505]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex gap-2 items-center">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <span className={`text-[10px] font-heading uppercase tracking-[0.2em] transition-colors ${step === s ? 'text-white font-bold' : 'text-white/20'}`}>
                        0{i + 1} {s}
                      </span>
                      {i < STEPS.length - 1 && <span className="text-white/10">/</span>}
                    </div>
                  ))}
                </div>
                <button onClick={closeUploadWizard} className="p-2 text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-8 overflow-y-auto">
                {step === 'MEDIA' && (
                  <div className="h-full flex flex-col justify-center items-center text-center max-w-sm mx-auto opacity-50">
                    <p className="text-sm text-white/60 mb-2">Select an image to begin.</p>
                    <p className="text-xs text-white/30">Your concept will be added to your portfolio and showcased in the Sanctum Exhibition.</p>
                  </div>
                )}

                {step === 'DETAILS' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                      <label className="text-[10px] font-heading uppercase tracking-[0.1em] text-white/50">Concept Title</label>
                      <input
                        value={formData.title}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                        placeholder="e.g., Obsidian Architect Jacket"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-heading uppercase tracking-[0.1em] text-white/50">Category</label>
                      <select
                        value={formData.type}
                        onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none"
                      >
                        <option>Concept Art</option>
                        <option>Material Study</option>
                        <option>3D Render</option>
                        <option>Physical Prototype</option>
                        <option>Moodboard</option>
                        <option>Sketch</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-heading uppercase tracking-[0.1em] text-white/50">Inspiration & Notes</label>
                      <textarea
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
                        placeholder="The philosophy behind the structure..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-heading uppercase tracking-[0.1em] text-white/50">Materials (Comma Separated)</label>
                      <input
                        value={formData.materials}
                        onChange={e => setFormData(prev => ({ ...prev, materials: e.target.value }))}
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                        placeholder="e.g., Heavyweight Canvas, Silicone"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-heading uppercase tracking-[0.1em] text-white/50">Software / Tools (Comma Separated)</label>
                      <input
                        value={formData.software}
                        onChange={e => setFormData(prev => ({ ...prev, software: e.target.value }))}
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                        placeholder="e.g., CLO3D, Blender"
                      />
                    </div>
                  </div>
                )}

                {step === 'PUBLISH' && (
                  <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-heading text-2xl uppercase tracking-wider text-white mb-2">Concept Immortalized</h3>
                    <p className="text-sm text-white/40 max-w-xs">
                      &quot;{formData.title}&quot; has been added to the Sanctum. It is now part of the permanent exhibition.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/5 flex justify-between items-center bg-[#080808]">
                {step === 'DETAILS' ? (
                  <>
                    <button onClick={() => setStep('MEDIA')} className="text-xs font-semibold text-white/40 hover:text-white transition-colors">
                      Back
                    </button>
                    <button
                      onClick={handlePublish}
                      disabled={!formData.title || uploading}
                      className="px-6 py-3 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/90 disabled:opacity-50 flex items-center gap-2 transition-all"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Publish to Sanctum</>}
                    </button>
                  </>
                ) : step === 'PUBLISH' ? (
                  <button onClick={closeUploadWizard} className="w-full py-3 bg-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all">
                    Close Window
                  </button>
                ) : (
                  <div /> 
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
