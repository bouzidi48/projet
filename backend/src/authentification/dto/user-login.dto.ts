import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserLoginDto{
    
    @IsNotEmpty({message:'Name can not be null'})
    @IsString({message:'Name must be a string'})
    username:string;
    
    
    @IsNotEmpty({message:'password can not be null'})
    @MinLength(8,{message:'password must be at least 8 characters'})
    password:string;
}