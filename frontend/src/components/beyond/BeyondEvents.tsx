'use client';

export function BeyondEvents() {
  return (
    <section className="w-full h-screen relative bg-[#0E0E0E] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/images/beyond/beautiful-belarus-person-city.jpg" 
          alt="Event Exhibition"
          className="w-full h-full object-cover opacity-20 grayscale"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-[#0E0E0E]" />
      </div>

      <div className="relative z-10 text-center px-6">
        <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-6 block">Physical Manifestation</span>
        <h2 className="font-heading text-4xl md:text-7xl font-medium text-[#FDFCFB] tracking-wide mb-8">Structural Integrity</h2>
        <p className="font-heading text-xs uppercase tracking-[0.2em] text-[#8D8D8D]">Paris / London / Tokyo — Coming 2027</p>
      </div>
    </section>
  );
}
