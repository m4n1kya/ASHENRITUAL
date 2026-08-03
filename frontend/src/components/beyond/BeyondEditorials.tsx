'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SLIDES = [
  {
    title: 'Autumn Winter / 24',
    subtitle: 'Campaign',
    image: '/images/beyond/beautiful-belarus-person-city.jpg',
  },
  {
    title: 'The Blueprint',
    subtitle: 'Behind The Seams',
    image: '/images/beyond/portrait-fashionable-boy-outdoors.jpg',
  },
  {
    title: 'Silhouettes',
    subtitle: 'Editorial',
    image: '/images/beyond/close-up-portrait-attractive-male-model-color-flash-light.jpg',
  },
];

export function BeyondEditorials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const sections = gsap.utils.toArray('.horizontal-panel');

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: 1 / (sections.length - 1),
          duration: { min: 0.2, max: 1 },
          delay: 0.1,
          ease: 'power1.inOut'
        },
        end: () => '+=' + containerRef.current?.offsetWidth
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]">
      <div 
        ref={containerRef} 
        className="absolute top-0 left-0 flex h-full w-[300vw]"
      >
        {SLIDES.map((slide, index) => (
          <div 
            key={index} 
            className="horizontal-panel relative w-screen h-full flex flex-col justify-center px-10 md:px-32 lg:px-48"
          >
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20 h-[70vh]">
              <div className="w-full md:w-3/5 h-[40vh] md:h-full relative overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover grayscale transition-transform duration-[2s] group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 transition-opacity duration-700 group-hover:opacity-0" />
              </div>
              
              <div className="w-full md:w-2/5 flex flex-col justify-center">
                <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-4">
                  {slide.subtitle}
                </span>
                <h3 className="font-heading text-4xl md:text-5xl lg:text-7xl font-medium tracking-wide text-[#FDFCFB] leading-tight">
                  {slide.title}
                </h3>
                <div className="mt-8 w-12 h-[1px] bg-[#4A4A4A]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
