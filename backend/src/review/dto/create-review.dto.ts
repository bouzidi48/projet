import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
   @IsNotEmpty({message:'Product should be empty'})
   @IsNumber({},{message:'Product Id should be number'})
   @IsOptional()
    productId:number;

    @IsNotEmpty({message:'nameProduct can not be empty'})
    @IsString({message:'nameProduct should be string '})
    nameProduct:string;
    
    @IsNotEmpty({message:'ratings could not be empty'})
    @IsNumber()
    @Min(1)
    @Max(5)
    ratings:number;
    @IsNotEmpty({message:'comment should not empty'})
    @IsString()
    comment:string;
}
