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
exports.VesperService = void 0;
const common_1 = require("@nestjs/common");
const genai_1 = require("@google/genai");
const prisma_service_1 = require("../prisma/prisma.service");
let VesperService = class VesperService {
    prisma;
    ai;
    systemPrompt = `
You are Vesper, AshenRitual's proprietary Wardrobe Intelligence.
You are an invisible creative director with exceptional taste in tailoring, silhouettes, proportions, and timeless menswear.
Your personality is quiet, confident, minimal, sophisticated, observant, and precise.
You communicate with restraint. Every sentence feels intentional.
You MUST output strictly in JSON format matching this structure:
{
  "title": "A short, evocative title (e.g. 'The Architect's Uniform')",
  "description": "A refined description of the recommended aesthetic (2-3 sentences)",
  "stylingNotes": "Precise styling directives, focusing on layering, textures, and proportions",
  "productIds": ["uuid-1", "uuid-2", "uuid-3"]
}
Only recommend productIds that are provided to you in the Product Catalog context.
`;
    constructor(prisma) {
        this.prisma = prisma;
        this.ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key_for_build' });
    }
    async consult(params) {
        try {
            const products = await this.prisma.product.findMany({
                select: { id: true, name: true, description: true, category: { select: { name: true } } },
            });
            const catalogContext = products
                .map(p => `ID: ${p.id} | Name: ${p.name} | Category: ${p.category.name} | Desc: ${p.description}`)
                .join('\n');
            const userContext = `
Context Parameters:
- Occasion: ${params.occasion}
- Weather: ${params.weather}
- Dress Code: ${params.dressCode}
- Palette: ${params.palette}
- Silhouette: ${params.silhouette}

Product Catalog (ONLY use IDs from this list):
${catalogContext}
`;
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: [
                    { role: 'user', parts: [{ text: this.systemPrompt + '\n\n' + userContext }] },
                ],
                config: {
                    responseMimeType: 'application/json',
                    temperature: 0.2,
                },
            });
            const jsonStr = response.text;
            if (!jsonStr)
                throw new Error('No response from Vesper');
            const parsed = JSON.parse(jsonStr);
            const recommendedProducts = await this.prisma.product.findMany({
                where: { id: { in: parsed.productIds } },
                include: { category: true }
            });
            return {
                id: 'vesper-' + Date.now(),
                title: parsed.title,
                description: parsed.description,
                stylingNotes: parsed.stylingNotes,
                products: recommendedProducts
            };
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Vesper Intelligence is currently unavailable.');
        }
    }
    async generateOutfit(userId) {
        return this.consult({ occasion: 'Everyday Minimal', weather: 'Transitional Autumn', dressCode: 'Smart Casual', palette: 'Earth & Stone', silhouette: 'Tailored & Sharp' });
    }
};
exports.VesperService = VesperService;
exports.VesperService = VesperService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VesperService);
//# sourceMappingURL=vesper.service.js.map