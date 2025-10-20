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

  describe('Tiendas Endpoints', () => {
    let jwtVendedor: string;
    let jwtSinRol: string;
  
    beforeAll(() => {
      jwtVendedor = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMywiZW1haWwiOiJjb3JyZW9AY29ycmVvLmNvbSIsInJvbGUiOiJ2ZW5kZWRvciIsImlhdCI6MTc2MDk3OTA4OH0.dcRUZpDddgMwobYV_82pYI62VkeUZIBnWFQ3_EJkvw0';
      jwtSinRol = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMywiZW1haWwiOiJjb3JyZW9AY29ycmVvLmNvbSIsInJvbGUiOiJusuarioIiwiaWF0IjoxNzYwOTc5MDg4fQ.1rQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw';
    });
  
    it('/tiendas (POST) debe crear una tienda válida', async () => {
      const dto = {
        nombre: 'Mi Tienda',
        descripcion: 'Tienda de prueba',
        direccion: 'Calle Falsa 123',
        telefono: '987654321',
      };
      const res = await request(app.getHttpServer())
        .post('/tiendas')
        .set('Authorization', `Bearer ${jwtVendedor}`)
        .send(dto);
  
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('nombre', dto.nombre);
      expect(res.body).toHaveProperty('descripcion', dto.descripcion);
      expect(res.body).toHaveProperty('direccion', dto.direccion);
      expect(res.body).toHaveProperty('telefono', dto.telefono);
      expect(res.body).toHaveProperty('id_vendedor');
    });
  
    it('/tiendas (POST) debe requerir autenticación', async () => {
      const dto = {
        nombre: 'Mi Tienda',
        descripcion: 'Tienda de prueba',
        direccion: 'Calle Falsa 123',
        telefono: '987654321',
      };
      const res = await request(app.getHttpServer())
        .post('/tiendas')
        .send(dto);
  
      expect(res.status).toBe(401);
    });
  
    it('/tiendas (POST) debe requerir rol vendedor', async () => {
      const dto = {
        nombre: 'Mi Tienda',
        descripcion: 'Tienda de prueba',
        direccion: 'Calle Falsa 123',
        telefono: '987654321',
      };
      const res = await request(app.getHttpServer())
        .post('/tiendas')
        .set('Authorization', `Bearer ${jwtSinRol}`)
        .send(dto);
  
      expect(res.status).toBe(403);
    });
  });
  

  describe('Productos Endpoints', () => {
    let jwtVendedor: string;
    let jwtSinRol: string;

    beforeAll(async () => {
      jwtVendedor = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMywiZW1haWwiOiJjb3JyZW9AY29ycmVvLmNvbSIsInJvbGUiOiJ2ZW5kZWRvciIsImlhdCI6MTc2MDk3OTA4OH0.dcRUZpDddgMwobYV_82pYI62VkeUZIBnWFQ3_EJkvw0';
      jwtSinRol = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMywiZW1haWwiOiJub3JvbEBub3JvbC5jb20iLCJyb2xlIjoidXN1YXJpbyIsImlhdCI6MTc2MDk3OTA4OH0.1rQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw';
    });
  
    it('/productos (POST) debe crear un producto válido', async () => {
      const dto = {
        stock: 10,
        id_tienda: 1,
        precio: 100,
        disponible: true,
      };
      const res = await request(app.getHttpServer())
        .post('/productos')
        .set('Authorization', `Bearer ${jwtVendedor}`)
        .send(dto);
  
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('stock', dto.stock);
      expect(res.body).toHaveProperty('precio', dto.precio);
      expect(res.body).toHaveProperty('disponible', dto.disponible);
    });

    it('/productos (POST) debe requerir rol vendedor', async () => {
      const dto = {
        stock: 10,
        id_tienda: 1,
        precio: 100,
        disponible: true,
      };
      const res = await request(app.getHttpServer())
        .post('/productos')
        .set('Authorization', `Bearer ${jwtSinRol}`)
        .send(dto);

      expect(res.status).toBe(403);
    });
  

    it('/productos (POST) debe requerir autenticación', async () => {
      const dto = {
        stock: 10,
        id_tienda: 1,
        precio: 100,
        disponible: true,
      };

      const res = await request(app.getHttpServer())
        .post('/productos')
        .send(dto);

      expect(res.status).toBe(401);
    });

    it('/productos (POST) debe fallar si stock <= 0', async () => {
      const dto = {
        stock: 0,
        id_tienda: 1,
        precio: 100,
        disponible: true,
      };
      const res = await request(app.getHttpServer())
        .post('/productos')
        .set('Authorization', `Bearer ${jwtVendedor}`)
        .send(dto);
  
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('El stock inicial debe ser mayor a 0');
    });
  
    it('/productos (POST) debe fallar si precio <= 0', async () => {
      const dto = {
        stock: 10,
        id_tienda: 1,
        precio: 0,
        disponible: true,
      };
      const res = await request(app.getHttpServer())
        .post('/productos')
        .set('Authorization', `Bearer ${jwtVendedor}`)
        .send(dto);
  
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('El precio debe ser un número entero mayor a 0');
    });
  
    it('/productos (POST) debe requerir autenticación', async () => {
      const dto = {
        stock: 10,
        id_tienda: 1,
        precio: 100,
        disponible: true,
      };
      const res = await request(app.getHttpServer())
        .post('/productos')
        .send(dto);
  
      expect(res.status).toBe(401);
    });
  });
});