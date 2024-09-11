import { forwardRef, Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageRepository } from './image.repository';
import { UserModule } from 'src/user/user.module';
import { CouleurModule } from 'src/couleur/couleur.module';
import { Images } from './entities/image.entity';
import { UserController } from 'src/user/user.controller';
import { CouleurController } from 'src/couleur/couleur.controller';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Images, ImageRepository]),
    forwardRef(() => UserModule),
    forwardRef(() => CouleurModule),
    forwardRef(() => CategoriesModule),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
