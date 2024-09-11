import { Test, TestingModule } from '@nestjs/testing';
import { DemandeAdminService } from './demande-admin.service';

describe('DemandeAdminService', () => {
  let service: DemandeAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemandeAdminService],
    }).compile();

    service = module.get<DemandeAdminService>(DemandeAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
