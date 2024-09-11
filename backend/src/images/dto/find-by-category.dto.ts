import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FindByCategorieDto {
    

    @IsNotEmpty({message:'nameproduct can not be empty'})
    @IsString({message:'nameproduct should be string '})
    nameCategory:string;


}