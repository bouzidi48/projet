import { EntityRepository, Repository } from 'typeorm';
import { OrderItems } from './entities/order-item.entity';
import { Shipping } from './entities/shipping.entity';



@EntityRepository(Shipping)
export class ShippingRepository extends Repository<Shipping> {}