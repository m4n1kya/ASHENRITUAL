import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CheckCircle, PenTool, Layout, Box, Bookmark, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';

async function getConcept(slug: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  try {
    const res = await fetch(`${API_URL}/creators/concept/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const concept = await getConcept(slug);
  if (!concept) return { title: 'Concept Not Found' };
  
  return {
    title: `${concept.title} — ASHENRITUAL`,
    description: concept.description || `Explore ${concept.title} on ASHENRITUAL.`,
  };
}

export default async function ConceptDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = await getConcept(slug);
  
  if (!concept) {
    notFound();
  }

  const { title, description, coverImage, gallery, tags, materials, softwareUsed, creator, createdAt } = concept;
  const user = creator?.user;

  return (
    <main className="w-full bg-background min-h-screen text-[#E8E8E8] selection:bg-[#FDFCFB] selection:text-[#0A0A0A] pb-32">
      
      {/* Navigation */}
      <div className="fixed top-0 left-0 w-full z-40 p-6 lg:p-12 pointer-events-none flex justify-between items-start mt-16 lg:mt-0">
        <Link href={`/u/@${user?.username}`} className="pointer-events-auto flex items-center gap-3 bg-[#050505]/80 backdrop-blur-md border border-[rgba(255,255,255,0.05)] px-6 py-3 rounded-full hover:bg-[#111] transition-all group shadow-2xl">
          <ArrowLeft className="w-4 h-4 text-[#8D8D8D] group-hover:text-[#FDFCFB] group-hover:-translate-x-1 transition-transform" />
          <span className="font-heading uppercase text-[10px] tracking-[0.2em] font-semibold text-[#8D8D8D] group-hover:text-[#FDFCFB]">Back to Profile</span>
        </Link>
        <div className="pointer-events-auto flex flex-col gap-3">
          <button className="flex items-center justify-center w-12 h-12 bg-[#050505]/80 backdrop-blur-md border border-[rgba(255,255,255,0.05)] rounded-full hover:bg-[#111] transition-all shadow-2xl">
            <Bookmark className="w-4 h-4 text-[#FDFCFB]" />
          </button>
          <button className="flex items-center justify-center w-12 h-12 bg-[#050505]/80 backdrop-blur-md border border-[rgba(255,255,255,0.05)] rounded-full hover:bg-[#111] transition-all shadow-2xl">
            <Share2 className="w-4 h-4 text-[#FDFCFB]" />
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative w-full h-[70vh] lg:h-[85vh] bg-[#050505] overflow-hidden">
        <Image 
          src={coverImage} 
          alt={title} 
          fill 
          className="object-cover opacity-90"
          priority
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-100" />
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-8 lg:p-24 z-10 flex flex-col items-center text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#8D8D8D] mb-6">
            {tags?.[0] || 'Concept'}
          </p>
          <h1 className="font-display italic text-5xl lg:text-7xl xl:text-8xl text-[#FDFCFB] mb-8">
            {title}
          </h1>
          <p className="font-heading text-[11px] uppercase tracking-widest text-[#8D8D8D]">
            Published {new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Description */}
          <div className="lg:col-span-8">
            <p className="font-sans text-lg lg:text-xl text-[#E8E8E8] leading-relaxed font-light mb-12">
              {description}
            </p>

            {/* Additional Gallery if any */}
            {gallery && gallery.length > 0 && (
              <div className="flex flex-col gap-8 mt-16">
                {gallery.map((img: string, i: number) => (
                  <div key={i} className="relative w-full bg-[#050505] overflow-hidden border border-[rgba(255,255,255,0.02)]">
                    <Image src={img} alt={`${title} Gallery ${i + 1}`} width={1600} height={1200} className="w-full h-auto object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-12">
            
            {/* Designer Card */}
            <div className="bg-[#050505] border border-[rgba(255,255,255,0.05)] p-8 relative group">
              <Link href={`/u/@${user?.username}`} className="absolute inset-0 z-10" />
              <h3 className="font-heading text-[9px] uppercase tracking-[0.3em] text-[#4A4A4A] mb-6">Designed By</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#111] overflow-hidden relative">
                  {user?.avatar ? (
                    <Image src={user.avatar} alt={user.displayName || user.username} fill className="object-cover" />
                  ) : (
                    <Image src="/images/default-avatar.png" alt="Creator Profile" fill className="object-cover scale-[1.15] translate-y-3 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A]" />
                  )}
                </div>
                <div>
                  <h4 className="font-heading text-sm uppercase tracking-wider text-[#FDFCFB] flex items-center gap-2">
                    {user?.displayName || user?.username}
                    {creator?.verified && <CheckCircle className="w-3.5 h-3.5 text-[#FDFCFB]" />}
                  </h4>
                  <p className="font-mono text-[9px] text-[#8D8D8D] uppercase tracking-widest mt-1">@{user?.username}</p>
                </div>
              </div>
              <div className="flex items-center justify-between font-heading text-[10px] uppercase tracking-widest text-[#4A4A4A] group-hover:text-[#FDFCFB] transition-colors">
                View Profile
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Specifications */}
            <div className="flex flex-col gap-8">
              {materials && materials.length > 0 && (
                <div>
                  <h3 className="font-heading text-[9px] uppercase tracking-[0.3em] text-[#4A4A4A] mb-4 flex items-center gap-2">
                    <Box className="w-3.5 h-3.5" /> Materials
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((m: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-[#050505] border border-[rgba(255,255,255,0.05)] text-[#A8A8A8] text-[10px] uppercase tracking-widest font-mono">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {softwareUsed && softwareUsed.length > 0 && (
                <div>
                  <h3 className="font-heading text-[9px] uppercase tracking-[0.3em] text-[#4A4A4A] mb-4 flex items-center gap-2">
                    <Layout className="w-3.5 h-3.5" /> Software
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {softwareUsed.map((s: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-[#050505] border border-[rgba(255,255,255,0.05)] text-[#A8A8A8] text-[10px] uppercase tracking-widest font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tags && tags.length > 0 && (
                <div>
                  <h3 className="font-heading text-[9px] uppercase tracking-[0.3em] text-[#4A4A4A] mb-4 flex items-center gap-2">
                    <PenTool className="w-3.5 h-3.5" /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 text-[#8D8D8D] text-[10px] uppercase tracking-widest font-mono hover:text-[#FDFCFB] transition-colors cursor-pointer">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
