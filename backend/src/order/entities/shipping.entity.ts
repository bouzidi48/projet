import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity('shipping')
export class Shipping{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    name:string;
    @Column()
    phone:string ;
    @Column()
    address:string;
    @Column()
    city:string;
    @Column()
    country:string;
    @Column()
    postalCode:string;
    @Column()
    createdate:Date;
    @Column()
    updatedate:Date;
    @OneToOne(()=>Order,(order)=>order.shipping_address)
    order:Order; 
    
}