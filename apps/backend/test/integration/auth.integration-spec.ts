import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { AppModule } from 'src/app.module';
import { AuthService } from 'src/modules/auth/auth.service';

describe('AuthService Integration', () => {
  let service: AuthService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    const dataSource = module.get<DataSource>(DataSource);

    await dataSource.destroy();
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const adminEmail = process.env.ADMIN_EMAIL!;

      const result = await service.login({
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD!,
      });

      expect(result).toEqual(
        expect.objectContaining({
          name: 'Administrador',
          email: adminEmail,
        }),
      );

      expect(result.id).toEqual(expect.any(String));
      expect(result.id).not.toBe('');
    });

    it('should reject invalid password', async () => {
      await expect(
        service.login({
          email: process.env.ADMIN_EMAIL!,
          password: 'wrong-password',
        }),
      ).rejects.toThrow('Invalid Credentials');
    });

    it('should reject unknown user', async () => {
      await expect(
        service.login({
          email: 'unknown@example.com',
          password: 'password',
        }),
      ).rejects.toThrow('Invalid Credentials');
    });
  });

  describe('generateAccessToken', () => {
    it('should generate an access token for a valid user', async () => {
      const user = await service.login({
        email: process.env.ADMIN_EMAIL!,
        password: process.env.ADMIN_PASSWORD!,
      });

      const result = service.generateAccessToken(user);

      expect(result).toEqual(expect.any(String));
      expect(result).not.toBe('');
    });
  });
});