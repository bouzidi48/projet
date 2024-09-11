import { Controller, Get, Post, Body, Patch, Param, Delete, Session, ParseIntPipe } from '@nestjs/common';
import { ProductLikeService } from './product-like.service';
import { CreateProductLikeDto } from './dto/create-product-like.dto';
import { UpdateProductLikeDto } from './dto/update-product-like.dto';


@Controller('product-like')
export class ProductLikeController {
  constructor(private readonly productLikeService: ProductLikeService) {}

  @Post('like')
   likeProduct(@Session() request: Record<string, any>,@Body() productId:CreateProductLikeDto) {
    return this.productLikeService.likeProduct(request,productId);
  }

  @Delete('unlike')
  unlikeProduct(@Session() request: Record<string, any>,@Body() productId:CreateProductLikeDto) {
    return this.productLikeService.unlikeProduct(request,productId);
  }
 
  @Get()
  findAll(@Session() request: Record<string, any>) {
    return this.productLikeService.findAll(request)
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.productLikeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: number, @Body() updateProductLikeDto: UpdateProductLikeDto) {
    return this.productLikeService.update(id, updateProductLikeDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.productLikeService.remove(id);
  }
}
