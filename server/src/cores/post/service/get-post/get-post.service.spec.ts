import { Test, TestingModule } from '@nestjs/testing';
import { GetPostService } from './get-post.service';

describe('GetPostService', () => {
  let service: GetPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetPostService],
    }).compile();

    service = module.get<GetPostService>(GetPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
