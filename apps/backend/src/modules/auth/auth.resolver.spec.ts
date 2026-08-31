import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthInputDTO } from './dto/auth.input.dto';
import { AuthDTO } from './dto/auth.dto';
import { User } from '../users/entities/user.entity';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  const authServiceMock = {
    login: jest.fn(),
    generateAccessToken: jest.fn(),
  };

  const responseMock = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  const contextMock = {
    res: responseMock,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const input: AuthInputDTO = {
        email: 'admin@example.com',
        password: 'password123',
      };

      const user = {
        id: '123',
        name: 'Admin',
        email: 'admin@example.com',
      };

      const authResponse: AuthDTO = {
        user,
      };

      authServiceMock.login.mockResolvedValue(user);
      authServiceMock.generateAccessToken.mockReturnValue('access-token');

      const result = await resolver.login(input, contextMock);

      expect(result).toEqual(authResponse);

      expect(authServiceMock.login).toHaveBeenCalledWith(input);
      expect(authServiceMock.login).toHaveBeenCalledTimes(1);

      expect(authServiceMock.generateAccessToken).toHaveBeenCalledWith(user);
      expect(authServiceMock.generateAccessToken).toHaveBeenCalledTimes(1);

      expect(responseMock.cookie).toHaveBeenCalledWith(
        'accessToken',
        'access-token',
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60,
        },
      );
    });

    it('should propagate authentication errors', async () => {
      const input: AuthInputDTO = {
        email: 'admin@example.com',
        password: 'wrong-password',
      };

      authServiceMock.login.mockRejectedValue(
        new UnauthorizedException('Invalid Credentials'),
      );

      await expect(
        resolver.login(input, contextMock),
      ).rejects.toThrow(UnauthorizedException);

      expect(authServiceMock.login).toHaveBeenCalledWith(input);
      expect(authServiceMock.login).toHaveBeenCalledTimes(1);

      expect(authServiceMock.generateAccessToken).not.toHaveBeenCalled();
      expect(responseMock.cookie).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear the access token cookie', () => {
      const result = resolver.logout(contextMock);

      expect(result).toBe(true);

      expect(responseMock.clearCookie).toHaveBeenCalledWith(
        'accessToken',
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        },
      );
    });
  });

  describe('me', () => {
    it('should return the current user', () => {
      const user = {
        id: '123',
        name: 'Admin',
        email: 'admin@example.com',
      } as User;

      const result = resolver.me(user);

      expect(result).toEqual(user);
    });
  });
});
