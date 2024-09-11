import { Controller, Get, Post, Body, Patch, Param, Delete, Session, Put, Query, ParseIntPipe } from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { FindBySizeDto } from './dto/find-by-size.dto';
import { FindByCouleurDto } from './dto/find-by-couleur.dto';
import { FindByIdNameDto } from './dto/find-by-Id-Name.dto';
import { RemoveSizeDto } from './dto/remove-size.dto';

@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post('create')
  create(@Session() request: Record<string, any>, @Body() createSizeDto: CreateSizeDto) {
    return this.sizeService.create(request, createSizeDto);
  }

  @Get()
  findAll() {
    return this.sizeService.findAll();
  }

  @Get('findByNameSize')
  async findByNameSize(@Query() findBySize: FindBySizeDto) {
    return await this.sizeService.findByNameSize(findBySize);
  }

  @Get('findByCouleur')
  async findByCouleur(@Query() findByCouleur: FindByCouleurDto) {
    return await this.sizeService.findByCouleur(findByCouleur);
  }

  @Get('findByNameAndId')
  async findByNameAndId(@Query() nameAndIdProduct: FindByIdNameDto) {
    return await this.sizeService.findByNameAndId(nameAndIdProduct);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sizeService.findOne(id);
  }

  @Get('findByIdSizeIdCouleur')
  findByIdSizeIdCouleur(@Query('idSize', ParseIntPipe) idSize: number, @Query('idCouleur', ParseIntPipe) idCouleur: number) {
    return this.sizeService.findByIdSizeIdCouleur(idSize, idCouleur);
  }

  @Put('update')
  update(@Session() request: Record<string, any>, @Body() updateSizeDto: UpdateSizeDto) {
    return this.sizeService.update(request, updateSizeDto);
  }

  @Delete('remove')
  remove(@Session() request: Record<string, any>, @Body() removeSizeDto: RemoveSizeDto) {
    return this.sizeService.remove(request, removeSizeDto);
  }
}
