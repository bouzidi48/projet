import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength, minLength } from "class-validator";

export class FindByUsername{
    @IsString()
    @IsNotEmpty({message:'username can not be null'})
    username:string;
}