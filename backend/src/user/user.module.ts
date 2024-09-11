import { forwardRef, Injectable, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import { Cookie } from 'express-session';

import { UserRepository } from './user.repository';
import { OrderModule } from 'src/order/order.module';
import { ReviewRepository } from 'src/review/review.repository';
import { ReviewModule } from 'src/review/review.module';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderRepository } from 'src/order/order.repository';
import { CouleurModule } from 'src/couleur/couleur.module';
import { ProductModule } from 'src/product/product.module';
import { CategoriesModule } from 'src/categories/categories.module';


@Module({
  imports:[TypeOrmModule.forFeature([User,UserRepository,ReviewRepository,ReviewEntity]),forwardRef(() => OrderModule),CouleurModule,ProductModule,CategoriesModule],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
