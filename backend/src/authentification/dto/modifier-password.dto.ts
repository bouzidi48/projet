import { IsNotEmpty, IsString, } from "class-validator";

export class UpdatePasswordDto{
    @IsNotEmpty({message:'password is Empty'})
    @IsString({message:'password must be a string'})
    password:string;
    @IsNotEmpty({message:'confirmpassword is Empty'})
    @IsString({message:'confirmpassword must be a string'})
    confirmpassword:string
}