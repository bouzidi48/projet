import { Repository } from "typeorm";
import { ProductLikeEntity } from "./entities/product-like.entity";


export class ProductLikeRepository extends Repository<ProductLikeEntity> {}