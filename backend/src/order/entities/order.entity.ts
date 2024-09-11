import { OrderStatus } from "src/enum/order-status.enum";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shipping } from "./shipping.entity";
import { OrderItems } from "./order-item.entity";
import { Product } from "src/product/entities/product.entity";
import { Payment } from "src/payment/entities/payment.entity";




@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    total_amount: number;
    @Column()
    total_reduction: number;
    @Column()
    order_date: Date;

     @OneToOne(()=>Shipping,(ship)=>ship.order,{cascade:true})
     @JoinColumn()
    
    shipping_address: Shipping;

    @Column({nullable:true})
    billing_address: string; 

    @Column()
    ShippeAt:Date;
    @Column()
    delivered:Date;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PROCESSING
    })
    status: OrderStatus;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @ManyToOne(() => User, user => user.orders)
     user: User;

    @OneToMany(()=>OrderItems,op=>op.order,{cascade:true})
    orderItems:OrderItems[]; 

    @ManyToOne(()=>User,(user)=>user.orderUpdateBy)
    orderUpdateBy:User

    @OneToOne(() => Payment, (payment) => payment.order)
    payment: Payment;


    
}
