import { paginate } from './paginate';

describe('paginate', () => {
  const mockFindMany = jest.fn().mockResolvedValue([{ id: 'a' }, { id: 'b' }]);
  const mockCount = jest.fn().mockResolvedValue(42);

  const mockPrisma = {
    testModel: {
      findMany: mockFindMany,
      count: mockCount,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call findMany and count with correct pagination', async () => {
    const result = await paginate(mockPrisma as any, 'testModel', {
      page: 2,
      pageSize: 15,
      where: { active: true },
      include: { relations: true },
      orderBy: { createdAt: 'desc' },
    });

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { active: true },
      include: { relations: true },
      orderBy: { createdAt: 'desc' },
      skip: 15,
      take: 15,
    });
    expect(mockCount).toHaveBeenCalledWith({
      where: { active: true },
    });
    expect(result).toEqual({
      items: [{ id: 'a' }, { id: 'b' }],
      total: 42,
    });
  });

  it('should compute skip=0 for first page', async () => {
    await paginate(mockPrisma as any, 'testModel', { page: 1, pageSize: 10 });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
      }),
    );
  });
});
