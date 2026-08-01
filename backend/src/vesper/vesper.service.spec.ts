import { Test, TestingModule } from '@nestjs/testing';
import { VesperService } from './vesper.service';

describe('VesperService', () => {
  let service: VesperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VesperService],
    }).compile();

    service = module.get<VesperService>(VesperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
