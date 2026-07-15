import { OblivService } from './obliv.service';
import { ConsultOblivDto } from './dto/consult-obliv.dto';
interface JwtUser {
    userId: string;
    email: string;
    role: string;
}
export declare class OblivController {
    private readonly oblivService;
    constructor(oblivService: OblivService);
    consult(dto: ConsultOblivDto): Promise<{
        response: string | undefined;
    }>;
    generateOutfit(req: {
        user: JwtUser;
    }): Promise<{
        response: string | undefined;
    }>;
}
export {};
