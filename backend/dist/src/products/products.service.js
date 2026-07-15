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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        if (query) {
            return this.prisma.product.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                    ],
                },
                include: { category: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        return this.prisma.product.findMany({
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true, reviews: { include: { user: { select: { id: true, email: true } } } } },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findByCategory(slug) {
        const category = await this.prisma.category.findUnique({ where: { slug } });
        if (!category) {
            throw new common_1.NotFoundException(`Category with slug "${slug}" not found`);
        }
        return this.prisma.product.findMany({
            where: { categoryId: category.id },
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findFeatured() {
        const topSaved = await this.prisma.savedRitual.groupBy({
            by: ['productId'],
            _count: { productId: true },
            orderBy: { _count: { productId: 'desc' } },
            take: 8,
        });
        const productIds = topSaved.map((s) => s.productId);
        if (productIds.length === 0) {
            return this.prisma.product.findMany({
                take: 8,
                include: { category: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        return this.prisma.product.findMany({
            where: { id: { in: productIds } },
            include: { category: true },
        });
    }
    async findNewArrivals() {
        return this.prisma.product.findMany({
            take: 8,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findBestSellers() {
        const topSold = await this.prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 8,
        });
        const productIds = topSold.map((o) => o.productId);
        if (productIds.length === 0) {
            return this.prisma.product.findMany({
                take: 8,
                include: { category: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        return this.prisma.product.findMany({
            where: { id: { in: productIds } },
            include: { category: true },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map