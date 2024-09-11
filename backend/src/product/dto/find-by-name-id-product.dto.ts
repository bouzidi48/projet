import { IsNotEmpty, IsNumber, IsOptional, IsString, isNumber } from "class-validator";

export class FindByNameAndIdProductDto {
    @IsNotEmpty({message:'title can not be empty'})
    @IsString({message:'title should be string '})
    nameProduct:string;

    @IsNumber()
    @IsNotEmpty({message:'id can not be empty'})
    id:number;

    
}