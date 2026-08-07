import { Test, TestingModule } from '@nestjs/testing';
import { ShowroomsController } from './showrooms.controller';

describe('ShowroomsController', () => {
  let controller: ShowroomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowroomsController],
    }).compile();

    controller = module.get<ShowroomsController>(ShowroomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
