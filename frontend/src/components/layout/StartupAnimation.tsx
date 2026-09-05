/**
 * @fileoverview ASHENRITUAL Architecture
 * @module StartupAnimation.tsx
 */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function StartupAnimation() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if the user has already seen the animation this session
    const hasSeen = sessionStorage.getItem('ashenritual-startup');
    
    if (hasSeen) {
      setShow(false);
    } else {
      sessionStorage.setItem('ashenritual-startup', 'true');
      
      // Auto-hide the overlay exactly when the animation finishes
      setTimeout(() => {
        setShow(false);
      }, 3200);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          // We use the absolute darkest background so the dramatic reveal pops
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
            animate={{ 
              scale: [0.8, 1, 1.05, 30], 
              opacity: [0, 1, 1, 0],
              filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(0px)']
            }}
            transition={{ 
              duration: 3.2, 
              times: [0, 0.3, 0.7, 1], 
              ease: "easeInOut" 
            }}
            className="relative flex items-center justify-center will-change-transform"
          >
            {/* SOFT BACKGROUND FOG */}
            {mounted && (
              <div className="absolute inset-0 z-[-1] mt-16 flex items-center justify-center pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`cloud-${i}`}
                    className="absolute rounded-full bg-[#151515]"
                    style={{
                      width: Math.random() * 100 + 200, 
                      height: Math.random() * 100 + 200,
                      filter: 'blur(40px)', // Extremely soft, almost invisible background fog
                    }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [0.8, 1.2],
                      x: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60],
                      y: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60 - 40],
                    }}
                    transition={{ 
                      duration: Math.random() * 2 + 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: Math.random()
                    }}
                  />
                ))}
              </div>
            )}

            {/* SHINY LANTERN IMAGE */}
            <Image 
              src="/images/lantern-logo.png" 
              alt="ASHENRITUAL" 
              width={500} 
              height={500} 
              className="relative z-0 h-[250px] w-auto object-contain mt-16"
              unoptimized
              priority
            />

            {/* DENSE GLOWING ASH PARTICLES */}
            {mounted && (
              <div className="absolute inset-0 z-[10] mt-16 flex items-center justify-center pointer-events-none">
                {[...Array(80)].map((_, i) => {
                  const size = Math.random() * 4 + 1.5; // 1.5px to 5.5px
                  const angle = Math.random() * Math.PI * 2;
                  // Tighter distribution to keep particles much closer to the image
                  const distance = Math.pow(Math.random(), 0.8) * 140; 
                  const startX = Math.cos(angle) * distance;
                  const startY = Math.sin(angle) * distance;
                  
                  // Gentle drift, mostly upwards like dust motes
                  const driftX = startX + (Math.random() * 40 - 20);
                  const driftY = startY - (Math.random() * 60 + 20);
                  
                  return (
                    <motion.div
                      key={`ash-${i}`}
                      className="absolute rounded-full bg-white"
                      style={{
                        width: size, 
                        height: size,
                        boxShadow: `0 0 ${size * 3}px ${size * 0.5}px rgba(255,255,255,0.8)`, // Soft glow
                        filter: 'blur(0.5px)',
                      }}
                      animate={{
                        opacity: [0, Math.random() * 0.5 + 0.5, 0], // Smooth fade in/out
                        y: [startY, driftY],
                        x: [startX, driftX],
                        scale: [0.5, 1.2, 0.5],
                      }}
                      transition={{
                        duration: Math.random() * 3 + 2, // 2s to 5s
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2
                      }}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
