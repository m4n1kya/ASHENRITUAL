import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
export declare class AddressesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateAddressDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        street: string;
        city: string;
        zip: string;
        country: string;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        street: string;
        city: string;
        zip: string;
        country: string;
    }[]>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
