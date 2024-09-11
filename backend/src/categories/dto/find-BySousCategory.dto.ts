import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FindBySousCategoryDto {
    
    @IsNotEmpty({message:'title can not be empty'})
    @IsOptional()
    parentCategoryId: number;

}