import { PartialType } from '@nestjs/mapped-types';

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateImageCategoryDto{
    @IsString({message:'urlImage should be string '})
    @IsOptional()
    UrlImage:string;


    @IsOptional()
    @IsString({message:'nameproduct should be string '})
    nomCategorie:string;

    @IsNotEmpty({message:'ancienNameCouleur can not be empty'})
    id:number;

    
}

