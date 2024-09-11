import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RepondreContactDto {
    @IsNotEmpty({message:'email can not be empty'})
    @IsEmail({},{message:'email should be valid'})
    email:string;

    @IsNotEmpty({message:'id_contact can not be empty'})
    @IsNumber({},{message:'id_contact should be number '})
    id_contact:number;

    @IsNotEmpty({message:'message can not be empty'})
    @IsString({message:'message should be string '})
    message: string;

}