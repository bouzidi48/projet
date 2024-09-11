import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength, minLength } from "class-validator";

export class FindByUsernameByEmail{
    @IsString()
    @IsNotEmpty({message:'username can not be null'})
    username:string;
    @IsEmail()
    @IsNotEmpty({message:'id can not be null'})
    email:string;
}