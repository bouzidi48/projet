import { CategoryEntity } from "src/categories/entities/category.entity";
import { Couleur } from "src/couleur/entities/couleur.entity";
import { Roles } from "src/enum/user_enum";
import { Product } from "src/product/entities/product.entity";
import { Size } from "src/size/entities/size.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('images')

export class Images {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    UrlImage: string;

    @ManyToOne(()=>Couleur,(col)=>col.images)
    couleur:Couleur;

    @Column()
    createdate: Date;

    @Column()
    updatedate: Date;

    @ManyToOne(()=>User,(user)=>user.images)
    addedBy:User;

    @OneToOne(() => CategoryEntity, category => category.image)
    @JoinColumn()
    category: CategoryEntity;

}
