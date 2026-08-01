import { Test, TestingModule } from '@nestjs/testing';
import { VesperController } from './vesper.controller';

describe('VesperController', () => {
  let controller: VesperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VesperController],
    }).compile();

    controller = module.get<VesperController>(VesperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
