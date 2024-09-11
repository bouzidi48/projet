import { PartialType } from '@nestjs/mapped-types';

import { IsNotEmpty, isNumber, IsOptional, IsString } from 'class-validator';

export class RemoveSizeDto{
    @IsNotEmpty({message:'typeSize can not be empty'})
    id:number;

    @IsOptional()
    idCouleur:number;
    
}
