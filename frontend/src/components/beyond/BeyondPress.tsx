'use client';

const PRESS = [
  { publication: 'Vogue Hommes', quote: 'A masterclass in quiet luxury and structural integrity.', year: '2025' },
  { publication: 'GQ Architecture', quote: 'Bridging the gap between brutalist design and daily wear.', year: '2026' },
  { publication: 'The Business of Fashion', quote: 'Redefining the digital luxury landscape with AI precision.', year: '2026' },
];

export function BeyondPress() {
  return (
    <section className="w-full py-32 bg-[#0A0A0A]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        <h2 className="font-heading text-3xl md:text-5xl font-medium text-[#FDFCFB] mb-20 text-center">Press & Recognition</h2>
        
        <div className="flex flex-col">
          {PRESS.map((item, i) => (
            <div key={i} className="group flex flex-col md:flex-row justify-between items-start md:items-center py-10 border-b border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.2)] transition-colors duration-500">
              <div className="w-full md:w-1/4 mb-4 md:mb-0">
                <span className="font-heading text-sm md:text-lg uppercase tracking-[0.2em] text-[#FDFCFB]">{item.publication}</span>
              </div>
              <div className="w-full md:w-2/4">
                <p className="font-display italic text-lg md:text-xl text-[#8D8D8D] group-hover:text-[#FDFCFB] transition-colors duration-500">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
              <div className="w-full md:w-1/4 text-left md:text-right mt-4 md:mt-0">
                <span className="font-heading text-[10px] uppercase tracking-[0.2em] text-[#4A4A4A]">{item.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
