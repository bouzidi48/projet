import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './CreatePayment.dto';
import { CreateCashPaymentDto } from './create-payment-cash.dto';
import { IsNumber } from 'class-validator';


export class UpdateCashPaymentDto  {
    @IsNumber()
    paymentId:number;
}
