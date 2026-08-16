
import type { Metadata } from 'next';
import { SanctumClient } from './SanctumClient';

export const metadata: Metadata = {
  title: 'SANCTUM — ASHENRITUAL',
  description: 'The private creator ecosystem and architectural library for future collections.',
};

export default function SanctumPage() {
  return (
    <main className="min-h-screen bg-background texture-grain">
      <SanctumClient />
    </main>
  );
}
