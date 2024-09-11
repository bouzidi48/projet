import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateImageDto } from "src/images/dto/create-image.dto";
import { CreateShippingDto } from "src/order/dto/create-shipping.dto";
import { CreateSizeDto } from "src/size/dto/create-size.dto";

export class CreateCouleurDto {
    @IsNotEmpty({message:'title can not be empty'})
    @IsString({message:'title should be string '})
    nameCouleur:string;

    @IsNotEmpty({message:'nameproduct can not be empty'})
    @IsString({message:'nameproduct should be string '})
    nameProduct:string;

    @Type(()=>CreateImageDto)
    @ValidateNested({ each: true })
    listeimage:CreateImageDto[];

    @Type(()=>CreateSizeDto)
    @ValidateNested({ each: true })
    listesize:CreateSizeDto[];


}

