import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateImageCategoryDto {
    @IsNotEmpty({message:'url can not be empty'})
    @IsString({message:'url should be string '})
    UrlImage:string;

    @IsNotEmpty({message:'namecategorie can not be empty'})
    @IsString({message:'namecategorie should be string '})
    nameCategorie:string;
}
