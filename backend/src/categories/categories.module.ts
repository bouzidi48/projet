import { forwardRef, Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoryRepository } from './category.repository';
import { UserModule } from 'src/user/user.module';
import { ImagesModule } from 'src/images/images.module';
import { UserController } from 'src/user/user.controller';
import { ImagesController } from 'src/images/images.controller';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, CategoryRepository]),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    forwardRef(() => ImagesModule),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
