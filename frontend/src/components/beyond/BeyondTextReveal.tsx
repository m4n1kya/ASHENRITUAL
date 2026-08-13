'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function BeyondTextReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;
    
    const spans = textRef.current.querySelectorAll('span');

    gsap.to(spans, {
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        end: 'bottom 40%',
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="w-full py-32 md:py-48 px-6 md:px-20 max-w-screen-xl mx-auto flex flex-col items-center justify-center">
      <div className="max-w-4xl text-center">
        <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-12">The Definition</p>
        <p 
          ref={textRef}
          className="font-display italic text-3xl md:text-5xl lg:text-6xl leading-[1.2] md:leading-[1.1] text-[#FDFCFB]"
        >
          {"Beyond is where the brand becomes culture. Discover campaigns, creators, editorials, films, architecture, craftsmanship, reviews, and moments that shape the identity of ASHENRITUAL beyond fashion.".split(' ').map((word, i) => (
            <span key={i} className="opacity-10 transition-opacity duration-100 mr-2 md:mr-3 inline-block">
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
