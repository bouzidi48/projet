import { IsEmail, IsNotEmpty } from "class-validator";

export class UserPasswordOublierDto{

    @IsNotEmpty({message:'email can not be null'})
    @IsEmail({},{message:'email must be a string'})
    email:string;
    
}