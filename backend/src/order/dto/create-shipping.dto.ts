import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateShippingDto{
    
   @IsNotEmpty({message:'Phone Can not be empty.'})
   @IsString({message:'Phone format should be string '})
    phone:string ;
    @IsOptional()
    @IsString({message:'Name format should be string '})
    name:string ;
    @IsNotEmpty({message:'adresse Can not be empty.'})
    @IsString({message:'adresse format should be string '})
    address:string ;
    @IsNotEmpty({message:'city Can not be empty.'})
    @IsString({message:'city format should be string '})
    city:string ;
    @IsNotEmpty({message:'country Can not be empty.'})
    @IsString({message:'country format should be string '})
    country:string ;
    @IsNotEmpty({message:'postalCode Can not be empty.'})
    @IsString({message:'postalCode format should be string '})
    postalCode:string ;
    
}