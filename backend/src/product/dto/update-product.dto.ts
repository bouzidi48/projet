import { Type } from "class-transformer";
import { isNotEmpty, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateCouleurDto } from "src/couleur/dto/create-couleur.dto";
import { RemoveCouleurDto } from "src/couleur/dto/remove-couleur.dto";
import { UpdateCouleurDto } from "src/couleur/dto/update-couleur.dto";

export class UpdateProductDto {
    @IsOptional()
    
    @IsString({message:'title should be string '})
    nameProduct:string;

    @IsOptional()
    
    @IsString({message:'description should be string '})
    description:string;
    
    @IsOptional()
    
    price:number;


    @IsOptional()
    
    nomCategory:string;

    @IsNotEmpty({message:'idProduct can not be empty'})
    id:number;

    
    @IsOptional()
    @Type(()=>UpdateCouleurDto)
    @ValidateNested({ each: true })
    listeCouleur:UpdateCouleurDto[];

    @IsOptional()
    @Type(()=>CreateCouleurDto)
    @ValidateNested({ each: true })
    listeAjouterCouleur:CreateCouleurDto[];

    @IsOptional()
    @Type(()=>RemoveCouleurDto)
    @ValidateNested({ each: true })
    listeSupprimerCouleur:RemoveCouleurDto[];
}
