import { Test, TestingModule } from '@nestjs/testing';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { Categoria, Condicion } from 'generated/prisma';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PRODUCTO_ERROR_CODES } from './constants/error-codes';
import { ERROR_CODES } from 'src/common/constants/error-codes';
import { Order } from 'src/common/constants/order.enum';

describe('ProductoController', () => {
  let controller: ProductoController;

  const ID_TIENDA_TEST = 1;
  const SKU_TEST = 'MOCK-SKU-1234';
  const DATE_TEST = new Date();
  const ID_VENDEDOR_TEST = 123;

  const createMockProducto = (overrides = {}) => ({
    id_producto: 1,
    sku: SKU_TEST,
    fecha_creacion: DATE_TEST,
    id_tienda: ID_TIENDA_TEST,
    nombre: 'Zapatillas',
    stock: 100,
    costo: 40000,
    condicion: Condicion.NUEVO,
    marca: 'Nike',
    categoria: Categoria.CALZADO,
    descripcion: 'Zapatilla Nike mucho muy bonita',
    peso: 0.7,
    largo: 30,
    alto: 7,
    ancho: 30,
    ...overrides,
  });
  const MOCK_PRODUCTO = createMockProducto();

  const mockProductoService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoController],
      providers: [
        Reflector,
        { provide: ProductoService, useValue: mockProductoService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<ProductoController>(ProductoController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto = (({ id_producto, sku, fecha_creacion, ...resto }) =>
      resto)(MOCK_PRODUCTO);
    const productoCreado = MOCK_PRODUCTO;

    it('should call productoService.create and return the new product', async () => {
      mockProductoService.create.mockResolvedValue(productoCreado);

      const result = await controller.create(createDto);

      expect(mockProductoService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(productoCreado);
    });

    it('should throw an error if productoService.create fails', async () => {
      const error = new NotFoundException(
        PRODUCTO_ERROR_CODES.PRODUCTO_YA_EXISTE,
      );
      mockProductoService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow(
        PRODUCTO_ERROR_CODES.PRODUCTO_YA_EXISTE,
      );
      expect(mockProductoService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findOne', () => {
    it('should call productoService.findOne and return the solicited product', async () => {
      const productoSolicitado = MOCK_PRODUCTO;
      mockProductoService.findOne.mockResolvedValue(productoSolicitado);

      const result = await controller.findOne(SKU_TEST);

      expect(mockProductoService.findOne).toHaveBeenCalledWith(SKU_TEST);
      expect(result).toEqual(productoSolicitado);
    });

    it('should throw an error if productoService.findOne fails', async () => {
      const error = new NotFoundException(ERROR_CODES.NO_ENCONTRADO);
      mockProductoService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(SKU_TEST)).rejects.toThrow(
        ERROR_CODES.NO_ENCONTRADO,
      );
      expect(mockProductoService.findOne).toHaveBeenCalledWith(SKU_TEST);
    });
  });

  describe('findAll', () => {
    const mockQueryDto = {
      take: 10,
      page: 2,
      order: Order.ASC,
      disponible: true,
    };
    const mockPageDto = {
      data: [
        MOCK_PRODUCTO,
        createMockProducto({ id_producto: 2, sku: 'P1-ABC-123' }),
      ],
      meta: {
        page: 2,
        take: 10,
        itemCount: 2,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };

    it('should call productoService.findAll and return paginated products', async () => {
      mockProductoService.findAll.mockResolvedValue(mockPageDto);

      const result = await controller.findAll(
        ID_VENDEDOR_TEST,
        mockQueryDto as any,
      );

      expect(mockProductoService.findAll).toHaveBeenCalledWith(
        ID_VENDEDOR_TEST,
        mockQueryDto,
      );
      expect(result).toEqual(mockPageDto);
      expect(result.data).toHaveLength(2);
    });

    it('should throw an error if productoService.findAll fails', async () => {
      const error = new BadRequestException(
        PRODUCTO_ERROR_CODES.PRECIO_INVALIDO,
      );
      mockProductoService.findAll.mockRejectedValue(error);

      await expect(
        controller.findAll(ID_VENDEDOR_TEST, mockQueryDto as any),
      ).rejects.toThrow(PRODUCTO_ERROR_CODES.PRECIO_INVALIDO);
      expect(mockProductoService.findAll).toHaveBeenCalledWith(
        ID_VENDEDOR_TEST,
        mockQueryDto,
      );
    });
  });

  describe('update', () => {
    const mockUpdateProductoDto = {
      costo: 20000,
    };
    const productoActualizado = {
      ...MOCK_PRODUCTO,
      ...mockUpdateProductoDto,
    };

    it('should call productoService.update and return the updated product', async () => {
      mockProductoService.update.mockResolvedValue(productoActualizado);

      const result = await controller.update(
        ID_VENDEDOR_TEST,
        SKU_TEST,
        mockUpdateProductoDto,
      );

      expect(mockProductoService.update).toHaveBeenCalledWith(
        ID_VENDEDOR_TEST,
        SKU_TEST,
        mockUpdateProductoDto,
      );
      expect(result).toEqual(productoActualizado);
    });

    it('should throw an error if productoService.update fails', async () => {
      const error = new NotFoundException(ERROR_CODES.NO_ENCONTRADO);
      mockProductoService.update.mockRejectedValue(error);

      await expect(
        controller.update(ID_VENDEDOR_TEST, SKU_TEST, mockUpdateProductoDto),
      ).rejects.toThrow(ERROR_CODES.NO_ENCONTRADO);
      expect(mockProductoService.update).toHaveBeenCalledWith(
        ID_VENDEDOR_TEST,
        SKU_TEST,
        mockUpdateProductoDto,
      );
    });
  });

  describe('delete', () => {
    it('should call productoService.delete', async () => {
      mockProductoService.delete.mockResolvedValue(undefined);

      await controller.delete(ID_VENDEDOR_TEST, SKU_TEST);

      expect(mockProductoService.delete).toHaveBeenCalledWith(
        ID_VENDEDOR_TEST,
        SKU_TEST,
      );
    });

    it('should throw an error if productoService.delete fails', async () => {
      const error = new NotFoundException(ERROR_CODES.NO_ENCONTRADO);
      mockProductoService.delete.mockRejectedValue(error);

      await expect(
        controller.delete(ID_VENDEDOR_TEST, SKU_TEST),
      ).rejects.toThrow(ERROR_CODES.NO_ENCONTRADO);
      expect(mockProductoService.delete).toHaveBeenCalledWith(
        ID_VENDEDOR_TEST,
        SKU_TEST,
      );
    });
  });
});
