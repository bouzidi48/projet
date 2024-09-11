import { IsEnum, IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PaymentMethod } from 'src/enum/payment_method.enum';

export class CreateCardPaymentDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsString()
  @IsNotEmpty()
  cardToken: string;

  
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cardExpiry: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cardCvc: string;
  
}
