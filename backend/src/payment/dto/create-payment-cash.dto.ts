import { IsEnum, IsNumber } from 'class-validator';
import { PaymentMethod } from 'src/enum/payment_method.enum';
import { Column } from 'typeorm';

export class CreateCashPaymentDto {
  @IsNumber()
  orderId: number;
  



 
  
}
