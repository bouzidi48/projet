import { IsEmail, IsNotEmpty, IsString, MinLength, minLength } from "class-validator";

export class UserSignUpDto{
    
    @IsNotEmpty({message:'Name can not be null'})
    @IsString({message:'Name must be a string'})
    username:string;
    
    @IsNotEmpty({message:'email can not be null'})
    @IsEmail({},{message:'email must be a string'})
    email:string;
    
    @IsNotEmpty({message:'password can not be null'})
    @MinLength(8,{message:'password must be at least 8 characters'})
    password:string;
}