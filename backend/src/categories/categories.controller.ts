import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Session, ParseIntPipe, Put, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from 'src/user/entities/user.entity';
import { Roles } from 'src/enum/user_enum';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';

import { FindByNameCategoryDto } from './dto/find-ByName.dto';
import { CategoryEntity } from './entities/category.entity';
import { FindByIdAndNameDto } from './dto/find-ById-Name.dto';
import { FindByNameParentDto } from './dto/find-ByParentName.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  async create(@Session() request: Record<string, any>, @Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(request, createCategoryDto);
  }
  @Get("ParentCategories")
  async ParentCategories() {
    return await this.categoriesService.findParentCategories();
  }

  @Get('findByIdAndName')
  async findByIdAndName(@Query() findByIdAndNameDto: FindByIdAndNameDto) {
    return await this.categoriesService.findByIdAndName(findByIdAndNameDto);
  }

  @Get('Subcategories/:id')
  async findSubcategories(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.findSubcategories(id);
  }

  @Get('newCat')
  async newCat() {
    return await this.categoriesService.nouveauCat();
  }

  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @Get('bynameCategory')
  async findByName(@Query() nameCategory: FindByNameCategoryDto) {
    return await this.categoriesService.findByName(nameCategory);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Put('update/:id')
  async update(@Session() request: Record<string, any>, @Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesService.update(request, id, updateCategoryDto);
  }

  @Delete('delete/:id')
  async remove(@Session() request: Record<string, any>, @Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.remove(request, id);
  }
  
}
