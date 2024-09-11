import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { RemoveCouleurDto } from "src/couleur/dto/remove-couleur.dto";

export class RemoveProductDto {

    @IsNotEmpty({message:'nameProduct can not be empty'})
    id:number;

    @Type(()=>RemoveCouleurDto)
    @ValidateNested({ each: true })
    listeCouleur:RemoveCouleurDto[];

}