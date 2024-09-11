import { IsNotEmpty, IsString } from "class-validator";

export class UserVerifyDto{
    @IsNotEmpty({message:'code is Empty'})
    @IsString({message:'code must be a string'})
    code:string;
}