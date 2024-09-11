import { forwardRef, Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ProductModule } from 'src/product/product.module';
import { ReviewRepository } from './review.repository';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { UserModule } from 'src/user/user.module';
import { UserController } from 'src/user/user.controller';
import { ProductController } from 'src/product/product.controller';

@Module({
  imports:[TypeOrmModule.forFeature([ReviewEntity,ReviewRepository]),forwardRef(() => UserModule),ProductModule ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports:[ReviewService]
})
export class ReviewModule {}
