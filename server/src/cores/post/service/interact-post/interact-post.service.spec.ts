import { Test, TestingModule } from '@nestjs/testing';
import { InteractPostService } from './interact-post.service';

describe('InteractPostService', () => {
  let service: InteractPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteractPostService],
    }).compile();

    service = module.get<InteractPostService>(InteractPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
