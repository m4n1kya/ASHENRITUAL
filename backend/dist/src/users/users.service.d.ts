import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        refreshToken: string | null;
        emailVerified: boolean;
        verificationToken: string | null;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        refreshToken: string | null;
        emailVerified: boolean;
        verificationToken: string | null;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        refreshToken: string | null;
        emailVerified: boolean;
        verificationToken: string | null;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
    } | null>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        refreshToken: string | null;
        emailVerified: boolean;
        verificationToken: string | null;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
    }>;
}
