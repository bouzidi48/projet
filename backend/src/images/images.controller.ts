import { Controller, Get, Post, Body, Patch, Param, Delete, Session, Put, Query, ParseIntPipe } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FindByImageDto } from './dto/find-by-Image.dto';
import { FindByCouleurDto } from './dto/find-by-couleur.dto';
import { FindByIdNameDto } from './dto/find-by-Id-Name.dto';
import { RemoveImageDto } from './dto/remove-image.dto';
import { CreateImageCategoryDto } from './dto/create-image-category.dto';
import { UpdateImageCategoryDto } from './dto/update-image-category.dto';
import { FindByCategorieDto } from './dto/find-by-category.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('createProduct')
  create_product(@Session() request: Record<string, any>, @Body() createImageDto: CreateImageDto) {
    return this.imagesService.create_product(request, createImageDto);
  }

  @Post('createCategory')
  create_category(@Session() request: Record<string, any>, @Body() createImageDto: CreateImageCategoryDto) {
    return this.imagesService.create_category(request, createImageDto);
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get('findByImage')
  async findByImage(@Query() findByImage: FindByImageDto) {
    return await this.imagesService.findByNameImage(findByImage);
  }

  @Get('findByCouleur')
  async findByCouleur(@Query() findByCouleur: FindByCouleurDto) {
    return await this.imagesService.findByCouleur(findByCouleur);
  }

  @Get('findByCategorie')
  async findByCategorie(@Query() findByCouleur: FindByCategorieDto) {
    return await this.imagesService.findByCategory(findByCouleur);
  }

  @Get('findByNameAndId')
  async findByNameAndId(@Query() nameAndIdProduct: FindByIdNameDto) {
    return await this.imagesService.findByNameAndId(nameAndIdProduct);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.findOne(id);
  }

  @Put('updateProduct')
  update_product(@Session() request: Record<string, any>, @Body() updateSizeDto: UpdateImageDto) {
    return this.imagesService.update_product(request, updateSizeDto);
  }

  @Put('updateCategory')
  update_category(@Session() request: Record<string, any>, @Body() updateSizeDto: UpdateImageCategoryDto) {
    return this.imagesService.update_category(request, updateSizeDto);
  }

  @Delete('removeProduct')
  remove_product(@Session() request: Record<string, any>, @Body() removeSizeDto: RemoveImageDto) {
    return this.imagesService.remove_product(request, removeSizeDto);
  }

  @Delete('removeCategory')
  remove_category(@Session() request: Record<string, any>, @Body() removeSizeDto: RemoveImageDto) {
    return this.imagesService.remove_category(request, removeSizeDto);
  }
}
