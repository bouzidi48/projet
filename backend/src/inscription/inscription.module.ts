import { Module } from '@nestjs/common';
import { InscriptionService } from './inscription.service';
import { InscriptionController } from './inscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { UserModule } from 'src/user/user.module';
import { UserController } from 'src/user/user.controller';


@Module({
  imports:[UserModule],
  controllers: [InscriptionController],
  providers: [InscriptionService],
})
export class InscriptionModule {}
