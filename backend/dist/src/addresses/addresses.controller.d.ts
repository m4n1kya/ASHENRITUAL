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
    }): unknown;
    findAll(req: {
        user: JwtUser;
    }): unknown;
    remove(id: string, req: {
        user: JwtUser;
    }): unknown;
}
export {};
