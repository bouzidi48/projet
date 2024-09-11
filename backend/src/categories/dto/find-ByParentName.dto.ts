import { IsNotEmpty, IsString } from "class-validator";

export class FindByNameParentDto {
    @IsNotEmpty({message:'nameCategory can not be empty'})
    @IsString({message:'nameCategory should be string '})
    nameParentCategory:string;

    
}