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

  describe('create', () => {
    const validDto: CreateProductoDto = {
      stock: 10,
      id_tienda: 1,
      precio: 100,
      disponible: true,
    };

    it('should throw error if stock <= 0', async () => {
      await expect(service.create({ ...validDto, stock: 0 })).rejects.toThrow(
        'El stock inicial debe ser mayor a 0',
      );
    });

    it('should throw error if precio <= 0', async () => {
      await expect(service.create({ ...validDto, precio: 0 })).rejects.toThrow(
        'El precio debe ser un número entero mayor a 0',
      );
    });

    it('should throw error if precio is not integer', async () => {
      await expect(
        service.create({ ...validDto, precio: 99.5 }),
      ).rejects.toThrow('El precio debe ser un número entero mayor a 0');
    });

    it('should throw error if tienda does not exist', async () => {
      mockPrisma.tienda.findUnique.mockResolvedValue(null);
      await expect(service.create(validDto)).rejects.toThrow(
        'La tienda no existe',
      );
    });

    it('should create producto if data is valid', async () => {
      mockPrisma.tienda.findUnique.mockResolvedValue({ id_tienda: 1 });
      mockPrisma.producto.create.mockResolvedValue({
        id: 1,
        ...validDto,
        sku: 'sku',
      });
      const result = await service.create(validDto);
      expect(mockPrisma.tienda.findUnique).toHaveBeenCalledWith({
        where: { id_tienda: 1 },
      });
      expect(mockPrisma.producto.create).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('sku');
    });
  });
});
