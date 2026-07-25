'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function StartupAnimation() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if the user has already seen the animation this session
    const hasSeen = sessionStorage.getItem('ashenritual-startup');
    
    if (!hasSeen) {
      setShow(true);
      sessionStorage.setItem('ashenritual-startup', 'true');
      
      // Auto-hide the overlay exactly when the animation finishes
      setTimeout(() => {
        setShow(false);
      }, 3200);
    }
  }, []);

  // Prevent hydration mismatch by not rendering anything until client mounts
  if (!mounted) return null;

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
              scale: [0.8, 1, 1.05, 15], 
              opacity: [0, 1, 1, 0],
              filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(20px)']
            }}
            transition={{ 
              duration: 3.2, 
              times: [0, 0.3, 0.7, 1], 
              ease: "easeInOut" 
            }}
          >
            <Image 
              src="/images/logo.png" 
              alt="ASHENRITUAL" 
              width={500} 
              height={500} 
              className="h-[250px] w-auto object-contain mt-16"
              unoptimized
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
