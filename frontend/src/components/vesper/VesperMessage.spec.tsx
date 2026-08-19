import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { VesperMessageComponent } from './VesperMessage';
import type { VesperMessage } from '@/store/vesper.store';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock react-markdown to just render content as plain text in tests
jest.mock('react-markdown', () => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MockReactMarkdown = React.forwardRef<HTMLElement, any>(({ children, className }, ref) => {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <div data-testid="markdown" className={className} ref={ref as any}>
        {children}
      </div>
    );
  });
  MockReactMarkdown.displayName = 'ReactMarkdown';
  return MockReactMarkdown;
});

// Mock child components
jest.mock('./VesperRitualCard', () => ({
  VesperRitualCard: () => <div data-testid="ritual-card" />,
}));
jest.mock('./VesperActionNav', () => ({
  VesperActionNav: () => <div data-testid="action-nav" />,
}));

const userMessage: VesperMessage = {
  id: '1',
  role: 'user',
  content: 'What should I wear tonight?',
};

const modelMessage: VesperMessage = {
  id: '2',
  role: 'model',
  content: 'I recommend a dark, minimal ensemble.',
};

describe('VesperMessageComponent', () => {
  it('shows "You" label for user messages', () => {
    render(<VesperMessageComponent message={userMessage} />);
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('shows "Vesper" label for model messages', () => {
    render(<VesperMessageComponent message={modelMessage} />);
    expect(screen.getByText('Vesper')).toBeInTheDocument();
  });

  it('renders the user message content', () => {
    render(<VesperMessageComponent message={userMessage} />);
    expect(screen.getByText('What should I wear tonight?')).toBeInTheDocument();
  });

  it('renders the model message content via ReactMarkdown', () => {
    render(<VesperMessageComponent message={modelMessage} />);
    expect(screen.getByText('I recommend a dark, minimal ensemble.')).toBeInTheDocument();
  });

  it('renders VesperRitualCard when model message has recommendations', () => {
    const msgWithRecs: VesperMessage = {
      ...modelMessage,
      recommendations: {
        type: 'products',
        products: [{ id: 'p1', reason: 'Good match', confidence: 0.9 }],
      },
    };
    render(<VesperMessageComponent message={msgWithRecs} />);
    expect(screen.getByTestId('ritual-card')).toBeInTheDocument();
  });

  it('does NOT render VesperRitualCard for user messages with recommendations', () => {
    const userWithRecs: VesperMessage = {
      ...userMessage,
      recommendations: {
        type: 'products',
        products: [{ id: 'p1', reason: 'Good', confidence: 0.9 }],
      },
    };
    render(<VesperMessageComponent message={userWithRecs} />);
    expect(screen.queryByTestId('ritual-card')).not.toBeInTheDocument();
  });

  it('renders VesperActionNav when model message has actions', () => {
    const msgWithActions: VesperMessage = {
      ...modelMessage,
      actions: [{ label: 'Shop Now', type: 'route', target: '/shop' }],
    };
    render(<VesperMessageComponent message={msgWithActions} />);
    expect(screen.getByTestId('action-nav')).toBeInTheDocument();
  });

  it('does not render content block when content is empty', () => {
    const emptyMsg: VesperMessage = { id: '3', role: 'model', content: '', isStreaming: true };
    render(<VesperMessageComponent message={emptyMsg} />);
    // The prose content div should not be in the DOM when content is empty string
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });
});
