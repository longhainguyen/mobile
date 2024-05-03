import { Test, TestingModule } from '@nestjs/testing';
import { EditPostService } from './edit-post.service';

describe('EditPostService', () => {
  let service: EditPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EditPostService],
    }).compile();

    service = module.get<EditPostService>(EditPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
