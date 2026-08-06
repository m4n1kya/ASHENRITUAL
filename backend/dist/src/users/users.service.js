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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            if (existingUser.provider !== 'LOCAL') {
                throw new common_1.ConflictException(`User registered via ${existingUser.provider}. Please sign in with ${existingUser.provider}.`);
            }
            throw new common_1.ConflictException('User with this email already exists');
        }
        const user = await this.prisma.user.create({
            data,
        });
        const { passwordHash: _, ...result } = user;
        return result;
    }
    async upsertOAuthUser(profile) {
        const existingUser = await this.findByEmail(profile.email);
        if (existingUser) {
            const user = await this.prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    provider: 'GOOGLE',
                    providerId: profile.providerId,
                    name: existingUser.name || profile.name,
                    avatar: existingUser.avatar || profile.picture,
                    emailVerified: true,
                },
            });
            const { passwordHash: _, ...result } = user;
            return result;
        }
        const user = await this.prisma.user.create({
            data: {
                email: profile.email,
                provider: 'GOOGLE',
                providerId: profile.providerId,
                name: profile.name,
                avatar: profile.picture,
                emailVerified: true,
            },
        });
        const { passwordHash: _, ...result } = user;
        return result;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    async update(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map