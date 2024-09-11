import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FindByImageDto {
    

    @IsNotEmpty({message:'urlImage can not be empty'})
    @IsString({message:'urlImage should be string '})
    urlImage:string;


}