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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [revenueResult, totalOrders, totalUsers, totalProducts] = await Promise.all([
            this.prisma.archive.aggregate({ _sum: { total: true } }),
            this.prisma.archive.count(),
            this.prisma.user.count(),
            this.prisma.product.count(),
        ]);
        return {
            totalRevenue: Number(revenueResult._sum.total ?? 0),
            totalOrders,
            totalUsers,
            totalProducts,
        };
    }
    async createProduct(dto) {
        return this.prisma.product.create({
            data: {
                name: dto.name,
                description: dto.description,
                price: new library_1.Decimal(dto.price),
                categoryId: dto.categoryId,
                images: dto.images,
                stock: dto.stock,
            },
            include: { category: true },
        });
    }
    async updateProduct(id, dto) {
        return this.prisma.product.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.description && { description: dto.description }),
                ...(dto.price !== undefined && { price: new library_1.Decimal(dto.price) }),
                ...(dto.categoryId && { categoryId: dto.categoryId }),
                ...(dto.images && { images: dto.images }),
                ...(dto.stock !== undefined && { stock: dto.stock }),
            },
            include: { category: true },
        });
    }
    async deleteProduct(id) {
        await this.prisma.product.delete({ where: { id } });
        return { message: `Product ${id} deleted.` };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map