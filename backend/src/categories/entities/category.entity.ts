import { Images } from "src/images/entities/image.entity";
import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import {Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
@Entity({name:'categories'})
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id:number;
    
    @Column()
    nameCategory:string;
    
    @Column()
    description:string;

    @ManyToOne(() => CategoryEntity, category => category.subcategories, { nullable: true })
    parentCategory: CategoryEntity;

    @OneToMany(() => CategoryEntity, category => category.parentCategory)
    subcategories: CategoryEntity[];


    @Column()
    createdAt:Date;
    @Column()
    updatedAt:Date;

    @ManyToOne(()=>User,(user)=>user.categories)
    addedBy:User;
  
    @OneToMany(()=>Product,(product)=>product.category)
    products:Product[]

    @OneToOne(() => Images, image => image.category)
    image: Images; // Ajouter la relation One-to-One avec ImageEntity
}
