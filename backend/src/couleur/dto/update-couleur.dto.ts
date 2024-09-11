import { PartialType } from '@nestjs/mapped-types';
import { CreateCouleurDto } from './create-couleur.dto';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateImageDto } from 'src/images/dto/update-image.dto';
import { UpdateSizeDto } from 'src/size/dto/update-size.dto';
import { CreateSizeDto } from 'src/size/dto/create-size.dto';
import { CreateImageDto } from 'src/images/dto/create-image.dto';
import { RemoveImageDto } from 'src/images/dto/remove-image.dto';
import { RemoveSizeDto } from 'src/size/dto/remove-size.dto';

export class UpdateCouleurDto{
    @IsNotEmpty({message:'nameCouleur can not be empty'})
    @IsString({message:'nameCouleur should be string '})
    @IsOptional()
    nameCouleur:string;

    @IsOptional()
    @IsNotEmpty({message:'nameproduct can not be empty'})
    @IsString({message:'nameproduct should be string '})
    nameProduct:string;

    @IsNotEmpty({message:'ancienNameCouleur can not be empty'})
    id:number;

    @IsOptional()
    @Type(()=>UpdateImageDto)
    @ValidateNested({ each: true })
    listeimage:UpdateImageDto[];
    
    @IsOptional()
    @Type(()=>UpdateSizeDto)
    @ValidateNested({ each: true })
    listesize:UpdateSizeDto[];

    @IsOptional()
    @Type(()=>CreateImageDto)
    @ValidateNested({ each: true })
    listeAjouterImage:CreateImageDto[];

    @IsOptional()
    @Type(()=>CreateSizeDto)
    @ValidateNested({ each: true })
    listeAjouterSize:CreateSizeDto[];

    @IsOptional()
    @Type(()=>RemoveImageDto)
    @ValidateNested({ each: true })
    listeSupprimerImage:RemoveImageDto[];

    @IsOptional()
    @Type(()=>RemoveSizeDto)
    @ValidateNested({ each: true })
    listeSupprimerSize:RemoveSizeDto[];
    
}
