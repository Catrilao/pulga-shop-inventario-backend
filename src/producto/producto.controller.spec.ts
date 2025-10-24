import { Test, TestingModule } from '@nestjs/testing';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

describe('ProductoController', () => {
  let controller: ProductoController;
  let service: ProductoService;

  const mockProductoService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoController],
      providers: [
        {
          provide: ProductoService,
          useValue: mockProductoService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductoController>(ProductoController);
    service = module.get<ProductoService>(ProductoService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateProductoDto = {
      stock: 10,
      id_tienda: 1,
      precio: 100,
      disponible: true,
    };

    it('should throw BadRequestException if service throws error', async () => {
      mockProductoService.create.mockRejectedValue(new BadRequestException('Invalid data'));
      await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should handle missing disponible field', async () => {
      const dtoWithoutDisponible = {
        stock: 5,
        id_tienda: 2,
        precio: 50,
      } as CreateProductoDto;
      mockProductoService.create.mockResolvedValue({
        id: 2,
        ...dtoWithoutDisponible,
        disponible: true,
      });
      const result = await controller.create(dtoWithoutDisponible);
      expect(service.create).toHaveBeenCalledWith(dtoWithoutDisponible);
      expect(result).toHaveProperty('id', 2);
      expect(result).toHaveProperty('disponible', true);
    });

    it('should handle service throwing a custom error message', async () => {
      mockProductoService.create.mockRejectedValue(
        new NotFoundException('La tienda no existe'),
      );
      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);
      await expect(controller.create(dto)).rejects.toThrow(
        'La tienda no existe',
      );
    });

    it('should propagate validation errors from service', async () => {
      mockProductoService.create.mockRejectedValue(
        new BadRequestException('El stock inicial debe ser mayor a 0'),
      );
      await expect(controller.create({ ...dto, stock: 0 })).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.create({ ...dto, stock: 0 })).rejects.toThrow(
        'El stock inicial debe ser mayor a 0',
      );
    });

    it('should handle service returning null', async () => {
      mockProductoService.create.mockResolvedValue(null);
      const result = await controller.create(dto);
      expect(result).toBeNull();
    });

    it('should handle service returning undefined', async () => {
      mockProductoService.create.mockResolvedValue(undefined);
      const result = await controller.create(dto);
      expect(result).toBeUndefined();
    });

    it('should handle service returning an object without id', async () => {
      mockProductoService.create.mockResolvedValue({ ...dto });
      const result = await controller.create(dto);
      expect(result).toMatchObject(dto);
      expect(result).not.toHaveProperty('id');
    });

    it('should handle service throwing a generic error', async () => {
      mockProductoService.create.mockRejectedValue(new Error());
      await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should handle service throwing a non-Error value', async () => {
      mockProductoService.create.mockRejectedValue('Some string error');
      await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
