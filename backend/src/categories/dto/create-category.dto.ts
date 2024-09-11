import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateImageCategoryDto } from "src/images/dto/create-image-category.dto";
import { CreateImageDto } from "src/images/dto/create-image.dto";

export class CreateCategoryDto {
    @IsNotEmpty({message:'title can not be empty'})
    @IsString({message:'title should be string '})
    nameCategory:string;

    @IsNotEmpty({message:'description can not be empty'})
    @IsString({message:'description should be string '})
    description:string;

    @IsString({message:'description should be string '})
    @IsOptional()
    NameparentCategory: string;

    @Type(()=>CreateImageCategoryDto)
    @ValidateNested()
    image:CreateImageCategoryDto;

}
