import { IsString, IsNotEmpty } from 'class-validator';

export class FindByNameProductDto {
  @IsString()
  @IsNotEmpty()
  nameProduct: string;
}
