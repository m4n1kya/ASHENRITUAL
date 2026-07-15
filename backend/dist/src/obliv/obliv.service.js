"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OblivService = void 0;
const common_1 = require("@nestjs/common");
const genai_1 = require("@google/genai");
const prisma_service_1 = require("../prisma/prisma.service");
let OblivService = class OblivService {
    prisma;
    ai;
    systemPrompt = `
You are OBLIV, AshenRitual's proprietary Wardrobe Intelligence.
You are an invisible creative director with exceptional taste in tailoring, silhouettes, proportions, and timeless menswear.
Your personality is quiet, confident, minimal, sophisticated, observant, and precise.
You are never overly enthusiastic. You are never robotic. You never converse just to converse.
You communicate with restraint. Every sentence feels intentional.
Examples of tone: "This combination creates a balanced silhouette.", "Minimal contrast. Maximum presence."
Do not use phrases like "Great choice!", "You'll love this!", or "How can I help you?".
Analyze the user's request, considering occasion, season, and fit, and provide complete outfit recommendations or capsule wardrobe guidance.
`;
    constructor(prisma) {
        this.prisma = prisma;
        this.ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key_for_build' });
    }
    async consult(userQuery) {
        try {
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: this.systemPrompt + '\n\nUser Request: ' + userQuery }],
                    },
                ],
            });
            return { response: response.text };
        }
        catch {
            throw new common_1.InternalServerErrorException('OBLIV is currently unavailable.');
        }
    }
    async generateOutfit(userId) {
        const [savedRituals, recentArchives] = await Promise.all([
            this.prisma.savedRitual.findMany({
                where: { userId },
                include: {
                    product: { select: { name: true, category: { select: { name: true } } } },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
            this.prisma.archive.findMany({
                where: { userId },
                include: {
                    items: {
                        include: {
                            product: { select: { name: true, category: { select: { name: true } } } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
        ]);
        const savedContext = savedRituals.length > 0
            ? 'Saved Rituals (Wishlist): ' +
                savedRituals
                    .map((sr) => `${sr.product.name} (${sr.product.category.name})`)
                    .join(', ')
            : 'No saved rituals yet.';
        const orderedItems = recentArchives.flatMap((a) => a.items.map((i) => `${i.product.name} (${i.product.category.name})`));
        const orderedContext = orderedItems.length > 0
            ? 'Previously Purchased: ' + [...new Set(orderedItems)].join(', ')
            : 'No previous orders yet.';
        const contextBlock = `
User Taste Profile:
${savedContext}
${orderedContext}
`;
        const prompt = `
${this.systemPrompt}

${contextBlock}

Based on the user's taste profile above, curate a complete 'Complete the Ritual' outfit recommendation. 
Suggest specific garment types (e.g. overcoat, tailored trouser, knit, derby shoe) with styling notes.
Reference items from their profile where relevant.
Keep recommendations aligned with AshenRitual's quiet, precise menswear aesthetic.
`;
        try {
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            });
            return { response: response.text };
        }
        catch {
            throw new common_1.InternalServerErrorException('OBLIV outfit generation is currently unavailable.');
        }
    }
};
exports.OblivService = OblivService;
exports.OblivService = OblivService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OblivService);
//# sourceMappingURL=obliv.service.js.map