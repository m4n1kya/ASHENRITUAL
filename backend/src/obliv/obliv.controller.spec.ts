import { Test, TestingModule } from '@nestjs/testing';
import { OblivController } from './obliv.controller';

describe('OblivController', () => {
  let controller: OblivController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OblivController],
    }).compile();

    controller = module.get<OblivController>(OblivController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
