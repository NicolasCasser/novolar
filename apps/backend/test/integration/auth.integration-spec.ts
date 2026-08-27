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
    const dataSource = module.get(DataSource);

    await dataSource.destroy();
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const result = await service.login({
        email: process.env.ADMIN_EMAIL!,
        password: process.env.ADMIN_PASSWORD!,
      });

      expect(result.user).toEqual({
        id: expect.any(String),
        name: 'Administrador',
        email: process.env.ADMIN_EMAIL,
      });

      expect(result.accessToken).toEqual(expect.any(String));
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
});