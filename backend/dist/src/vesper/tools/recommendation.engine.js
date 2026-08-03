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
exports.RecommendationEngine = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RecommendationEngine = class RecommendationEngine {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async retrieveContextData(lastUserQuery) {
        const query = lastUserQuery.toLowerCase();
        const keywords = ['black', 'white', 'grey', 'monochrome', 'oversized', 'suit', 'jacket', 't-shirt', 'shirt', 'formal', 'casual', 'winter', 'summer'];
        const matchedKeywords = keywords.filter(k => query.includes(k));
        const products = await this.prisma.product.findMany({
            where: matchedKeywords.length > 0 ? {
                OR: matchedKeywords.map(k => ({
                    OR: [
                        { name: { contains: k } },
                        { description: { contains: k } }
                    ]
                }))
            } : undefined,
            take: 20,
            include: { category: true }
        });
        const chapters = await this.prisma.chapter.findMany({
            take: 5,
            select: { name: true, description: true }
        });
        let context = '--- AVAILABLE INVENTORY SAMPLES ---\n';
        if (products.length > 0) {
            context += products.map(p => `Product ID: ${p.id} | Name: ${p.name} | Category: ${p.category.name} | Price: ${p.price} | Desc: ${p.description}`).join('\n');
        }
        else {
            context += 'No specific inventory matched the keywords. Rely on general stylistic advice or fallback items.\n';
        }
        context += '\n\n--- ACTIVE CHAPTERS (COLLECTIONS) ---\n';
        context += chapters.map(c => `Chapter: ${c.name} | Theme: ${c.description}`).join('\n');
        return context;
    }
};
exports.RecommendationEngine = RecommendationEngine;
exports.RecommendationEngine = RecommendationEngine = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RecommendationEngine);
//# sourceMappingURL=recommendation.engine.js.map