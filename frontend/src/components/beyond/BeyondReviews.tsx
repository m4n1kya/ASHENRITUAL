'use client';

export function BeyondReviews() {
  return (
    <section className="w-full py-32 bg-[#0E0E0E] text-center border-y border-[rgba(255,255,255,0.05)]">
      <div className="max-w-4xl mx-auto px-6">
        <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D] mb-12">Verified Voices</p>
        <p className="font-display italic text-2xl md:text-4xl leading-relaxed text-[#FDFCFB]">
          &ldquo;ASHENRITUAL does not sell clothing. It sells an architecture of self. The precision of the cut and the weight of the fabric demand a certain posture from the wearer.&rdquo;
        </p>
        <div className="mt-12 flex flex-col items-center">
          <span className="font-heading text-[12px] uppercase tracking-[0.2em] text-[#E8E8E8]">Archive Magazine</span>
          <span className="font-heading text-[9px] uppercase tracking-[0.1em] text-[#4A4A4A] mt-2">Editorial Review</span>
        </div>
      </div>
    </section>
  );
}
