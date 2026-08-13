'use client';

import { motion } from 'framer-motion';

export function BeyondTextReveal() {
  const words = "Beyond is where the brand becomes culture. Discover campaigns, creators, editorials, films, architecture, craftsmanship, reviews, and moments that shape the identity of ASHENRITUAL beyond fashion.".split(' ');

  return (
    <section className="w-full py-32 md:py-48 px-6 md:px-20 max-w-screen-xl mx-auto flex flex-col items-center justify-center">
      <div className="max-w-4xl text-center">
        <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-12">The Definition</p>
        <motion.p 
          className="font-display italic text-3xl md:text-5xl lg:text-6xl leading-[1.2] md:leading-[1.1] text-[#FDFCFB]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
            hidden: {}
          }}
        >
          {words.map((word, i) => (
            <motion.span 
              key={i} 
              variants={{
                hidden: { opacity: 0.1 },
                visible: { opacity: 1, transition: { duration: 0.8 } }
              }}
              className="mr-2 md:mr-3 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </motion.p>
      </div>
    </section>
  );
}
