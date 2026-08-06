import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
export declare class AddressesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateAddressDto): unknown;
    findAll(userId: string): unknown;
    remove(id: string, userId: string): unknown;
}
