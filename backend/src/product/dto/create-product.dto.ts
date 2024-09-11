import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateCouleurDto } from "src/couleur/dto/create-couleur.dto";

export class CreateProductDto {
    @IsNotEmpty({message:'title can not be empty'})
    @IsString({message:'title should be string '})
    nameProduct:string;

    @IsNotEmpty({message:'description can not be empty'})
    @IsString({message:'description should be string '})
    description:string;

    @IsNotEmpty({message:'price can not be empty'})
    price:number;

    @IsNotEmpty({message:'nomCategory can not be empty'})
    nomCategory:string;

    @Type(()=>CreateCouleurDto)
    @ValidateNested({ each: true })
    listeCouleur:CreateCouleurDto[];
}
