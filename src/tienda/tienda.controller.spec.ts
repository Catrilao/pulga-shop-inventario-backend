import { Test, TestingModule } from '@nestjs/testing';
import { TiendaController } from './tienda.controller';
import { TiendaService } from './tienda.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ExecutionContext } from '@nestjs/common';

describe('TiendaController', () => {
  let controller: TiendaController;
  let service: TiendaService;

  const mockTiendaService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request.user = { id: 1, rol: 'vendedor' };
      return true;
    }),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiendaController],
      providers: [
        {
          provide: TiendaService,
          useValue: mockTiendaService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<TiendaController>(TiendaController);
    service = module.get<TiendaService>(TiendaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a tienda', async () => {
      const createTiendaDto = {
        nombre: 'PlanetExpress',
        descripcion: 'Empresa de delivery.',
        direccion: 'Nueva Nueva York',
        telefono: '912345653',
      };
      const id_vendedor = 10;

      const expectedResult = {
        message: 'Tienda creada exitosamente',
        data: {
          id: 1,
          ...createTiendaDto,
          activa: true,
          createdAt: new Date(),
        },
      };

      mockTiendaService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createTiendaDto, id_vendedor);

      expect(result).toEqual(expectedResult);
      expect(mockTiendaService.create).toHaveBeenCalledWith(
        createTiendaDto,
        id_vendedor,
      );
    });
  });
});
