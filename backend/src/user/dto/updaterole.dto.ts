import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, minLength } from "class-validator";
import { User } from "../entities/user.entity";
import { Roles } from "src/enum/user_enum";

export class RoleUpdateDto{
    
    @IsNotEmpty({message:'Name can not be null'})

    id:number;
    
    
    @IsEnum(Roles)
    role:string;
}