import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { RemoveSizeDto } from 'src/size/dto/remove-size.dto';

export class RemoveImageDto{
    @IsNotEmpty({message:'urlImage can not be empty'})
    
    id:number;

    @IsOptional()
    @IsString({message:'nameproduct should be string '})
    nomCategorie:string;
    
    @IsOptional()
    @IsString({message:'nameproduct should be string '})
    nameCouleur:string;
}
