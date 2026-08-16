import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    upsertOAuthUser: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without passwordHash if credentials are valid', async () => {
      const password = 'password123';
      const passwordHash = await bcrypt.hash(password, 10);
      const user = {
        id: '1',
        email: 'test@test.com',
        provider: 'LOCAL',
        passwordHash,
        refreshToken: 'refresh-token',
        role: 'USER',
      };
      mockUsersService.findByEmail.mockResolvedValue(user);

      const result = await service.validateUser('test@test.com', password);

      expect(result).toBeDefined();
      expect(result.passwordHash).toBeUndefined();
      expect(result.refreshToken).toBeUndefined();
      expect(result.email).toBe(user.email);
    });

    it('should throw UnauthorizedException if provider is not LOCAL', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        provider: 'GOOGLE',
        passwordHash: null,
      };
      mockUsersService.findByEmail.mockResolvedValue(user);

      await expect(
        service.validateUser('test@test.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return null if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('test@test.com', 'password123');

      expect(result).toBeNull();
    });

    it('should return null if password is wrong', async () => {
      const password = 'password123';
      const passwordHash = await bcrypt.hash(password, 10);
      const user = {
        id: '1',
        email: 'test@test.com',
        provider: 'LOCAL',
        passwordHash,
      };
      mockUsersService.findByEmail.mockResolvedValue(user);

      const result = await service.validateUser(
        'test@test.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('generateTokens', () => {
    it('should return accessToken and refreshToken', async () => {
      const user = { email: 'test@test.com', id: '1', role: 'USER' };
      const tokens = await service.generateTokens(user);

      expect(tokens.accessToken).toBe('mock-token');
      expect(tokens.refreshToken).toBe('mock-token');
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });
  });
});
