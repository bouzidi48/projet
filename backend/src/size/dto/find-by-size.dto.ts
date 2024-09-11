import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FindBySizeDto {
    

    @IsNotEmpty({message:'nameproduct can not be empty'})
    @IsString({message:'nameproduct should be string '})
    typeSize:string;


}