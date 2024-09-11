import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSizeDto {
    @IsNotEmpty({message:'title can not be empty'})
    @IsString({message:'title should be string '})
    typeSize:string;

    @IsNotEmpty({message:'stock can not be empty'})
    @IsNumber({},{message:'stock should be number '})
    stockQuantity: number;

    @IsNotEmpty({message:'namecouleur can not be empty'})
    @IsString({message:'namecouleur should be string '})
    nameCouleur:string;

    @IsNotEmpty({message:'namecouleur can not be empty'})
    @IsString({message:'namecouleur should be string '})
    nameProduct:string;
}
