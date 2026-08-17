import { act } from 'react';
import { useVesperStore } from './vesper.store';

// Reset store state before each test
beforeEach(() => {
  act(() => {
    useVesperStore.getState().clearMessages();
  });
});

describe('useVesperStore', () => {
  describe('addMessage', () => {
    it('adds a user message to the store', () => {
      act(() => {
        useVesperStore.getState().addMessage({
          id: '1',
          role: 'user',
          content: 'What should I wear tonight?',
        });
      });

      const { messages } = useVesperStore.getState();
      expect(messages).toHaveLength(1);
      expect(messages[0].content).toBe('What should I wear tonight?');
      expect(messages[0].role).toBe('user');
    });

    it('adds a model message to the store', () => {
      act(() => {
        useVesperStore.getState().addMessage({
          id: '2',
          role: 'model',
          content: 'I recommend a minimal dark ensemble.',
          isStreaming: false,
        });
      });

      const { messages } = useVesperStore.getState();
      expect(messages[0].role).toBe('model');
    });

    it('accumulates multiple messages in order', () => {
      act(() => {
        useVesperStore.getState().addMessage({ id: '1', role: 'user', content: 'Hello' });
        useVesperStore.getState().addMessage({ id: '2', role: 'model', content: 'Hello back' });
      });

      const { messages } = useVesperStore.getState();
      expect(messages).toHaveLength(2);
      expect(messages[0].id).toBe('1');
      expect(messages[1].id).toBe('2');
    });
  });

  describe('updateMessage', () => {
    it('updates the content of an existing message', () => {
      act(() => {
        useVesperStore.getState().addMessage({ id: '1', role: 'model', content: '', isStreaming: true });
        useVesperStore.getState().updateMessage('1', { content: 'Full response', isStreaming: false });
      });

      const { messages } = useVesperStore.getState();
      expect(messages[0].content).toBe('Full response');
      expect(messages[0].isStreaming).toBe(false);
    });

    it('updates recommendations on a message', () => {
      act(() => {
        useVesperStore.getState().addMessage({ id: '1', role: 'model', content: 'Here are suggestions' });
        useVesperStore.getState().updateMessage('1', {
          recommendations: {
            type: 'products',
            products: [{ id: 'prod-1', reason: 'Great fit', confidence: 0.92 }],
          },
        });
      });

      const msg = useVesperStore.getState().messages[0];
      expect(msg.recommendations?.products).toHaveLength(1);
      expect(msg.recommendations?.products[0].id).toBe('prod-1');
    });

    it('does not affect other messages when updating one', () => {
      act(() => {
        useVesperStore.getState().addMessage({ id: '1', role: 'user', content: 'Unchanged' });
        useVesperStore.getState().addMessage({ id: '2', role: 'model', content: 'To update' });
        useVesperStore.getState().updateMessage('2', { content: 'Updated' });
      });

      const { messages } = useVesperStore.getState();
      expect(messages[0].content).toBe('Unchanged');
      expect(messages[1].content).toBe('Updated');
    });
  });

  describe('clearMessages', () => {
    it('clears all messages from the store', () => {
      act(() => {
        useVesperStore.getState().addMessage({ id: '1', role: 'user', content: 'Test' });
        useVesperStore.getState().addMessage({ id: '2', role: 'model', content: 'Response' });
        useVesperStore.getState().clearMessages();
      });

      expect(useVesperStore.getState().messages).toHaveLength(0);
    });
  });
});
