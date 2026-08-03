"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GeminiProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const common_1 = require("@nestjs/common");
let GeminiProvider = GeminiProvider_1 = class GeminiProvider {
    logger = new common_1.Logger(GeminiProvider_1.name);
    apiKey = process.env.GEMINI_API_KEY || '';
    async *generateStream(messages, systemPrompt, contextData) {
        try {
            const contents = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.content }]
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
            if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
                contents[contents.length - 1].parts[0].text += '\n\n' + fullSystemPrompt;
            }
            else {
                contents.push({ role: 'user', parts: [{ text: fullSystemPrompt }] });
            }
            const url = new URL('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:streamGenerateContent');
            url.searchParams.append('alt', 'sse');
            url.searchParams.append('key', this.apiKey);
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    generationConfig: { temperature: 0.3 }
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Gemini API Error: ${response.status} ${errorText}`);
            }
            const reader = response.body?.getReader();
            if (!reader)
                throw new Error('No readable stream from Gemini API');
            const decoder = new TextDecoder();
            let sseBuffer = '';
            let fullText = '';
            let yieldedUpTo = 0;
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                sseBuffer += decoder.decode(value, { stream: true });
                const events = sseBuffer.split(/\r?\n\r?\n/);
                sseBuffer = events.pop() || '';
                for (const event of events) {
                    if (!event.trim())
                        continue;
                    const lines = event.split(/\r?\n/);
                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith('data:'))
                            continue;
                        const dataStr = trimmed.startsWith('data: ') ? trimmed.slice(6) : trimmed.slice(5);
                        if (!dataStr || dataStr === '[DONE]')
                            continue;
                        try {
                            const parsed = JSON.parse(dataStr);
                            const textContent = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
                            if (!textContent)
                                continue;
                            fullText += textContent;
                            this.logger.debug(`Gemini chunk: "${textContent.slice(0, 50)}..." (total: ${fullText.length})`);
                        }
                        catch (e) {
                            this.logger.warn(`Failed to parse Gemini SSE data: ${dataStr.slice(0, 100)}`);
                        }
                    }
                }
                const markerIdx = fullText.indexOf('---JSON_START---');
                if (markerIdx !== -1) {
                    if (markerIdx > yieldedUpTo) {
                        yield { text: fullText.slice(yieldedUpTo, markerIdx) };
                        yieldedUpTo = markerIdx;
                    }
                }
                else {
                    const lastDash = fullText.lastIndexOf('-');
                    let safePoint = fullText.length;
                    if (lastDash !== -1 && fullText.length - lastDash <= 16) {
                        safePoint = lastDash;
                    }
                    if (safePoint > yieldedUpTo) {
                        yield { text: fullText.slice(yieldedUpTo, safePoint) };
                        yieldedUpTo = safePoint;
                    }
                }
            }
            this.logger.log(`Gemini stream done. Full text length: ${fullText.length}`);
            const jsonStartIdx = fullText.indexOf('---JSON_START---');
            const jsonEndIdx = fullText.indexOf('---JSON_END---');
            if (jsonStartIdx !== -1) {
                if (jsonStartIdx > yieldedUpTo) {
                    yield { text: fullText.slice(yieldedUpTo, jsonStartIdx) };
                }
                if (jsonEndIdx !== -1 && jsonEndIdx > jsonStartIdx) {
                    const jsonStr = fullText.slice(jsonStartIdx + '---JSON_START---'.length, jsonEndIdx).trim();
                    try {
                        const parsedJson = JSON.parse(jsonStr);
                        yield { json: parsedJson };
                    }
                    catch (e) {
                        this.logger.error('Failed to parse structured JSON from Gemini response', e);
                        this.logger.debug('Raw JSON string:', jsonStr.slice(0, 500));
                    }
                }
            }
            else {
                if (fullText.length > yieldedUpTo) {
                    yield { text: fullText.slice(yieldedUpTo) };
                }
            }
        }
        catch (error) {
            this.logger.error('AI Generation Failed', error);
            throw error;
        }
    }
};
exports.GeminiProvider = GeminiProvider;
exports.GeminiProvider = GeminiProvider = GeminiProvider_1 = __decorate([
    (0, common_1.Injectable)()
], GeminiProvider);
//# sourceMappingURL=gemini.provider.js.map