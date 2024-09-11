import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AjouetrPanierDto {
    @IsNotEmpty({message:'title can not be empty'})
    @IsNumber()
    productId:number;

    @IsNotEmpty({message:'title can not be empty'})
    @IsNumber()
    couleurId: number;
    @IsNotEmpty({message:'title can not be empty'})
    @IsNumber()
    sizeId: number;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value ?? 1)
    quantity: number = 1;
}
