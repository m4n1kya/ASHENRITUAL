import { Test, TestingModule } from '@nestjs/testing';
import { OblivService } from './obliv.service';

describe('OblivService', () => {
  let service: OblivService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OblivService],
    }).compile();

    service = module.get<OblivService>(OblivService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
