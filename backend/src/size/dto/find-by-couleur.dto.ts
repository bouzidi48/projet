import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FindByCouleurDto {
    

    @IsNotEmpty({message:'nameproduct can not be empty'})
    @IsString({message:'nameproduct should be string '})
    nameCouleur:string;


}