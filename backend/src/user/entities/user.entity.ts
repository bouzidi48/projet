
import { CategoryEntity } from "src/categories/entities/category.entity";
import { Couleur } from "src/couleur/entities/couleur.entity";
import { Roles } from "src/enum/user_enum";
import { Images } from "src/images/entities/image.entity";
import { Order } from "src/order/entities/order.entity";
import { ProductLikeEntity } from "src/product-like/entities/product-like.entity";
import { Product } from "src/product/entities/product.entity";
import { ReviewEntity } from "src/review/entities/review.entity";
import { Size } from "src/size/entities/size.entity";
//import { ReviewEntity } from "src/review/entities/review.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    createdate: Date;

    @Column()
    updatedate: Date;

    @Column({
        type: 'enum',
        enum: Roles,
        default: Roles.USER
    })
    role: Roles;

    @OneToMany(()=>CategoryEntity,(cat)=>cat.addedBy)
    categories:CategoryEntity[];

    @OneToMany(()=>Couleur,(coul)=>coul.addedBy)
    couleurs:Couleur[];

    @OneToMany(()=>Product,(product)=>product.addedBy)
    products:Product[];

    @OneToMany(()=>Size,(size)=>size.addedBy)
    sizes:Size[];

    @OneToMany(()=>Images,(image)=>image.addedBy)
    images:Images[];


    @OneToMany(() => ReviewEntity, (rev) => rev.user)
    review: ReviewEntity[]; 
     

  @ManyToMany(() => Product, product => product.likedBy)
  @JoinTable({
    name: 'product_liked',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' }
  })
  likedProducts: Product[]; 


  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(()=>Order,(order)=>order.orderUpdateBy)
  orderUpdateBy:Order[];
}