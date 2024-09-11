import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class FindByIdNameDto {
    

    @IsNotEmpty({message:'nameproduct can not be empty'})
    @IsString({message:'nameproduct should be string '})
    nameCouleur:string;
    @IsNotEmpty({message:'id can not be empty'})
    @IsNumber()
    id:number;
    @IsNotEmpty({message:'nameproduct can not be empty'})
    @IsString({message:'nameproduct should be string '})
    nameProduct:string;

}