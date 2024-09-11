import { Test, TestingModule } from '@nestjs/testing';
import { DemandeAdminController } from './demande-admin.controller';
import { DemandeAdminService } from './demande-admin.service';

describe('DemandeAdminController', () => {
  let controller: DemandeAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemandeAdminController],
      providers: [DemandeAdminService],
    }).compile();

    controller = module.get<DemandeAdminController>(DemandeAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
