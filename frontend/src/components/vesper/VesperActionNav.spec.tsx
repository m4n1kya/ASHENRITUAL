import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { VesperActionNav } from './VesperActionNav';
import type { VesperAction } from '@/store/vesper.store';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('VesperActionNav', () => {
  it('renders nothing when actions array is empty', () => {
    const { container } = render(<VesperActionNav actions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a route action with correct href', () => {
    const actions: VesperAction[] = [{ label: 'Explore Shop', type: 'route', target: '/shop' }];
    render(<VesperActionNav actions={actions} />);
    const link = screen.getByRole('link', { name: /Explore Shop/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/shop');
  });

  it('prepends /products/ for product type without leading slash', () => {
    const actions: VesperAction[] = [{ label: 'View Product', type: 'product', target: 'abc-123' }];
    render(<VesperActionNav actions={actions} />);
    const link = screen.getByRole('link', { name: /View Product/i });
    expect(link).toHaveAttribute('href', '/products/abc-123');
  });

  it('does not prepend /products/ when target already starts with /', () => {
    const actions: VesperAction[] = [{ label: 'Direct Link', type: 'product', target: '/products/full-path' }];
    render(<VesperActionNav actions={actions} />);
    const link = screen.getByRole('link', { name: /Direct Link/i });
    expect(link).toHaveAttribute('href', '/products/full-path');
  });

  it('prepends /chapters/ for chapter type', () => {
    const actions: VesperAction[] = [{ label: 'See Chapter', type: 'chapter', target: 'winter-2026' }];
    render(<VesperActionNav actions={actions} />);
    const link = screen.getByRole('link', { name: /See Chapter/i });
    expect(link).toHaveAttribute('href', '/chapters/winter-2026');
  });

  it('renders multiple actions', () => {
    const actions: VesperAction[] = [
      { label: 'Shop', type: 'route', target: '/shop' },
      { label: 'Sanctum', type: 'sanctum', target: '/sanctum' },
    ];
    render(<VesperActionNav actions={actions} />);
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });
});
