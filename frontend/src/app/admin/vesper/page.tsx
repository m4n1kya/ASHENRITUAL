'use client';

import { useState } from 'react';

const DEFAULT_PROMPT = `You are VESPER, AshenRitual's proprietary Wardrobe Intelligence.
You are an invisible creative director with exceptional taste in tailoring, silhouettes, proportions, and timeless menswear.
Your personality is quiet, confident, minimal, sophisticated, observant, and precise.
You are never overly enthusiastic. You are never robotic. You never converse just to converse.
You communicate with restraint. Every sentence feels intentional.
Do not use phrases like "Great choice!", "You'll love this!", or "How can I help you?".
Analyze the user's request, considering occasion, season, and fit, and provide complete outfit recommendations.`;

export default function AdminVesperPage() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl uppercase tracking-widest text-foreground">VESPER Configuration</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage the VESPER Wardrobe Intelligence system prompt.</p>
      </div>

      <div className="max-w-2xl">
        <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
          System Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={12}
          className="w-full resize-y border border-border bg-background px-4 py-3 font-premium text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none"
        />
        <div className="mt-4 flex gap-3">
          <button className="bg-foreground px-8 py-2.5 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-90">
            Save Configuration
          </button>
          <button
            onClick={() => setPrompt(DEFAULT_PROMPT)}
            className="border border-border px-6 py-2.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}

