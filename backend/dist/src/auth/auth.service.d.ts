import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private resend;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    generateTokens(user: any): unknown;
    login(user: any): unknown;
    register(createUserDto: CreateUserDto): unknown;
    refreshTokens(userId: string, refreshToken: string): unknown;
    logout(userId: string): any;
}
