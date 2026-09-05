/**
 * @fileoverview ASHENRITUAL Architecture
 * @module UniversalProfileForm.tsx
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, Loader2, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toast } from 'sonner';

interface UserProfile {
  id?: string;
  username?: string;
  displayName?: string;
  bio?: string;
  country?: string;
  city?: string;
  avatar?: string;
  banner?: string;
  lastUsernameChange?: string;
  [key: string]: unknown;
}

export function UniversalProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    country: '',
    city: '',
  });
  const [username, setUsername] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.get<UserProfile>('/users/me');
      setProfile(data);
      setFormData({
        displayName: data.displayName || '',
        bio: data.bio || '',
        country: data.country || '',
        city: data.city || '',
      });
      setUsername(data.username || '');
    } catch (_err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/me', formData);
      toast.success('Profile updated');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUsername = async () => {
    if (!username) return;
    setUsernameSaving(true);
    try {
      await api.put('/users/username', { username });
      toast.success('Username updated successfully');
      fetchProfile(); // refresh to update lastUsernameChange
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Username update failed');
    } finally {
      setUsernameSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'avatar') setUploadingAvatar(true);
    else setUploadingBanner(true);

    try {
      // 1. Upload to Cloudinary
      const url = await uploadToCloudinary(file, type === 'avatar' ? 'avatars' : 'banners');
      
      // 2. Save URL to profile
      await api.put('/users/me', { [type]: url });
      
      // 3. Update local state
      setProfile((prev: UserProfile | null) => (prev ? { ...prev, [type]: url } : null));
      toast.success(`${type === 'avatar' ? 'Avatar' : 'Banner'} updated`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      if (type === 'avatar') setUploadingAvatar(false);
      else setUploadingBanner(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-white/40"><Loader2 className="w-5 h-5 mx-auto animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Visuals (Banner & Avatar) */}
      <div className="relative group">
        <div className="h-32 w-full bg-[#1A1A1A] rounded-xl overflow-hidden relative border border-white/5">
          {profile?.banner ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={profile.banner} alt="Banner" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#121212] to-[#202020]" />
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => bannerInputRef.current?.click()} className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-xs font-semibold text-white flex items-center gap-2 hover:bg-black/80 transition-colors">
              {uploadingBanner ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              Change Banner
            </button>
            <input type="file" accept="image/*" className="hidden" ref={bannerInputRef} onChange={e => handleImageUpload(e, 'banner')} />
          </div>
        </div>

        <div className="absolute -bottom-6 left-6 group/avatar">
          <div className="w-16 h-16 rounded-full border-2 border-[#0a0a0a] bg-[#1A1A1A] overflow-hidden relative shadow-xl">
            {profile?.avatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover group-hover/avatar:opacity-40 transition-opacity" />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src="/images/default-avatar.png" alt="Avatar" className="w-full h-full object-cover scale-[1.15] translate-y-3 group-hover/avatar:opacity-40 transition-opacity bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A]" />
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer bg-black/40" onClick={() => avatarInputRef.current?.click()}>
              {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
            </div>
            <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={e => handleImageUpload(e, 'avatar')} />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 space-y-6">
        {/* Username */}
        <div className="space-y-2">
          <label className="text-[10px] font-heading uppercase tracking-[0.1em] text-white/50">Username (Unique ID)</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase())}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="username"
              />
            </div>
            <button
              onClick={handleSaveUsername}
              disabled={username === profile?.username || usernameSaving}
              className="px-4 py-2.5 bg-white text-black rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {usernameSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Claim'}
            </button>
          </div>
          {profile?.lastUsernameChange && (
            <p className="text-[10px] text-white/30">Last changed: {new Date(profile.lastUsernameChange).toLocaleDateString()}</p>
          )}
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-heading uppercase tracking-[0.1em] text-white/50">Display Name</label>
            <input
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="Your public name"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-heading uppercase tracking-[0.1em] text-white/50">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
              placeholder="A brief aesthetic statement..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-heading uppercase tracking-[0.1em] text-white/50">City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="Tokyo"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-heading uppercase tracking-[0.1em] text-white/50">Country</label>
              <input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="Japan"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 mt-4 border border-white/20 rounded-lg text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/5 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Save Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
}
