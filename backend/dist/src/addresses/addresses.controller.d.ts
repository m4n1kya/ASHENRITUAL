import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
interface JwtUser {
    userId: string;
    email: string;
    role: string;
}
export declare class AddressesController {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    create(dto: CreateAddressDto, req: {
        user: JwtUser;
    }): Promise<{
        id: string;
        country: string;
        city: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        street: string;
        zip: string;
    }>;
    findAll(req: {
        user: JwtUser;
    }): Promise<{
        id: string;
        country: string;
        city: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        street: string;
        zip: string;
    }[]>;
    remove(id: string, req: {
        user: JwtUser;
    }): Promise<{
        message: string;
    }>;
}
export {};
