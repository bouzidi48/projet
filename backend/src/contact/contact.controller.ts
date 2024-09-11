import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { RepondreContactDto } from './dto/repondre-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('create')
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.contactService.findOne(id);
  }

  @Post('sendmail')
  sendEmail(@Body() repondreContactDto: RepondreContactDto) {
    return this.contactService.sendEmail(repondreContactDto);
  }

  @Post('repondre')
  repondre(@Body() repondreContactDto: RepondreContactDto) {
    return this.contactService.repondre(repondreContactDto);
  }
}
