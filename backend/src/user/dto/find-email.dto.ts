import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength, minLength } from "class-validator";

export class FindByEmail{
    @IsEmail()
    @IsNotEmpty({message:'id can not be null'})
    email:string;
}