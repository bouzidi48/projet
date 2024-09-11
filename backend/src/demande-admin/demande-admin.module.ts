import { Module } from '@nestjs/common';
import { DemandeAdminService } from './demande-admin.service';
import { DemandeAdminController } from './demande-admin.controller';
import { UserController } from 'src/user/user.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeAdmin } from './entities/demande-admin.entity';
import { DemandeAdminRepository } from './demande-admin.repositoty';

@Module({
  imports: [TypeOrmModule.forFeature([DemandeAdmin,DemandeAdminRepository]), UserModule],
  controllers: [DemandeAdminController],
  providers: [DemandeAdminService],
  exports:[DemandeAdminService]
})
export class DemandeAdminModule {}
