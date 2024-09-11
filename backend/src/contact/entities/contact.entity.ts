import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
@Entity({name:'contacts'})
export class Contact {
    @PrimaryGeneratedColumn()
    id:number;
    
    @Column()
    nom:string;
    
    @Column()
    email:string;

    @Column()
    telephone: string;

    @Column()
    message: string;

    @Column({nullable:true})
    numero_commande: number;


    @Column()
    createdAt:Date;
}

