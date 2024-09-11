import { EntityRepository, Repository } from 'typeorm';
import { Images } from './entities/image.entity';





@EntityRepository(Images)
export class ImageRepository extends Repository<Images> {}