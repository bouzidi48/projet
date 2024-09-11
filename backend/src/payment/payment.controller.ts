import { Controller, Get, Post, Body, Patch, Param, Delete, Session, Put, ParseIntPipe, Req, Res, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateCardPaymentDto } from './dto/create-payment-card.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { CreateCashPaymentDto } from './dto/create-payment-cash.dto';
import { UpdateCashPaymentDto } from './dto/update-cash-payment.dto';
import { UpdateCardPaymentDto } from './dto/update-card-payment.dto';
import Stripe from 'stripe';
import { Readable } from 'stream';
import getRawBody from 'raw-body';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('cash')
  async createCashPayment(@Body() createCashPaymentDto: CreateCashPaymentDto) {
    return await this.paymentService.createCashPayment(createCashPaymentDto);
  }
  @Post('card')
  async createCardPayment(@Body() createCardPaymentDto: CreateCardPaymentDto) {
    return await this.paymentService.createCardPayment(createCardPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id:number) {
    return this.paymentService.findOne(id);
  }

  @Put('update-cash-payment')
  updateCash( @Body() updateCashPaymentDto:UpdateCashPaymentDto) {
    return this.paymentService.updatePaymentCash(updateCashPaymentDto);
  }

  @Put('update-card-payment')
  updateCard( @Body() updateCardPaymentDto: UpdateCardPaymentDto) {
    return this.paymentService.updatePaymentCard(updateCardPaymentDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.paymentService.remove(+id);
  }
  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = this.paymentService.stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(HttpStatus.BAD_REQUEST);
    }

    await this.paymentService.handleWebhook(event);
    res.status(HttpStatus.OK).send('Received');
  }

}
