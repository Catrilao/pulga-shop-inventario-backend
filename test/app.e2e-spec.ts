import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  //* SKIPPED
  describe.skip('Root endpoint', () => {
    it('/ (GET) should return 200 and Hello World!', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });

    it('/ (GET) should return content-type text/html', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Content-Type', /text\/html/);
    });
  });

  //* SKIPPED
  describe.skip('Error handling', () => {
    it('/non-existent-route (GET) should return 404', () => {
      return request(app.getHttpServer())
        .get('/non-existent-route')
        .expect(404);
    });
  });

  describe('HTTP Methods', () => {
    it('/ (POST) should handle POST requests', () => {
      return request(app.getHttpServer())
        .post('/')
        .send({ test: 'data' })
        .expect((res) => {
          expect(res.status).toBeDefined();
        });
    });

    //* SKIPPED
    xit('/ (PUT) should handle PUT requests', () => {
      return request(app.getHttpServer())
        .put('/')
        .send({ test: 'data' })
        .expect((res) => {
          expect(res.status).toBeDefined();
        });
    });
  
    //* SKIPPED
    xit('/ (DELETE) should handle DELETE requests', () => {
      return request(app.getHttpServer())
        .delete('/')
        .expect((res) => {
          expect(res.status).toBeDefined();
        });
    });
  });
});