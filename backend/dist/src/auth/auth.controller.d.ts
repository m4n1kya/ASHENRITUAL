import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import type { Response, Request } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto, res: Response): unknown;
    login(createUserDto: CreateUserDto, res: Response): unknown;
    refresh(req: Request, res: Response): unknown;
    logout(req: Request, res: Response): unknown;
    private setRefreshTokenCookie;
}
