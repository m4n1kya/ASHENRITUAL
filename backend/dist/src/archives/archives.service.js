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
exports.ArchivesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
let ArchivesService = class ArchivesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const productIds = dto.items.map((i) => i.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });
        const productMap = new Map(products.map((p) => [p.id, p]));
        for (const item of dto.items) {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new common_1.BadRequestException(`Product ${item.productId} does not exist.`);
            }
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}.`);
            }
        }
        const total = dto.items.reduce((sum, item) => {
            const price = Number(productMap.get(item.productId).price);
            return sum + price * item.quantity;
        }, 0);
        const archive = await this.prisma.$transaction(async (tx) => {
            const newArchive = await tx.archive.create({
                data: {
                    userId,
                    total: new library_1.Decimal(total),
                    items: {
                        create: dto.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: productMap.get(item.productId).price,
                        })),
                    },
                },
                include: { items: { include: { product: true } } },
            });
            for (const item of dto.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }
            return newArchive;
        });
        return archive;
    }
    async findUserArchives(userId) {
        return this.prisma.archive.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: { select: { id: true, name: true, images: true, price: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const archive = await this.prisma.archive.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: { select: { id: true, name: true, images: true, price: true } },
                    },
                },
            },
        });
        if (!archive) {
            throw new common_1.NotFoundException(`Archive ${id} not found.`);
        }
        if (archive.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this archive.');
        }
        return archive;
    }
};
exports.ArchivesService = ArchivesService;
exports.ArchivesService = ArchivesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArchivesService);
//# sourceMappingURL=archives.service.js.map