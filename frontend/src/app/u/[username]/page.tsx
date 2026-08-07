import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Share, Bookmark, Plus, Grid, Info, Users, ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { User } from '@/types';

async function getCreatorProfile(username: string): Promise<User | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  try {
    const res = await fetch(`${API_URL}/creators/${username}`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const profile = await getCreatorProfile(params.username);
  if (!profile) return { title: 'Creator Not Found' };
  
  return {
    title: `${profile.displayName || profile.username} — ASHENRITUAL`,
    description: profile.bio || `Explore the concepts and collections of ${profile.displayName || profile.username}.`,
  };
}

export default async function CreatorProfilePage({ params }: { params: { username: string } }) {
  const profile = await getCreatorProfile(params.username);
  
  if (!profile) {
    notFound();
  }

  const isVerified = profile.creatorProfile?.verified;
  const concepts = profile.creatorProfile?.concepts || [];
  
  // Extract unique showrooms from concepts if any, otherwise mock
  const showrooms = profile.creatorProfile?.showrooms || [];

  return (
    <main className="w-full bg-background min-h-screen text-[#E8E8E8] selection:bg-[#FDFCFB] selection:text-[#0A0A0A]">
      {/* Banner */}
      <div className="relative w-full h-[35vh] lg:h-[45vh] overflow-hidden bg-[#050505]">
        {profile.banner ? (
          <Image 
            src={profile.banner} 
            alt="Banner" 
            fill 
            className="object-cover opacity-70"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#050505]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12 pb-32">
        {/* Profile Header */}
        <div className="relative -mt-24 lg:-mt-32 mb-16 z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
          
          <div className="flex flex-col gap-6">
            <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-full border-4 border-background bg-[#111] overflow-hidden relative shadow-2xl">
              {profile.avatar ? (
                <Image src={profile.avatar} alt={profile.displayName || profile.username} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1A1A] to-[#0A0A0A]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-heading text-4xl lg:text-5xl uppercase tracking-wider text-[#FDFCFB]">
                  {profile.displayName || profile.username}
                </h1>
                {isVerified && (
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#FDFCFB]" fill="currentColor">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z" />
                  </svg>
                )}
              </div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#8D8D8D] flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> 
                {profile.location || 'Unknown Location'} 
                <span className="mx-2 opacity-30">|</span> 
                @{profile.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8 md:mt-24">
            <button className="flex items-center gap-2 bg-[#FDFCFB] text-[#0A0A0A] px-6 py-3 font-heading text-[10px] uppercase tracking-widest font-bold hover:bg-[#E8E8E8] transition-colors">
              <Plus className="w-3.5 h-3.5" /> Follow
            </button>
            <button className="flex items-center justify-center w-12 h-12 border border-[rgba(255,255,255,0.1)] text-[#FDFCFB] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-center w-12 h-12 border border-[rgba(255,255,255,0.1)] text-[#FDFCFB] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column (Sidebar) */}
          <div className="lg:col-span-3 flex flex-col gap-12">
            <section>
              <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#4A4A4A] mb-4 flex items-center gap-2">
                <Info className="w-3 h-3" /> Philosophy
              </h3>
              <p className="font-sans text-sm text-[#A8A8A8] leading-relaxed">
                {profile.bio || 'This designer prefers their work to speak for itself.'}
              </p>
            </section>

            <section>
              <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#4A4A4A] mb-4">Focus</h3>
              <div className="flex flex-wrap gap-2">
                {(profile.creatorProfile?.specialization ? profile.creatorProfile.specialization.split(',') : ['Design', 'Art']).map((spec, i) => (
                  <span key={i} className="px-3 py-1 bg-[#111] text-[#8D8D8D] text-[10px] uppercase tracking-widest font-mono">
                    {spec.trim()}
                  </span>
                ))}
              </div>
            </section>

            {showrooms.length > 0 && (
              <section>
                <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#4A4A4A] mb-4">Showrooms</h3>
                <div className="flex flex-col gap-3">
                  {showrooms.map((affiliation: any) => (
                    <Link key={affiliation.id} href={`/showrooms/${affiliation.showroom.slug}`} className="group flex items-center gap-3 p-3 bg-[#050505] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)] transition-colors">
                      <div className="w-8 h-8 bg-[#111] rounded-full overflow-hidden relative">
                        {affiliation.showroom.logo ? (
                          <Image src={affiliation.showroom.logo} alt={affiliation.showroom.name} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-[#222]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-heading text-xs uppercase tracking-wider text-[#E8E8E8] group-hover:text-[#FDFCFB]">{affiliation.showroom.name}</p>
                        <p className="font-mono text-[9px] text-[#4A4A4A]">{affiliation.showroom.city || 'Global'}</p>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#4A4A4A] group-hover:text-[#FDFCFB] transition-colors" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related Designers (Mocked for now as requested) */}
            <section>
              <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#4A4A4A] mb-4 flex items-center gap-2">
                <Users className="w-3 h-3" /> Related Designers
              </h3>
              <div className="flex flex-col gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 opacity-60 hover:opacity-100 cursor-not-allowed transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-[#111]" />
                    <div>
                      <p className="font-heading text-xs uppercase tracking-wider text-[#8D8D8D]">Designer {i}</p>
                      <p className="font-mono text-[9px] text-[#4A4A4A]">Similar Philosophy</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (Exhibition Gallery) */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-8 border-b border-[rgba(255,255,255,0.05)] pb-4">
              <h2 className="font-display italic text-3xl text-[#FDFCFB]">The Exhibition</h2>
              <div className="flex items-center gap-2 text-[#8D8D8D]">
                <Grid className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase tracking-widest">{concepts.length} Pieces</span>
              </div>
            </div>

            {concepts.length === 0 ? (
              <div className="w-full py-24 flex flex-col items-center justify-center border border-[rgba(255,255,255,0.02)] bg-[#050505]">
                <h3 className="font-heading text-lg uppercase tracking-widest text-[#4A4A4A] mb-2">Empty Gallery</h3>
                <p className="text-[#4A4A4A] text-xs max-w-sm text-center">This designer hasn't published any concepts yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {concepts.map((concept: Concept) => (
                  <Link key={concept.id} href={`/concepts/${concept.slug}`} className="group relative block overflow-hidden bg-[#050505] aspect-[3/4]">
                    <Image
                      src={concept.image}
                      alt={concept.title}
                      fill
                      className="object-cover grayscale opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 ease-[0.22,1,0.36,1]"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[0.22,1,0.36,1]">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#A8A8A8]">
                          {concept.tags?.[0] || 'Concept'}
                        </p>
                        <ArrowUpRight className="w-4 h-4 text-[#FDFCFB] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      <h3 className="font-heading text-2xl uppercase tracking-wider text-[#FDFCFB] mb-2">
                        {concept.title}
                      </h3>
                      <p className="font-sans text-xs text-[#8D8D8D] line-clamp-2">
                        {concept.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
