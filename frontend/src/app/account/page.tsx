'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { LogOut, MapPin, Plus, Trash2, Package, Sun, Moon } from 'lucide-react';
import { WebIcon } from '@/components/ui/WebIcon';
import { PageTransition } from '@/components/ui/PageTransition';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

interface Address {
  id: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ street: '', city: '', zip: '', country: '' });
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { token, user, logout, _hasHydrated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Wait until the persisted store has rehydrated from localStorage
    if (!_hasHydrated) return;
    if (!token) { router.push('/login?redirect=/account'); return; }
    api.get<Address[]>('/addresses', { headers: { Authorization: `Bearer ${token}` } })
      .then(setAddresses)
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  }, [token, router, _hasHydrated]);

  function handleLogout() {
    logout();
    toast.success('Signed out.');
    router.push('/');
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const addr = await api.post<Address>('/addresses', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses((prev) => [...prev, addr]);
      setForm({ street: '', city: '', zip: '', country: '' });
      setShowAddForm(false);
      toast.success('Address added.');
    } catch {
      toast.error('Could not save address.');
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveAddress(id: string) {
    if (!token) return;
    try {
      await api.delete(`/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success('Address removed.');
    } catch {
      toast.error('Could not remove address.');
    }
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-16 relative">
        
        {/* ── Background Lantern & Particles ── */}
        {mounted && (
          <div className="pointer-events-none fixed left-[-15vw] top-0 h-screen w-[80vw] min-w-[800px] z-0 opacity-60">
            <Image
              src="/images/lantern.png"
              alt=""
              fill
              className="object-contain object-left opacity-60"
              unoptimized
            />
            
            {/* Glowing Ash Particles around the lantern */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              {[...Array(20)].map((_, i) => {
                const size = Math.random() * 4 + 1.5;
                const startX = (Math.random() - 0.5) * 300;
                const startY = (Math.random() - 0.5) * 400 + 100;
                
                return (
                  <motion.div
                    key={`ash-${i}`}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: size, 
                      height: size,
                      boxShadow: '0 0 8px 2px rgba(200, 200, 200, 0.6)',
                      filter: 'blur(0.5px)',
                    }}
                    animate={{
                      opacity: [0, Math.random() * 0.7 + 0.3, 0],
                      y: [startY, startY - (Math.random() * 200 + 100)],
                      x: [startX, startX + (Math.random() * 50 - 25)],
                      scale: [0, 1.5, 0.5],
                    }}
                    transition={{
                      duration: Math.random() * 2 + 3,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: Math.random() * 2.5
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className="relative z-10 mx-auto max-w-screen-lg px-6 py-12 lg:px-8">
          {/* Profile Header */}
          <div className="mb-12 flex flex-col gap-6 border-b border-border pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Identity</p>
              <h1 className="mt-2 font-heading text-4xl uppercase tracking-tight text-foreground lg:text-6xl">
                Your Profile
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-border px-6 py-2.5 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>

          {/* Quick Links */}
          <div className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { href: '/archive', icon: Package, label: 'Order Archive', desc: 'View past orders' },
              { href: '/saved-rituals', icon: WebIcon, label: 'Saved Rituals', desc: 'Your saved pieces' },
              { href: '/vesper', icon: () => <span className="font-premium text-xs">O</span>, label: 'VESPER', desc: 'Consult wardrobe intelligence' },
            ].map(({ href, icon: Icon, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-4 border border-border bg-card p-5 transition-colors hover:border-foreground/30"
              >
                <div className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors group-hover:text-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Address Book */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl uppercase tracking-widest text-foreground">
                  Address Book
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">Manage your shipping addresses.</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddAddress}
                className="mb-6 space-y-3 border border-border bg-card p-6"
              >
                {[
                  { key: 'street', label: 'Street', placeholder: '123 Architrave Way' },
                  { key: 'city', label: 'City', placeholder: 'Mumbai' },
                  { key: 'zip', label: 'Postal Code', placeholder: '400001' },
                  { key: 'country', label: 'Country', placeholder: 'India' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
                      {label}
                    </label>
                    <input
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      required
                      className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none"
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-foreground px-6 py-2.5 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Address'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="border border-border px-6 py-2.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}

            {/* Address List */}
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <div className="border border-dashed border-border py-12 text-center">
                <MapPin className="mx-auto h-6 w-6 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No addresses saved yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="flex items-center justify-between border border-border bg-card p-5">
                    <div>
                      <p className="text-sm text-foreground">{addr.street}</p>
                      <p className="text-xs text-muted-foreground">
                        {addr.city}, {addr.zip}, {addr.country}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveAddress(addr.id)}
                      className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Remove address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Settings ────────────────────────────────────────────────────── */}
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="mb-6 font-heading text-2xl uppercase tracking-widest text-foreground">
              Settings
            </h2>

            {/* Appearance Toggle */}
            <div className="flex items-center justify-between border border-border bg-card px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground">
                  {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Appearance</p>
                  <p className="text-xs text-muted-foreground">
                    {theme === 'dark' ? 'Dark mode is active' : 'Lapis mode is active'}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                id="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={cn(
                  'relative h-7 w-14 border transition-colors duration-500',
                  theme === 'light'
                    ? 'border-[#1A1A1A]/20 bg-[#1A1A1A]'
                    : 'border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)]'
                )}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className={cn(
                    'absolute top-1 h-5 w-5',
                    theme === 'light' ? 'left-8 bg-white' : 'left-1 bg-[#F2F2F2]'
                  )}
                />
              </button>
            </div>
          </section>
        </div>
      </main>
    </PageTransition>
  );
}


