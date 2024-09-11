import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteReviewDto {
  @IsNotEmpty()
  @IsNumber()
  id: number; 
}