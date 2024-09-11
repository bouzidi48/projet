import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('review')
export class ReviewEntity {
   @PrimaryGeneratedColumn()
   id : number 

   @Column()
   ratings : number
   
   @Column()
   comment:string

   @Column()
   createdate:Date
   @Column()
   updatedate:Date

   @ManyToOne(type=>User,(user)=>user.review)
   user:User;

   @ManyToOne(type=>Product,(prod)=>prod.review)
   product:Product;

}
