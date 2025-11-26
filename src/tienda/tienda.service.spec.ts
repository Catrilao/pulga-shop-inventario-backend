import { PrismaService } from 'src/prisma/prisma.service';
import { TiendaService } from './tienda.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('TiendaService', () => {
  let service: TiendaService;
  let prisma: PrismaService;

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

  const mockPrismaService = {
    ciudad: {
      findUnique: jest.fn(),
    },
    tienda: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiendaService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  describe('create', async () => {});
});
