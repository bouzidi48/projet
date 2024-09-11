import { IsNotEmpty, IsString, } from "class-validator";

export class AncienPasswordDto{
    @IsNotEmpty({message:'password is Empty'})
    @IsString({message:'password must be a string'})
    password:string;
    
}