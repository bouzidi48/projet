import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FindByProductDto {
    

    @IsNotEmpty({message:'nameproduct can not be empty'})
    @IsString({message:'nameproduct should be string '})
    nameProduct:string;


}