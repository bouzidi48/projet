import { Module } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { AuthentificationController } from './authentification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { UserModule } from 'src/user/user.module';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';
import { ProductLikeModule } from 'src/product-like/product-like.module';
import { UserController } from 'src/user/user.controller';
import { ProductController } from 'src/product/product.controller';
import { ProductLikeController } from 'src/product-like/product-like.controller';


@Module({
  imports:[UserModule,ProductModule,ProductLikeModule],
  controllers: [AuthentificationController],
  providers: [AuthentificationService],
})
export class AuthentificationModule {}
