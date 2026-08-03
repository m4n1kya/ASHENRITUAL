'use client';

export function BeyondFilms() {
  return (
    <section className="w-full py-32 bg-[#0E0E0E]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        <div className="flex justify-between items-end mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-medium text-[#FDFCFB]">Cinematic Universe</h2>
          <span className="font-heading text-[10px] uppercase tracking-[0.2em] text-[#8D8D8D]">02 / Motion</span>
        </div>

        <div className="relative w-full aspect-video bg-[#0A0A0A] overflow-hidden group cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/beyond/medium-shot-young-man-posing-outdoors.jpg" 
            alt="Film Thumbnail"
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 grayscale"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-[rgba(255,255,255,0.2)] flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-[#FDFCFB] border-b-[8px] border-b-transparent ml-1" />
            </div>
          </div>
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
            <h3 className="font-heading text-2xl md:text-4xl text-[#FDFCFB]">The Discipline of Restraint</h3>
            <p className="font-heading text-[10px] uppercase tracking-[0.2em] text-[#8D8D8D] mt-2">Director: Marcus Chen</p>
          </div>
        </div>
      </div>
    </section>
  );
}
