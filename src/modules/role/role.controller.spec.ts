import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;

  const mockRole = { id: 'role-1', name: 'admin', permissions: [] };

  const mockRoleService = {
    findAll: jest.fn().mockResolvedValue([mockRole]),
    findById: jest.fn().mockResolvedValue(mockRole),
    create: jest.fn().mockResolvedValue(mockRole),
    update: jest.fn().mockResolvedValue(mockRole),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [{ provide: RoleService, useValue: mockRoleService }],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('should return all roles', async () => {
      const result = await controller.list();
      expect(result).toEqual([mockRole]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('detail', () => {
    it('should return a role by id', async () => {
      const result = await controller.detail('role-1');
      expect(result).toEqual(mockRole);
      expect(service.findById).toHaveBeenCalledWith('role-1');
    });
  });

  describe('create', () => {
    it('should create a role', async () => {
      const dto = { name: 'editor' };
      const result = await controller.create(dto);
      expect(result).toEqual(mockRole);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const dto = { name: 'superadmin' };
      const result = await controller.update('role-1', dto);
      expect(result).toEqual(mockRole);
      expect(service.update).toHaveBeenCalledWith('role-1', dto);
    });
  });

  describe('delete', () => {
    it('should delete a role', async () => {
      const result = await controller.delete('role-1');
      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith('role-1');
    });
  });
});
