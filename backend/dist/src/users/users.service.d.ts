import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): unknown;
    findByEmail(email: string): unknown;
    findById(id: string): unknown;
    update(id: string, data: any): unknown;
}
