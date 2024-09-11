import { Controller, Get, Post, Body, Patch, Param, Delete, Session, Put, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindByNameProductDto } from './dto/find-by-name-product.dto';
import { FindByCategorieDto } from './dto/find-by-categorie.dto';
import { RemoveProductDto } from './dto/remove-product.dto';
import { FindByNameAndIdProductDto } from './dto/find-by-name-id-product.dto';
import { AjouetrPanierDto } from './dto/ajouter-panier.dto';
import { RemovePanierDto } from './dto/remove-panier.to';
import { Order } from 'src/order/entities/order.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('listePanier')
  listePanier(@Session() request: Record<string, any>) {
    return this.productService.listePanier(request);
  }
  @Post('create')
  create(@Session() request: Record<string, any>, @Body() createProductDto: CreateProductDto) {
    return this.productService.create(request, createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('findbyNameProduct')
  findByNameProduct(@Query() nameProduct: FindByNameProductDto) {
    return this.productService.findByNameProduct(nameProduct);
  }

  @Get('findbyNameAndIdProduct')
  findByNameAndIdProduct(@Query() nameAndIdProduct: FindByNameAndIdProductDto) {
    return this.productService.findByNameAndIdProduct(nameAndIdProduct);
  }

  @Get('findbyCategory')
  findByCategory(@Query() findByCategory: FindByCategorieDto) {
    return this.productService.findByCategory(findByCategory);
  }

  @Put('update')
  update(@Session() request: Record<string, any>, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(request, updateProductDto);
  }

  @Delete('delete')
  remove(@Session() request: Record<string, any>, @Body() updateProductDto: RemoveProductDto) {
    return this.productService.remove(request, updateProductDto);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findById(id);
  }

  @Post('createPanier')
  async createPanier(@Session() request: Record<string, any>, @Body() createProductDto: AjouetrPanierDto) {
    return await this.productService.ajouterPanier(request, createProductDto);
  }

  

  @Delete('deletefromPanier')
  removefromPanier(@Session() request: Record<string, any>, @Query() removePanierDto: RemovePanierDto) {
    console.log('Received DTO:', removePanierDto);
    return this.productService.removefromPanier(request, removePanierDto);
  }

  @Delete('deletePanier')
  removePanier(@Session() request: Record<string, any>) {
    
    return this.productService.removePanier(request);
  }

  @Put(':id/stock')
  async updateStock(@Param('id', ParseIntPipe) id: number, @Body() { sizeId, couleurId, productId, stock, status,order }: { sizeId: number, couleurId: number, productId: number, stock: number, status: string,order:Order }) {
    try {
      const updatedProduct = await this.productService.updateStock(sizeId, couleurId, productId, stock, status,order);
      return {
        data: updatedProduct,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: error.message,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Get('trend')
  async trend() {
    return await this.productService.trend();
  }

  @Get('recomendation')
  async recomendation(@Session() request: Record<string, any>) {
    return await this.productService.recomendation(request);
  }
}
