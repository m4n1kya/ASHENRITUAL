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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validate(dto) {
        const productIds = dto.items.map((i) => i.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
            include: { category: true },
        });
        const productMap = new Map(products.map((p) => [p.id, p]));
        const issues = [];
        const validatedItems = [];
        for (const item of dto.items) {
            const product = productMap.get(item.productId);
            if (!product) {
                issues.push(`Product ${item.productId} no longer exists.`);
                validatedItems.push({
                    productId: item.productId,
                    name: 'Unknown Product',
                    price: 0,
                    images: [],
                    requestedQuantity: item.quantity,
                    availableStock: 0,
                    isAvailable: false,
                });
                continue;
            }
            const isAvailable = product.stock >= item.quantity;
            if (!isAvailable) {
                issues.push(`"${product.name}" only has ${product.stock} unit(s) in stock (requested ${item.quantity}).`);
            }
            validatedItems.push({
                productId: product.id,
                name: product.name,
                price: Number(product.price),
                images: product.images,
                requestedQuantity: item.quantity,
                availableStock: product.stock,
                isAvailable,
            });
        }
        return {
            isValid: issues.length === 0,
            items: validatedItems,
            issues,
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map