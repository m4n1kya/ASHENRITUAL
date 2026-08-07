import { Test, TestingModule } from '@nestjs/testing';
import { ShowroomsService } from './showrooms.service';

describe('ShowroomsService', () => {
  let service: ShowroomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowroomsService],
    }).compile();

    service = module.get<ShowroomsService>(ShowroomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
