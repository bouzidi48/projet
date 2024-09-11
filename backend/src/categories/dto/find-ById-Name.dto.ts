import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class FindByIdAndNameDto {
    @IsNotEmpty({message:'nameCategory can not be empty'})
    @IsString({message:'nameCategory should be string '})
    nameCategory:string;

    @IsNotEmpty({message:'id can not be empty'})
    @IsNumber()
    id:number;

    
}