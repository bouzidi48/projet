import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FindByCategorieDto {
    @IsNotEmpty({message:'title can not be empty'})
    @IsString({message:'title should be string '})
    nameCategory:string;

    
}