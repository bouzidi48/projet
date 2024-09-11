import { Controller, Get, Post, Body, Patch, Param, Delete, Session, Put, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { updateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get('nbOrder')
  async nbOder(@Session() request: Record<string, any>) {
    return await this.orderService.nbOrder(request);
  }
  @Get('nbOrderParYear')
  async nbOrderParYear(@Session() request: Record<string, any>) {
    return await this.orderService.nbOrderParYear(request);
  }
  @Get('nbOrderParMonth')
  async nbOrderParMonth(@Session() request: Record<string, any>) {
    return await this.orderService.nbOrderParMonth(request);
  }
  @Get('nbOrderParWeek')
  async nbOrderParWeek(@Session() request: Record<string, any>) {
    return await this.orderService.nbOrderParWeek(request);
  }
  @Get('ChiffreAffaire')
  async ChiffreAffaire(@Session() request: Record<string, any>) {
    return await this.orderService.ChiffreAffaire(request)
  }
  @Get('ChiffreAffaireParYear')
  async ChiffreAffaireParYear(@Session() request: Record<string, any>) {
    return await this.orderService.ChiffreAffaireParYear(request)
  }
  @Get('ChiffreAffaireParMonth')
  async ChiffreAffaireParMonth(@Session() request: Record<string, any>) {
    return await this.orderService.ChiffreAffaireParMonth(request)
  }
  @Get('ChiffreAffaireParWeek')
  async ChiffreAffaireParWeek(@Session() request: Record<string, any>) {
    return await this.orderService.ChiffreAffaireParWeek(request)
  }
  @Get('productsBienVendu')
  async productsBienVendu(@Session() request: Record<string, any>) {
    return await this.orderService.productsBienVendu(request)
  }
  @Get('productsMoinVendu')
  async productsMoinVendu(@Session() request: Record<string, any>) {
    return await this.orderService.productsMoinVendu(request)
  }
  @Post('create')
  create(@Session() request:Record<string, any>,@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(request,createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('listerCommandes')
  findByIdUser(@Session() request:Record<string, any>) {
    return this.orderService.findByIdUser(request);
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  

  @Put('update/:id')
  update(@Session() request:Record<string, any>,@Param('id',ParseIntPipe) id: number, @Body() updateOrderStatusDto: updateOrderStatusDto) {
    return this.orderService.update(request,id, updateOrderStatusDto);
  }

  @Put('cancel/:id')

  async cancelled(@Session() request:Record<string, any>,@Param('id',ParseIntPipe) id:number){
   return await this.orderService.cancelled(request,id)
  }

  @Delete('delete/:id')
  remove(@Session() request: Record<string, any>,@Param('id',ParseIntPipe) id: number) {
    return this.orderService.deleteOrder(request,id);
  }
  @Get('byUser/:idUser')
  findbyUser(@Param('idUser',ParseIntPipe) id: number) {
    return this.orderService.findbyUser(id);
  }
  
}
