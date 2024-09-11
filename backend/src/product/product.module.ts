import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { CategoriesModule } from 'src/categories/categories.module';
import { ImagesModule } from 'src/images/images.module';
import { CouleurModule } from 'src/couleur/couleur.module';
import { CategoriesController } from 'src/categories/categories.controller';
import { UserModule } from 'src/user/user.module';
import { Couleur } from 'src/couleur/entities/couleur.entity';
import { CouleurRepository } from 'src/couleur/couleur.repository';
import { Size } from 'src/size/entities/size.entity';
import { SizeRepository } from 'src/size/size.repository';
import { ProductLikeModule } from 'src/product-like/product-like.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductRepository,Couleur,CouleurRepository,Size,SizeRepository]),
    forwardRef(() => CategoriesModule),
    forwardRef(() => UserModule),
    forwardRef(() => ImagesModule),
    forwardRef(() => CouleurModule),
    forwardRef(() => ProductLikeModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
