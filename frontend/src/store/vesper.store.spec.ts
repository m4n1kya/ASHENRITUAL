/**
 * @fileoverview ASHENRITUAL Architecture
 * @module vesper.store.spec.ts
 */
import { act } from 'react';
import { useVesperStore } from './vesper.store';

// Reset store state before each test
beforeEach(() => {
  act(() => {
    useVesperStore.getState().clearAllSessions();
  });
});

describe('useVesperStore', () => {
  describe('addMessage', () => {
    it('adds a user message to the store and creates a session', () => {
      act(() => {
        useVesperStore.getState().addMessage({
          id: '1',
          role: 'user',
          content: 'What should I wear tonight?',
        });
      });

      const { messages, sessions } = useVesperStore.getState();
      expect(messages).toHaveLength(1);
      expect(messages[0].content).toBe('What should I wear tonight?');
      expect(messages[0].role).toBe('user');
      expect(sessions).toHaveLength(1);
      expect(sessions[0].title).toBe('What should I wear tonight?');
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

    it('accumulates multiple messages in order within the active session', () => {
      act(() => {
        useVesperStore.getState().addMessage({ id: '1', role: 'user', content: 'Hello' });
        useVesperStore.getState().addMessage({ id: '2', role: 'model', content: 'Hello back' });
      });

      const { messages, sessions } = useVesperStore.getState();
      expect(messages).toHaveLength(2);
      expect(messages[0].id).toBe('1');
      expect(messages[1].id).toBe('2');
      expect(sessions).toHaveLength(1);
      expect(sessions[0].messages).toHaveLength(2);
    });
  });

  describe('updateMessage', () => {
    it('updates the content of an existing message', () => {
      act(() => {
        useVesperStore.getState().addMessage({ id: '1', role: 'model', content: '', isStreaming: true });
        useVesperStore.getState().updateMessage('1', { content: 'Full response', isStreaming: false });
      });

      const { messages, sessions } = useVesperStore.getState();
      expect(messages[0].content).toBe('Full response');
      expect(messages[0].isStreaming).toBe(false);
      expect(sessions[0].messages[0].content).toBe('Full response');
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
    it('clears active messages from the store view', () => {
      act(() => {
        useVesperStore.getState().addMessage({ id: '1', role: 'user', content: 'Test' });
        useVesperStore.getState().addMessage({ id: '2', role: 'model', content: 'Response' });
        useVesperStore.getState().clearMessages();
      });

      expect(useVesperStore.getState().messages).toHaveLength(0);
      expect(useVesperStore.getState().currentSessionId).toBeNull();
    });
  });

  describe('chat history sessions', () => {
    it('supports creating and switching between multiple chat sessions', () => {
      // 1. First chat
      act(() => {
        useVesperStore.getState().addMessage({ id: '1', role: 'user', content: 'Chat one prompt' });
        useVesperStore.getState().addMessage({ id: '2', role: 'model', content: 'Chat one answer' });
      });

      const firstSessionId = useVesperStore.getState().currentSessionId!;
      expect(useVesperStore.getState().sessions).toHaveLength(1);

      // 2. Start new chat
      act(() => {
        useVesperStore.getState().createNewSession();
      });

      expect(useVesperStore.getState().messages).toHaveLength(0);

      // 3. Second chat
      act(() => {
        useVesperStore.getState().addMessage({ id: '3', role: 'user', content: 'Chat two prompt' });
      });

      expect(useVesperStore.getState().sessions).toHaveLength(2);
      expect(useVesperStore.getState().messages).toHaveLength(1);

      // 4. Switch back to first chat
      act(() => {
        useVesperStore.getState().selectSession(firstSessionId);
      });

      expect(useVesperStore.getState().currentSessionId).toBe(firstSessionId);
      expect(useVesperStore.getState().messages).toHaveLength(2);
      expect(useVesperStore.getState().messages[0].content).toBe('Chat one prompt');

      // 5. Delete a session
      act(() => {
        useVesperStore.getState().deleteSession(firstSessionId);
      });

      expect(useVesperStore.getState().sessions).toHaveLength(1);
    });
  });
});
