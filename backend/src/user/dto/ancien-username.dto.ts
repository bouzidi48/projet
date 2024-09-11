import { IsNotEmpty, IsString, } from "class-validator";

export class AncienUsernameDto{
    @IsNotEmpty({message:'password is Empty'})
    @IsString({message:'password must be a string'})
    username:string;
    
}