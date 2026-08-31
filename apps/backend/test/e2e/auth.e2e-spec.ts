import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import request from 'supertest';
import { Server } from 'http';
import cookieParser from 'cookie-parser';

type GraphQLResponse<T> = {
  data?: T | null;
  errors?: Array<{
    message: string;
  }>;
};

type LoginResponse = {
  login: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
};

describe('Auth E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should initialize the application', () => {
    expect(app).toBeDefined();
  });

  it('should login with valid credentials', async () => {
    const response = await request(app.getHttpServer() as Server)
      .post('/graphql')
      .send({
        query: `
          mutation {
            login(
              input: {
                email: "${process.env.ADMIN_EMAIL}"
                password: "${process.env.ADMIN_PASSWORD}"
              }
            ) {
              user {
                id
                name
                email
              }
            }
          }
        `,
      })
      .expect(200);

    const body = response.body as GraphQLResponse<LoginResponse>;

    expect(body.errors).toBeUndefined();

    expect(body.data?.login.user).toEqual(
      expect.objectContaining({
        name: 'Administrador',
        email: process.env.ADMIN_EMAIL,
      }),
    );

    expect(body.data?.login.user.id).toEqual(expect.any(String));
    expect(body.data?.login.user.id).not.toBe('');

    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('accessToken=')]),
    );
  });

  it('should reject login with invalid password', async () => {
    const response = await request(app.getHttpServer() as Server)
      .post('/graphql')
      .send({
        query: `
          mutation {
            login(
              input: {
                email: "${process.env.ADMIN_EMAIL}"
                password: "wrong-password"
              }
            ) {
              user {
                id
                name
                email
              }
            }
          }
        `,
      })
      .expect(200);

    const body = response.body as GraphQLResponse<LoginResponse>;

    expect(body.data).toBeNull();
    expect(body.errors).toBeDefined();
    expect(body.errors?.[0].message).toBe('Invalid Credentials');

    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('should reject login with non-existent user', async () => {
    const response = await request(app.getHttpServer() as Server)
      .post('/graphql')
      .send({
        query: `
          mutation {
            login(
              input: {
                email: "nonexistent@novolar.local"
                password: "any-password"
              }
            ) {
              user {
                id
                name
                email
              }
            }
          }
        `,
      })
      .expect(200);

    const body = response.body as GraphQLResponse<LoginResponse>;

    expect(body.data).toBeNull();
    expect(body.errors).toBeDefined();
    expect(body.errors?.[0].message).toBe('Invalid Credentials');

    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('should return the authenticated user', async () => {
    const loginResponse = await request(app.getHttpServer() as Server)
      .post('/graphql')
      .send({
        query: `
          mutation {
            login(
              input: {
                email: "${process.env.ADMIN_EMAIL}"
                password: "${process.env.ADMIN_PASSWORD}"
              }
            ) {
              user {
                id
                name
                email
              }
            }
          }
        `,
      })
      .expect(200);

    const cookies = loginResponse.headers['set-cookie'] as unknown as string[];

    expect(cookies).toBeDefined();

    const accessTokenCookie = cookies?.find((cookie) =>
      cookie.startsWith('accessToken='),
    );

    expect(accessTokenCookie).toBeDefined();

    const meResponse = await request(app.getHttpServer() as Server)
      .post('/graphql')
      .set('Cookie', accessTokenCookie!.split(';')[0])
      .send({
        query: `
          query {
            me {
              id
              name
              email
            }
          }
        `,
      })
      .expect(200);

    const body = meResponse.body as GraphQLResponse<{
      me: {
        id: string;
        name: string;
        email: string;
      };
    }>;

    expect(body.errors).toBeUndefined();

    expect(body.data?.me).toEqual(
      expect.objectContaining({
        name: 'Administrador',
        email: process.env.ADMIN_EMAIL,
      }),
    );

    expect(body.data?.me.id).toEqual(expect.any(String));
  });

  it('should reject unauthenticated user', async () => {
    const response = await request(app.getHttpServer() as Server)
      .post('/graphql')
      .send({
        query: `
          query {
            me {
              id
              name
              email
            }
          }
        `,
      })
      .expect(200);

    const body = response.body as GraphQLResponse<{
      me: {
        id: string;
        name: string;
        email: string;
      };
    }>;

    expect(body.data).toBeNull();
    expect(body.errors).toBeDefined();
  });

  it('should reject invalid access token', async () => {
    const response = await request(app.getHttpServer() as Server)
      .post('/graphql')
      .set('Cookie', 'accessToken=invalid-token')
      .send({
        query: `
          query {
            me {
              id
              name
              email
            }
          }
        `,
      })
      .expect(200);

    const body = response.body as GraphQLResponse<{
      me: {
        id: string;
        name: string;
        email: string;
      };
    }>;

    expect(body.data).toBeNull();
    expect(body.errors).toBeDefined();
  });

  it('should logout successfully', async () => {
    const response = await request(app.getHttpServer() as Server)
      .post('/graphql')
      .send({
        query: `
          mutation {
            logout
          }
        `,
      })
      .expect(200);

    const body = response.body as GraphQLResponse<{
      logout: boolean;
    }>;

    expect(body.errors).toBeUndefined();
    expect(body.data?.logout).toBe(true);

    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('accessToken=;')]),
    );
  });
});
