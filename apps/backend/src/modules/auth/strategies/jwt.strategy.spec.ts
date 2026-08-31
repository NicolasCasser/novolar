import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { JwtStrategy } from './jwt.strategy';
import { AuthService } from '../auth.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const authServiceMock = {
    validateUser: jest.fn(),
  };

  const configServiceMock = {
    getOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    configServiceMock.getOrThrow.mockReturnValue('test-secret');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('should return the user when the user exists', async () => {
      const user = {
        id: '123',
        name: 'Admin',
        email: 'admin@example.com',
      };

      authServiceMock.validateUser.mockResolvedValue(user);

      const result = await strategy.validate({
        sub: '123',
        email: 'admin@example.com',
      });

      expect(result).toEqual(user);

      expect(authServiceMock.validateUser).toHaveBeenCalledWith('123');
    });

    it('should throw when the user does not exist', async () => {
      authServiceMock.validateUser.mockResolvedValue(null);

      await expect(
        strategy.validate({
          sub: 'invalid-id',
          email: 'admin@example.com',
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(authServiceMock.validateUser).toHaveBeenCalledWith('invalid-id');
    });
  });
});
