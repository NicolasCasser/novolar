import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return the user when the user exists', async () => {
      const user = {
        id: '123',
        name: 'Admin',
        email: 'admin@example.com',
      };

      usersServiceMock.findById.mockResolvedValue(user);

      const result = await service.validateUser('123');

      expect(result).toEqual(user);
      expect(usersServiceMock.findById).toHaveBeenCalledWith('123');
    });

    it('should return null when the user does not exist', async () => {
      usersServiceMock.findById.mockResolvedValue(null);

      const result = await service.validateUser('invalid-id');

      expect(result).toBeNull();
      expect(usersServiceMock.findById).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const user = {
        id: '123',
        name: 'Admin',
        email: 'admin@example.com',
        password: 'hashed-password',
      };

      usersServiceMock.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const input = {
        email: 'admin@example.com',
        password: 'password',
      };

      const result = await service.login(input);

      expect(result).toEqual(user);

      expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(input.email);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        input.password,
        user.password,
      );
    });

    it('should throw when the user does not exist', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'unknown@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when the password is invalid', async () => {
      const user = {
        id: '123',
        name: 'Admin',
        email: 'admin@example.com',
        password: 'hashed-password',
      };

      usersServiceMock.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({
          email: 'admin@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrong-password',
        user.password,
      );

      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', () => {
      const user = {
        id: '123',
        name: 'Admin',
        email: 'admin@example.com',
        password: 'hashed-password',
        animals: [],
        deletedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jwtServiceMock.sign.mockReturnValue('access-token');

      const result = service.generateAccessToken(user);

      expect(result).toBe('access-token');

      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
    });
  });
});
