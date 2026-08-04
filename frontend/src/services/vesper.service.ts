import { API_URL, api } from '../lib/api';
import { useAuthStore } from '../store/auth.store';

interface ChatPayload {
  messages: { role: 'user' | 'model'; content: string }[];
  context: {
    currentPage?: string;
    currentProductId?: string;
    localTime?: string;
  };
}

import { VesperAction, VesperRecommendationData } from '../store/vesper.store';

interface VesperJsonResponse {
  actions?: VesperAction[];
  recommendations?: VesperRecommendationData;
}

export const vesperApi = {
  async chatStream(
    payload: ChatPayload,
    token: string,
    onChunk: (text: string) => void,
    onJson: (data: VesperJsonResponse) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Helper to do the actual fetch
      const doFetch = async (currentToken: string, isRetry = false) => {
        try {
          const response = await fetch(`${API_URL}/vesper/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify(payload)
          });

          if (response.status === 401 && !isRetry) {
            // Token likely expired. Trigger standard API refresh by making a dummy call.
            try {
              // api.ts handles the refresh logic automatically on 401
              await api.get('/auth/me'); 
              const newToken = useAuthStore.getState().token;
              if (newToken && newToken !== currentToken) {
                return doFetch(newToken, true); // Retry with new token
              }
            } catch {
              // Refresh failed, logout
              useAuthStore.getState().logout();
              return reject('Session expired. Please log in again.');
            }
          }

          if (!response.ok) {
            console.error(`Vesper API Error: ${response.status} ${response.statusText}`);
            return reject('API Error: ' + response.status);
          }
          if (!response.body) {
            return reject('No readable stream');
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunkText = decoder.decode(value, { stream: true });
            buffer += chunkText;
            
            // SSE events are separated by double newlines
            // Handle both \n\n and \r\n\r\n
            const parts = buffer.split(/\r?\n\r?\n/);
            buffer = parts.pop() || ''; // Keep incomplete part in buffer

            for (const part of parts) {
              if (!part.trim()) continue;
              
              // Each SSE event can have multiple fields like:
              // id: 1
              // data: {"type":"text","content":"..."}
              // We need to find the "data:" line within the event
              const lines = part.split(/\r?\n/);
              for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('data:')) {
                  const dataStr = trimmedLine.slice(5).trim();
                  if (!dataStr) continue;
                  
                  try {
                    const parsed = JSON.parse(dataStr);
                    if (parsed.type === 'text') {
                      onChunk(parsed.content);
                    } else if (parsed.type === 'json') {
                      onJson(parsed.content);
                    }
                  } catch (e) {
                    console.error('Error parsing SSE data:', e, 'Raw:', dataStr);
                  }
                }
              }
            }
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      };

      doFetch(token);
    });
  }
};
