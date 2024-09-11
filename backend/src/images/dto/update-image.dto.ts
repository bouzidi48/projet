import { PartialType } from '@nestjs/mapped-types';

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateImageDto{
   
    @IsString({message:'urlImage should be string '})
    @IsOptional()
    urlImage:string;


    @IsOptional()
    
    @IsString({message:'nameproduct should be string '})
    nameCouleur:string;
    @IsOptional()
    
    @IsString({message:'nameproduct should be string '})
    nameProduct:string;
    @IsNotEmpty({message:'ancienNameCouleur can not be empty'})
    id:number;
}

