import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('JobOffersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /job-offers', () => {
    it('should return a valid health check response', async () => {
      const response = await request(app.getHttpServer()).get('/job-offers');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          data: expect.any(Array),
          meta: expect.any(Object),
          links: expect.any(Object),
        }),
      );
    });
  });
});
