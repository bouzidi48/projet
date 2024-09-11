import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('ProductLikes')
export class ProductLikeEntity {
    @PrimaryGeneratedColumn()
    like_id: number;
  
    @ManyToOne(() => User, user => user.likedProducts, { onDelete: 'CASCADE' })
    user: User;
  
    @ManyToOne(() => Product, product => product.likedBy, { onDelete: 'CASCADE' })
    product: Product;
  
    @Column()
    liked_at: Date;
}
