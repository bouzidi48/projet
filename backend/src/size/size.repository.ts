import { EntityRepository, Repository } from 'typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { Size } from './entities/size.entity';


@EntityRepository(Size)
export class SizeRepository extends Repository<Size> {}