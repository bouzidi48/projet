import { Type } from "class-transformer";
import { CreateShippingDto } from "./create-shipping.dto";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { OrderedProductsDto } from "./ordered-products.dto";

export class CreateOrderDto {
    @Type(()=>CreateShippingDto)
    @ValidateNested()
    shippingAddress:CreateShippingDto;
    
    @IsOptional()
    @IsString({message:'billing_address format should be string '})
    billing_address:string;
}
