import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthInputDTO } from './dto/auth.input.dto';
import { AuthDTO } from './dto/auth.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  const authServiceMock = {
    login: jest.fn(),
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
    it('should login successfuly', async () => {
      const input: AuthInputDTO = {
        email: 'admin@example.com',
        password: 'password123',
      };

      const authResponse: AuthDTO = {
        user: {
          id: '123',
          name: 'Admin',
          email: 'admin@example.com',
        },
        accessToken: 'access-token',
      };

      authServiceMock.login.mockResolvedValue(authResponse);

      const result = await resolver.login(input);

      expect(result).toEqual(authResponse);
      expect(authServiceMock.login).toHaveBeenCalledWith(input);
      expect(authServiceMock.login).toHaveBeenCalledTimes(1);
    });

    it('should propagate authentication errors', async () => {
      const input: AuthInputDTO = {
        email: 'admin@example.com',
        password: 'wrong-password',
      };

      authServiceMock.login.mockRejectedValue(
        new UnauthorizedException('Invalid Credentials'),
      );

      await expect(resolver.login(input)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(authServiceMock.login).toHaveBeenCalledWith(input);
      expect(authServiceMock.login).toHaveBeenCalledTimes(1);
    });
  });
});
