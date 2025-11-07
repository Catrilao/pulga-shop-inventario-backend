import { Test, TestingModule } from '@nestjs/testing';
import { TiendaService } from './tienda.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('TiendaService', () => {
  let service: TiendaService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    tienda: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiendaService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new tienda', async () => {
      const createTiendaDto = {
        nombre: 'PlanetExpress',
        descripcion: 'Empresa de delivery.',
        direccion: 'Nueva Nueva York',
        telefono: '912345653',
      };
      const id_vendedor = 10;

      const expectedResult = {
        id: 1,
        ...createTiendaDto,
        id_vendedor,
        fecha_creacion: new Date(),
      };

      mockPrismaService.tienda.create.mockResolvedValue(expectedResult);

      const result = await service.create(createTiendaDto, id_vendedor);

      expect(result).toBeDefined();
      expect(mockPrismaService.tienda.create).toHaveBeenCalledWith({
        data: {
          ...createTiendaDto,
          id_vendedor,
        },
      });
    });
  });
});
