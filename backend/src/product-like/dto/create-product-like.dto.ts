import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateProductLikeDto {
    @IsNotEmpty({message:'Product should be empty'})
    @IsNumber({},{message:'Product Id should be number'})
    productId: number;
}
