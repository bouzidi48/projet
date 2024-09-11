import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RemovePanierDto {
    @IsNotEmpty({message:'title can not be empty'})
    @IsNumber()
    @Transform(({ value }) => parseInt(value, 10))
    productId:number;

    @IsNotEmpty({message:'title can not be empty'})
    @IsNumber()
    @Transform(({ value }) => parseInt(value, 10))
    couleurId: number;
    
    @IsNotEmpty({message:'title can not be empty'})
    @IsNumber()
    @Transform(({ value }) => parseInt(value, 10))
    sizeId: number;
}
