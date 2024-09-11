import { EntityRepository, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CategoryEntity } from 'src/categories/entities/category.entity';


@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {}