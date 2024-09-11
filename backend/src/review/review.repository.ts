import { EntityRepository, Repository } from "typeorm";
import { ReviewEntity } from "./entities/review.entity";

@EntityRepository(ReviewEntity)
export class ReviewRepository extends Repository<ReviewEntity> {}