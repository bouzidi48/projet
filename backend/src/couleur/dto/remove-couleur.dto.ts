import { PartialType } from '@nestjs/mapped-types';
import { CreateCouleurDto } from './create-couleur.dto';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RemoveImageDto } from 'src/images/dto/remove-image.dto';
import { RemoveSizeDto } from 'src/size/dto/remove-size.dto';

export class RemoveCouleurDto{
    @IsNotEmpty({message:'nameCouleur can not be empty'})
    
    
    id:number;

    @IsNotEmpty({message:'nameproduct can not be empty'})
    @IsString({message:'nameproduct should be string '})
    nameProduct:string;
    
    @IsOptional()
    @Type(()=>RemoveImageDto)
    @ValidateNested({ each: true })
    listeimage:RemoveImageDto[];
    
    @IsOptional()
    @Type(()=>RemoveSizeDto)
    @ValidateNested({ each: true })
    listesize:RemoveSizeDto[];
}
