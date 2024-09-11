import { forwardRef, Module } from '@nestjs/common';
import { ProductLikeService } from './product-like.service';
import { ProductLikeController } from './product-like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductLikeEntity } from './entities/product-like.entity';
import { ProductLikeRepository } from './product-like.repository';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { UserController } from 'src/user/user.controller';
import { ProductController } from 'src/product/product.controller';


@Module({
  imports: [TypeOrmModule.forFeature([ProductLikeEntity,ProductLikeRepository]),forwardRef(() => UserModule),forwardRef(() => ProductModule),],
  controllers: [ProductLikeController],
  providers: [ProductLikeService],
  exports:[ProductLikeService]
})
export class ProductLikeModule {}
