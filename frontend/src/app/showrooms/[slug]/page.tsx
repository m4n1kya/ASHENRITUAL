import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, MapPin, Clock, Users, Grid } from 'lucide-react';
import { notFound } from 'next/navigation';

async function getShowroom(slug: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  try {
    const res = await fetch(`${API_URL}/showrooms/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const showroom = await getShowroom(slug);
  if (!showroom) return { title: 'Showroom Not Found' };
  
  return {
    title: `${showroom.name} — ASHENRITUAL Showrooms`,
    description: showroom.description || `Explore ${showroom.name} in ${showroom.city}.`,
  };
}

export default async function ShowroomProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const showroom = await getShowroom(slug);
  
  if (!showroom) {
    notFound();
  }

  const { name, city, state, description, history, specialization, knownFor, image, logo, verification, hours, creators, products } = showroom;

  return (
    <main className="w-full bg-background min-h-screen text-[#E8E8E8] selection:bg-[#FDFCFB] selection:text-[#0A0A0A] pb-32">
      
      {/* Navigation */}
      <div className="fixed top-0 left-0 w-full z-40 p-6 lg:p-12 pointer-events-none mt-16 lg:mt-0">
        <Link href="/showrooms" className="pointer-events-auto inline-flex items-center gap-3 bg-[#050505]/80 backdrop-blur-md border border-[rgba(255,255,255,0.05)] px-6 py-3 rounded-full hover:bg-[#111] transition-all group shadow-2xl">
          <ArrowLeft className="w-4 h-4 text-[#8D8D8D] group-hover:text-[#FDFCFB] group-hover:-translate-x-1 transition-transform" />
          <span className="font-heading uppercase text-[10px] tracking-[0.2em] font-semibold text-[#8D8D8D] group-hover:text-[#FDFCFB]">Showrooms Network</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="relative w-full h-[60vh] lg:h-[80vh] bg-[#050505] overflow-hidden">
        {image ? (
          <Image 
            src={image} 
            alt={name} 
            fill 
            className="object-cover opacity-60 mix-blend-luminosity grayscale"
            priority
            sizes="100vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#050505]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-24 z-10">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {logo && (
                  <div className="w-16 h-16 bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-full overflow-hidden relative shadow-2xl">
                    <Image src={logo} alt="Logo" fill className="object-cover" unoptimized />
                  </div>
                )}
                {verification && (
                  <div className="flex items-center gap-1.5 bg-[#FDFCFB] px-3 py-1.5">
                    <CheckCircle className="w-4 h-4 text-[#0A0A0A]" />
                    <span className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-[#0A0A0A]">Verified Partner</span>
                  </div>
                )}
                {hours && (
                  <div className="flex items-center gap-1.5 bg-[#050505]/80 backdrop-blur-md border border-[rgba(255,255,255,0.1)] px-3 py-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#8D8D8D]" />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#8D8D8D]">{hours}</span>
                  </div>
                )}
              </div>
              <h1 className="font-display italic text-5xl lg:text-8xl text-[#FDFCFB] mb-4">
                {name}
              </h1>
              <div className="flex items-center gap-2 text-[12px] font-mono tracking-widest text-[#8D8D8D] uppercase">
                <MapPin className="w-4 h-4" />
                {city}, {state}
              </div>
            </div>
            
            <div className="md:text-right flex flex-col md:items-end gap-3">
              <span className="inline-block border border-[rgba(255,255,255,0.1)] px-4 py-2 text-[11px] font-heading uppercase tracking-widest text-[#E8E8E8]">
                {knownFor || 'Curated Menswear'}
              </span>
              <p className="font-sans text-sm text-[#A8A8A8] max-w-sm leading-relaxed mt-2">
                {specialization}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-24 mt-24">
        
        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start mb-32 border-b border-[rgba(255,255,255,0.05)] pb-32">
          <div className="lg:col-span-4">
            <h2 className="font-heading text-[11px] uppercase tracking-[0.4em] text-[#8D8D8D] mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#8D8D8D]"></span>
              The Story
            </h2>
            <h3 className="font-display italic text-3xl text-[#FDFCFB]">
              Philosophy & Foundation
            </h3>
          </div>
          <div className="lg:col-span-8 flex flex-col gap-12">
            <p className="font-sans text-xl lg:text-2xl text-[#E8E8E8] leading-relaxed font-light">
              {description}
            </p>
            {history && (
              <div className="p-8 bg-[#050505] border border-[rgba(255,255,255,0.02)]">
                <h4 className="font-heading text-[9px] uppercase tracking-[0.3em] text-[#4A4A4A] mb-4">Heritage</h4>
                <p className="font-sans text-sm text-[#A8A8A8] leading-relaxed">
                  {history}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Resident Designers */}
        <section className="mb-32 border-b border-[rgba(255,255,255,0.05)] pb-32">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="font-heading text-[11px] uppercase tracking-[0.4em] text-[#8D8D8D] mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#8D8D8D]"></span>
                Designers
              </h2>
              <h3 className="font-display italic text-4xl text-[#FDFCFB]">Resident Creators</h3>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[#8D8D8D]">
              <Users className="w-5 h-5" />
              <span className="font-mono text-xs uppercase tracking-widest">{creators.length} Affiliates</span>
            </div>
          </div>

          {creators.length === 0 ? (
            <div className="w-full py-16 border border-[rgba(255,255,255,0.02)] bg-[#050505] text-center">
              <p className="font-heading text-xs uppercase tracking-widest text-[#4A4A4A]">No creators currently affiliated.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {creators.map((c: { id: string, user: { username: string, displayName: string | null, avatar: string | null } }) => (
                <Link key={c.id} href={`/u/@${c.user.username}`} className="group p-6 bg-[#050505] border border-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.15)] transition-colors">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-[#111] overflow-hidden relative mb-4">
                      {c.user.avatar ? (
                        <Image src={c.user.avatar} alt={c.user.displayName || c.user.username} fill className="object-cover" />
                      ) : (
                        <Image src="/images/default-avatar.png" alt="Creator Profile" fill className="object-cover" />
                      )}
                    </div>
                    <h4 className="font-heading text-sm uppercase tracking-wider text-[#E8E8E8] group-hover:text-[#FDFCFB]">{c.user.displayName || c.user.username}</h4>
                    <p className="font-mono text-[9px] text-[#4A4A4A] mt-2 uppercase tracking-widest">@{c.user.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Curated Products */}
        <section>
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="font-heading text-[11px] uppercase tracking-[0.4em] text-[#8D8D8D] mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#8D8D8D]"></span>
                Availability
              </h2>
              <h3 className="font-display italic text-4xl text-[#FDFCFB]">Exclusive Products</h3>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[#8D8D8D]">
              <Grid className="w-5 h-5" />
              <span className="font-mono text-xs uppercase tracking-widest">{products.length} Items</span>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="w-full py-24 border border-[rgba(255,255,255,0.02)] bg-[#050505] text-center">
              <p className="font-heading text-xs uppercase tracking-widest text-[#4A4A4A]">This showroom has not listed any physical inventory yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((p: { id: string, product: { name: string, price: number, images: string[] } }) => (
                <div key={p.id} className="group relative bg-[#050505] border border-[rgba(255,255,255,0.02)]">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0A0A]">
                    {p.product.images?.[0] && (
                      <Image 
                        src={p.product.images[0]} 
                        alt={p.product.name} 
                        fill 
                        className="object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h4 className="font-heading text-lg uppercase tracking-wider text-[#E8E8E8]">{p.product.name}</h4>
                    <p className="font-mono text-[10px] text-[#8D8D8D] mt-2">${p.product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
