/**
 * @fileoverview Unit Tests for ShopPageClient Resilient Loading
 * @module ShopPageClient.spec.tsx
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { ShopPageClient } from './ShopPageClient';
import { api } from '@/lib/api';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => '/shop',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
  }: {
    src: string;
    alt?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt || ''} />
  ),
}));

// Mock framer-motion with a generic Proxy to support all motion.* elements
jest.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get:
        (_, tag: string) =>
        ({
          children,
          whileInView: _w,
          viewport: _v,
          transition: _t,
          initial: _i,
          animate: _a,
          exit: _e,
          ...props
        }: any) =>
          React.createElement(tag, props, children),
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock API client
jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

describe('ShopPageClient Resilient Loading', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial products passed from server', () => {
    const mockProducts = [
      {
        id: 'test-1',
        name: 'Test Leather Jacket',
        description: 'Luxury test jacket',
        price: 15000,
        images: ['/images/clothes/Jackets/cmm25223_charcoal_xl.webp'],
        stock: 5,
        categoryId: 'cat-1',
        category: { id: 'cat-1', name: 'Outerwear', slug: 'outerwear' },
      },
    ];

    render(
      <ShopPageClient
        initialProducts={mockProducts}
        initialCategories={[{ id: 'cat-1', name: 'Outerwear', slug: 'outerwear' }]}
        initialTotal={1}
        initialTotalPages={1}
      />
    );

    expect(screen.getByText('Test Leather Jacket')).toBeInTheDocument();
    expect(screen.getByText('Outerwear')).toBeInTheDocument();
  });

  it('reliably falls back to archival catalog when initialProducts is empty and API fails', async () => {
    // Simulate backend being completely down or sleeping (rejects)
    (api.get as jest.Mock).mockRejectedValue(new Error('Network error: Backend down'));

    render(
      <ShopPageClient
        initialProducts={[]}
        initialCategories={[]}
        initialTotal={0}
        initialTotalPages={1}
      />
    );

    // Products must NOT be empty! It must load from archival fallback catalog
    await waitFor(() => {
      expect(screen.queryByText('NO PIECES FOUND')).not.toBeInTheDocument();
    });

    // Check that authentic pieces are rendered
    expect(screen.getByText('Charcoal Overcoat')).toBeInTheDocument();
  });

  it('displays category filter pills even if initialCategories was empty', async () => {
    render(
      <ShopPageClient
        initialProducts={[]}
        initialCategories={[]}
        initialTotal={0}
        initialTotalPages={1}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Outerwear')).toBeInTheDocument();
      expect(screen.getByText('Suits')).toBeInTheDocument();
      expect(screen.getByText('Shirts')).toBeInTheDocument();
    });
  });
});
