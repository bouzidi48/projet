import { IsNotEmpty, IsString } from "class-validator";

export class FindByNameCategoryDto {
    @IsNotEmpty({message:'nameCategory can not be empty'})
    @IsString({message:'nameCategory should be string '})
    nameCategory:string;

    
}