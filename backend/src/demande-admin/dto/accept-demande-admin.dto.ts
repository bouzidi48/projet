import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AccepterDto {
    @IsNotEmpty({message:'id can not be empty'})
    @IsNumber({},{message:'id should be number '})
    id:number;
    
    
}
