import { forwardRef, Module } from '@nestjs/common';
import { CouleurService } from './couleur.service';
import { CouleurController } from './couleur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Couleur } from './entities/couleur.entity';
import { CouleurRepository } from './couleur.repository';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { SizeModule } from 'src/size/size.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Couleur, CouleurRepository]),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    forwardRef(() => CategoriesModule),
    forwardRef(() => SizeModule),
    forwardRef(() => ImagesModule),
  ],
  controllers: [CouleurController],
  providers: [CouleurService],
  exports: [CouleurService],
})
export class CouleurModule {}
