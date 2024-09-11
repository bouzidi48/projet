import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, minLength } from "class-validator";

export class UserUpdateDto{
    
    @IsNotEmpty({message:'Name can not be null'})
    @IsString({message:'Name must be a string'})
    @IsOptional()
    username:string;
    
    
    @IsNotEmpty({message:'password can not be null'})
    @MinLength(8,{message:'password must be at least 8 characters'})
    @IsOptional()
    password:string;
}