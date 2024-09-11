import { CategoryEntity } from "src/categories/entities/category.entity";
import { Couleur } from "src/couleur/entities/couleur.entity";
import { Roles } from "src/enum/user_enum";
import { OrderItems } from "src/order/entities/order-item.entity";
import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('sizes')

export class Size {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    typeSize: string;

    @ManyToOne(()=>Couleur,(col)=>col.sizes)
    couleur:Couleur;

    @Column()
    createdate: Date;

    @Column()
    updatedate: Date;

    @Column()
    stockQuantity: number;

    @ManyToOne(()=>User,(user)=>user.products)
    addedBy:User;

    @OneToMany(()=>OrderItems,(op)=>op.size)
    orderItems:OrderItems[]; 
    

}
