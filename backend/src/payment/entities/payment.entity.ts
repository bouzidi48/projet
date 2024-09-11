import { IsNumber } from "class-validator";
import { PaymentMethod } from "src/enum/payment_method.enum";
import { PaymentStatus } from "src/enum/payment_status.enum";
import { Order } from "src/order/entities/order.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('payment')
export class Payment {
    @PrimaryGeneratedColumn()
    @IsNumber()
    id: number;
    
    @OneToOne(() => Order, (order) => order.payment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;
  
    @Column({
      type: 'enum',
      enum: PaymentMethod,
      default: PaymentMethod.CARD
    })
    payment_method: PaymentMethod;
  
    @Column({
      type: 'enum',
      enum: PaymentStatus,
      default: PaymentStatus.PENDING
    })
    payment_status: PaymentStatus;
  
    @Column({ nullable: true })
    stripePaymentIntentId: string;
  
    @Column({ nullable: true })
    cardNumber: string;
  
    @Column({ nullable: true })
    cardExpiry: string;
  
    @Column({ nullable: true })
    cardCvc: string;
  
    @Column()
    payment_date: Date;
  
    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;


}
