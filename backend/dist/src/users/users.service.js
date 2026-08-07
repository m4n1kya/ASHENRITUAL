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
            const updatedUser = await this.prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    displayName: existingUser.displayName || profile.name,
                    avatar: existingUser.avatar || profile.picture,
                },
            });
            return updatedUser;
        }
        else {
            const newUser = await this.prisma.user.create({
                data: {
                    email: profile.email,
                    provider: 'GOOGLE',
                    providerId: profile.providerId,
                    displayName: profile.name,
                    avatar: profile.picture,
                    emailVerified: true,
                },
            });
            const { passwordHash: _, ...result } = newUser;
            return result;
        }
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
    async getUserProfile(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                creator: true,
                ownedBrands: true,
                ownedShowrooms: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        bookmarks: true,
                    }
                }
            }
        });
        if (!user)
            throw new common_1.ConflictException('User not found');
        const { passwordHash: _, refreshToken: __, ...safeUser } = user;
        return safeUser;
    }
    async updateUserProfile(id, updateData) {
        const { displayName, bio, country, state, city, avatar, banner } = updateData;
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...(displayName && { displayName }),
                ...(bio !== undefined && { bio }),
                ...(country !== undefined && { country }),
                ...(state !== undefined && { state }),
                ...(city !== undefined && { city }),
                ...(avatar && { avatar }),
                ...(banner && { banner }),
            },
        });
        const { passwordHash: _, refreshToken: __, ...safeUser } = user;
        return safeUser;
    }
    async isUsernameAvailable(username) {
        const reservedWords = ['admin', 'support', 'vesper', 'forge', 'showrooms', 'sanctum', 'api', 'help'];
        if (reservedWords.includes(username.toLowerCase())) {
            return false;
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { username },
        });
        return !existingUser;
    }
    async updateUsername(id, username) {
        const usernameRegex = /^[a-z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            throw new common_1.ConflictException('Username must be 3-20 characters long and contain only lowercase letters, numbers, and underscores.');
        }
        const isAvailable = await this.isUsernameAvailable(username);
        if (!isAvailable) {
            throw new common_1.ConflictException('Username is not available.');
        }
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.ConflictException('User not found');
        if (user.lastUsernameChange) {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            if (user.lastUsernameChange > thirtyDaysAgo) {
                throw new common_1.ConflictException('You can only change your username once every 30 days.');
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                username,
                lastUsernameChange: new Date(),
            },
        });
        const { passwordHash: _, refreshToken: __, ...safeUser } = updatedUser;
        return safeUser;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map