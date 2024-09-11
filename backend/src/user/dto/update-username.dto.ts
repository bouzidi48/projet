import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class UserNameUpdateDto{
    @IsNotEmpty({message:'username is Empty'})
    @IsString({message:'username must be a string'})
    username:string;
}