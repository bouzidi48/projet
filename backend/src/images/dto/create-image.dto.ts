import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateImageDto {
    @IsNotEmpty({message:'url can not be empty'})
    @IsString({message:'url should be string '})
    UrlImage:string;

    @IsNotEmpty({message:'namecouleur can not be empty'})
    @IsString({message:'namecouleur should be string '})
    nameCouleur:string;
    @IsNotEmpty({message:'namecouleur can not be empty'})
    @IsString({message:'namecouleur should be string '})
    nameProduct:string;
}
