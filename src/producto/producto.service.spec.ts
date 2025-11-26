import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';

describe('ProductoService', () => {
  let service: ProductoService;
  let prisma: PrismaService;

  const mockPrisma = {
    tienda: {
      findUnique: jest.fn(),
    },
    producto: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
