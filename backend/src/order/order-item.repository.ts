import { EntityRepository, Repository } from 'typeorm';
import { OrderItems } from './entities/order-item.entity';



@EntityRepository(OrderItems)
export class OrderItemsRepository extends Repository<OrderItems> {}