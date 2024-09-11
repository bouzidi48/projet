import { PartialType } from '@nestjs/mapped-types';

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSizeDto{
    
    @IsString({message:'nameCouleur should be string '})
    @IsOptional()
    typeSize:string;

    
    @IsNumber({},{message:'stock should be number '})
    stockQuantity: number;


    @IsOptional()
    idCouleur:number;
    @IsOptional()
    @IsString({message:'nameproduct should be string '})
    nameCouleur:string;

    @IsOptional()
    @IsString({message:'nameproduct should be string '})
    nameProduct:string;

    
    @IsNumber({},{message:'stock should be number '})
    id:number;
}
