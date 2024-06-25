import { Test, TestingModule } from '@nestjs/testing';
import { BorrowResolver } from './borrow.resolver';

describe('BorrowResolver', () => {
  let resolver: BorrowResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BorrowResolver],
    }).compile();

    resolver = module.get<BorrowResolver>(BorrowResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
