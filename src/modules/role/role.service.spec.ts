import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RoleService } from './role.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('RoleService', () => {
  let service: RoleService;
  let prisma: PrismaService;

  const mockRole = {
    id: 'role-1',
    name: 'admin',
    description: '管理员',
    createdAt: new Date(),
    updatedAt: new Date(),
    permissions: [],
  };

  const mockPrisma = {
    role: {
      findMany: jest.fn().mockResolvedValue([mockRole]),
      count: jest.fn().mockResolvedValue(1),
      findUnique: jest.fn().mockResolvedValue(mockRole),
      create: jest.fn().mockResolvedValue(mockRole),
      update: jest.fn().mockResolvedValue(mockRole),
      delete: jest.fn().mockResolvedValue(mockRole),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated roles', async () => {
      const result = await service.findAll({ page: 1, pageSize: 10 });
      expect(result).toEqual({ items: [mockRole], total: 1 });
      expect(prisma.role.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 }),
      );
      expect(prisma.role.count).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a role with permissions', async () => {
      const result = await service.findById('role-1');
      expect(result).toEqual(mockRole);
    });

    it('should throw NotFoundException when role not found', async () => {
      jest.spyOn(prisma.role, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.findById('not-exist')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a role without permissions', async () => {
      const dto = { name: 'editor' };
      await service.create(dto);
      expect(prisma.role.create).toHaveBeenCalledWith({
        data: { name: 'editor' },
        include: { permissions: true },
      });
    });

    it('should create a role with permissions', async () => {
      const dto = { name: 'editor', permissionIds: ['perm-1', 'perm-2'] };
      await service.create(dto);
      expect(prisma.role.create).toHaveBeenCalledWith({
        data: {
          name: 'editor',
          permissions: { connect: [{ id: 'perm-1' }, { id: 'perm-2' }] },
        },
        include: { permissions: true },
      });
    });
  });

  describe('update', () => {
    it('should update role name', async () => {
      const dto = { name: 'superadmin' };
      await service.update('role-1', dto);
      expect(prisma.role.update).toHaveBeenCalledWith({
        where: { id: 'role-1' },
        data: { name: 'superadmin' },
        include: { permissions: true },
      });
    });

    it('should replace permissions with set', async () => {
      const dto = { permissionIds: ['perm-3'] };
      await service.update('role-1', dto);
      expect(prisma.role.update).toHaveBeenCalledWith({
        where: { id: 'role-1' },
        data: { permissions: { set: [{ id: 'perm-3' }] } },
        include: { permissions: true },
      });
    });

    it('should throw NotFoundException when role not found', async () => {
      jest.spyOn(prisma.role, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.update('not-exist', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a role', async () => {
      await service.delete('role-1');
      expect(prisma.role.delete).toHaveBeenCalledWith({
        where: { id: 'role-1' },
      });
    });

    it('should throw NotFoundException when role not found', async () => {
      jest.spyOn(prisma.role, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.delete('not-exist')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
