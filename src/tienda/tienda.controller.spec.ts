import { Test, TestingModule } from '@nestjs/testing';
import { TiendaController } from './tienda.controller';
import { Reflector } from '@nestjs/core';
import { TiendaService } from './tienda.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { NotFoundException } from '@nestjs/common';
import { TIENDA_ERROR_CODES } from './constants/error-codes';
import { Order } from 'src/common/constants/order.enum';

describe('TiendaController', () => {
  let controller: TiendaController;

  const ID_VENDEDOR_TEST = 123;
  const ID_TIENDA_TEST = 12;
  const DATE_TEST = new Date();

  const createMockTienda = (overrides = {}) => ({
    id_tienda: ID_TIENDA_TEST,
    id_vendedor: ID_VENDEDOR_TEST,
    nombre: 'PlanetExpress',
    id_ciudad: 10,
    descripcion: 'Empresa de delivery interplanetaria',
    direccion: 'Nueva Nueva York',
    telefono: '+56912345678',
    fecha_creacion: DATE_TEST,
    online: true,
    ...overrides,
  });
  const MOCK_TIENDA = createMockTienda();

  const mockTiendaService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiendaController],
      providers: [
        Reflector,
        { provide: TiendaService, useValue: mockTiendaService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<TiendaController>(TiendaController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto = (({ id_tienda, fecha_creacion, ...resto }) => resto)(
      MOCK_TIENDA,
    );
    const tiendaCreada = MOCK_TIENDA;

    it('should call tiendaService.create and return the new shop', async () => {
      mockTiendaService.create.mockResolvedValue(tiendaCreada);

      const result = await controller.create(createDto, ID_VENDEDOR_TEST);

      expect(mockTiendaService.create).toHaveBeenCalledWith(
        createDto,
        ID_VENDEDOR_TEST,
      );
      expect(result).toEqual(tiendaCreada);
    });

    it('should throw an error if tiendaService.create fails', async () => {
      const error = new NotFoundException(TIENDA_ERROR_CODES.CIUDAD_NO_EXISTE);
      mockTiendaService.create.mockRejectedValue(error);

      await expect(
        controller.create(createDto, ID_VENDEDOR_TEST),
      ).rejects.toThrow(TIENDA_ERROR_CODES.CIUDAD_NO_EXISTE);
      expect(mockTiendaService.create).toHaveBeenCalledWith(
        createDto,
        ID_VENDEDOR_TEST,
      );
    });
  });

  describe('findOne', () => {
    it('should call tiendaService.findOne and return the solicited shop', async () => {
      const tiendaSolicitada = MOCK_TIENDA;
      mockTiendaService.findOne.mockResolvedValue(tiendaSolicitada);

      const result = await controller.findOne(ID_TIENDA_TEST);

      expect(mockTiendaService.findOne).toHaveBeenCalledWith(ID_TIENDA_TEST);
      expect(result).toEqual(tiendaSolicitada);
    });

    it('should throw an error if tiendaService.findOne fails', async () => {
      const error = new NotFoundException(TIENDA_ERROR_CODES.TIENDA_NO_EXISTE);
      mockTiendaService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(ID_TIENDA_TEST)).rejects.toThrow(
        TIENDA_ERROR_CODES.TIENDA_NO_EXISTE,
      );
      expect(mockTiendaService.findOne).toHaveBeenCalledWith(ID_TIENDA_TEST);
    });
  });

  describe('findAll', () => {
    const mockQueryDto = {
      take: 10,
      page: 2,
      order: Order.ASC,
      disponible: true,
    };

    it('should call tiendaService.findAll and return paginated shops', async () => {
      const mockPageDto = {
        data: [MOCK_TIENDA, createMockTienda({ id_tienda: 2 })],
        meta: {
          page: 2,
          take: 10,
          itemCount: 2,
          pageCount: 1,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };

      mockTiendaService.findAll.mockResolvedValue(mockPageDto);

      const result = await controller.findAll(
        mockQueryDto as any,
        ID_VENDEDOR_TEST,
      );

      expect(mockTiendaService.findAll).toHaveBeenCalledWith(
        mockQueryDto,
        ID_VENDEDOR_TEST,
      );
      expect(result).toEqual(mockPageDto);
      expect(result.data).toHaveLength(2);
    });

    it('should call tiendaService.findAll and return an empty array if not shops are found', async () => {
      const mockPageDto = {
        data: [],
        meta: {
          page: 1,
          take: 10,
          itemCount: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };

      mockTiendaService.findAll.mockResolvedValue(mockPageDto);

      const result = await controller.findAll(
        mockQueryDto as any,
        ID_VENDEDOR_TEST,
      );

      expect(mockTiendaService.findAll).toHaveBeenCalledWith(
        mockQueryDto,
        ID_VENDEDOR_TEST,
      );
      expect(result).toEqual(mockPageDto);
      expect(result.data).toHaveLength(0);
    });
  });
});
