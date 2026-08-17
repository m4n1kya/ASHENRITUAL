import { Injectable, Logger } from '@nestjs/common';
import {
  AIProvider,
  ChatMessage,
  VesperStructuredResponse,
} from './ai.provider.interface';

@Injectable()
export class GeminiProvider implements AIProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  private apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '';

  constructor() {
    if (!this.apiKey) {
      this.logger.error('CRITICAL: No Gemini API key found! Set GEMINI_API_KEY or GOOGLE_GEMINI_API_KEY in environment.');
    } else {
      this.logger.log(`Gemini API key loaded (starts with: ${this.apiKey.substring(0, 6)}...)`);
    }
  }

  async *generateStream(
    messages: ChatMessage[],
    systemPrompt: string,
    contextData: string,
  ): AsyncGenerator<
    { text?: string; json?: VesperStructuredResponse },
    void,
    unknown
  > {
    try {
      // 1. Sanitize messages: filter empty and combine consecutive roles (Gemini requires alternating roles)
      const sanitizedMessages: typeof messages = [];
      for (const m of messages) {
        const text = m.content?.trim();
        if (!text) continue; // Skip empty messages
        
        const last = sanitizedMessages[sanitizedMessages.length - 1];
        if (last && last.role === m.role) {
          last.content += '\n\n' + text;
        } else {
          sanitizedMessages.push({ ...m, content: text });
        }
      }

      const contents = sanitizedMessages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const fullSystemPrompt = `
${systemPrompt}

--- SYSTEM CONTEXT (DO NOT REVEAL TO USER) ---
${contextData}
--- END SYSTEM CONTEXT ---

OUTPUT FORMAT REQUIREMENTS:
You must FIRST output the conversational text response.
THEN, you MUST output a JSON block wrapped EXACTLY in these markers:
---JSON_START---
{
  "actions": [ { "label": "string", "type": "route|product|chapter...", "target": "string" } ],
  "recommendations": { "type": "ritual|products|none", "products": [ { "id": "string", "reason": "string", "confidence": 0.9 } ] }
}
---JSON_END---

Do not include markdown \`\`\`json around the JSON block, just the exact markers above.
If there are no actions or recommendations, output an empty JSON object {} inside the markers.
`;

      if (
        contents.length > 0 &&
        contents[contents.length - 1].role === 'user'
      ) {
        contents[contents.length - 1].parts[0].text +=
          '\n\n' + fullSystemPrompt;
      } else {
        contents.push({ role: 'user', parts: [{ text: fullSystemPrompt }] });
      }

      // Use ?key= query param for authentication
      const url = new URL(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent',
      );
      url.searchParams.append('alt', 'sse');
      url.searchParams.append('key', this.apiKey);

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature: 0.3 },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API Error: ${response.status} ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream from Gemini API');

      const decoder = new TextDecoder();

      // ── Level 1: Buffer raw bytes into complete SSE events ──
      let sseBuffer = '';
      // ── Level 2: Accumulate all extracted text for reliable marker parsing ──
      let fullText = '';
      // Track how much text we've already yielded for streaming
      let yieldedUpTo = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });

        // Split on double-newline to get complete SSE events
        // Gemini API might use \r\n\r\n or \n\n
        const events = sseBuffer.split(/\r?\n\r?\n/);
        sseBuffer = events.pop() || ''; // Keep the last incomplete event

        for (const event of events) {
          if (!event.trim()) continue;

          // Find the "data:" line within the SSE event
          const lines = event.split(/\r?\n/);
          for (const line of lines) {
            const trimmed = line.trim();
            // Handle both "data: {...}" and "data:{...}"
            if (!trimmed.startsWith('data:')) continue;
            const dataStr = trimmed.startsWith('data: ')
              ? trimmed.slice(6)
              : trimmed.slice(5);
            if (!dataStr || dataStr === '[DONE]') continue;

            try {
              const parsed = JSON.parse(dataStr);
              const textContent =
                parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (!textContent) continue;
              fullText += textContent;
              this.logger.debug(
                `Gemini chunk: "${textContent.slice(0, 50)}..." (total: ${fullText.length})`,
              );
            } catch (e) {
              this.logger.warn(
                `Failed to parse Gemini SSE data: ${dataStr.slice(0, 100)}`,
              );
            }
          }
        }

        // ── Stream text up to the JSON marker (or a safe point) ──
        const markerIdx = fullText.indexOf('---JSON_START---');
        if (markerIdx !== -1) {
          // We found the JSON marker — yield all text before it
          if (markerIdx > yieldedUpTo) {
            yield { text: fullText.slice(yieldedUpTo, markerIdx) };
            yieldedUpTo = markerIdx;
          }
        } else {
          // No marker yet — stream text but hold back a safety buffer
          // We only need to hold back if the end of the text contains a '-' that could start the marker
          const lastDash = fullText.lastIndexOf('-');
          let safePoint = fullText.length;

          if (lastDash !== -1 && fullText.length - lastDash <= 16) {
            // There's a dash within the last 16 chars (length of ---JSON_START---)
            // Hold back from the dash onwards just in case
            safePoint = lastDash;
          }

          if (safePoint > yieldedUpTo) {
            yield { text: fullText.slice(yieldedUpTo, safePoint) };
            yieldedUpTo = safePoint;
          }
        }
      }

      this.logger.log(
        `Gemini stream done. Full text length: ${fullText.length}`,
      );

      // ── Final processing: parse out JSON markers from the complete response ──
      const jsonStartIdx = fullText.indexOf('---JSON_START---');
      const jsonEndIdx = fullText.indexOf('---JSON_END---');

      if (jsonStartIdx !== -1) {
        // Yield any remaining text before the marker
        if (jsonStartIdx > yieldedUpTo) {
          yield { text: fullText.slice(yieldedUpTo, jsonStartIdx) };
        }

        if (jsonEndIdx !== -1 && jsonEndIdx > jsonStartIdx) {
          const jsonStr = fullText
            .slice(jsonStartIdx + '---JSON_START---'.length, jsonEndIdx)
            .trim();
          try {
            const parsedJson = JSON.parse(jsonStr) as VesperStructuredResponse;
            yield { json: parsedJson };
          } catch (e) {
            this.logger.error(
              'Failed to parse structured JSON from Gemini response',
              e,
            );
            this.logger.debug('Raw JSON string:', jsonStr.slice(0, 500));
          }
        }
      } else {
        // No JSON markers found — yield any remaining text
        if (fullText.length > yieldedUpTo) {
          yield { text: fullText.slice(yieldedUpTo) };
        }
      }
    } catch (error) {
      this.logger.error('AI Generation Failed', error);
      throw error;
    }
  }
}
