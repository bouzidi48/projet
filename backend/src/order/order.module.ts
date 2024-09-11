import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderRepository } from './order.repository';

import { Shipping } from './entities/shipping.entity';
import { OrderItems } from './entities/order-item.entity';
import { ProductModule } from 'src/product/product.module';
import { CouleurModule } from 'src/couleur/couleur.module';
import { SizeModule } from 'src/size/size.module';
import { UserController } from 'src/user/user.controller';
import { ProductController } from 'src/product/product.controller';
import { CouleurController } from 'src/couleur/couleur.controller';
import { SizeController } from 'src/size/size.controller';
import { PaymentController } from 'src/payment/payment.controller';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order,OrderRepository,OrderItems,Shipping,]),forwardRef(() => UserModule),forwardRef(() => ProductModule),CouleurModule,SizeModule,forwardRef(() => PaymentModule)],
  controllers: [OrderController],
  providers: [OrderService],
  exports:[OrderService]
})
export class OrderModule {}
