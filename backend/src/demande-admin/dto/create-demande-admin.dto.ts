import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDemandeAdminDto {
    @IsNotEmpty({message:'nom can not be empty'})
    @IsString({message:'nom should be string '})
    nom:string;
    
    @IsEmail({},{message:'email should be valid'})
    @IsNotEmpty({message:'email can not be empty'})
    email:string;



    @IsNotEmpty({message:'message can not be empty'})
    @IsString({message:'message should be string '})
    message:string;


    

    @IsNotEmpty({message:'numero_telephone can not be empty'})
    @IsString({message:'numero_telephone should be string '})
    telephone: string;
}
