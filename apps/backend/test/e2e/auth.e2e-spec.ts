import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import request from 'supertest';

describe('Auth E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should initialize the application', () => {
    expect(app).toBeDefined();
  });

  it('should login with valid credentials', async () => {
    const response = await request(app.getHttpServer())
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
              accessToken  
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.login.user).toEqual(
      expect.objectContaining({
        name: 'Administrador',
        email: process.env.ADMIN_EMAIL,
      }),
    );
    expect(response.body.data.login.accessToken).toBeDefined();
    expect(response.body.data.login.accessToken).not.toBe('');
  });

  it('should reject login with invalid password', async () => {
    const response = await request(app.getHttpServer())
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
              accessToken  
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.data).toBeNull();
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe('Invalid Credentials');
  });

  it('should reject login with non-existent user', async () => {
    const response = await request(app.getHttpServer())
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
              accessToken  
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.data).toBeNull();
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe('Invalid Credentials');
  });
});