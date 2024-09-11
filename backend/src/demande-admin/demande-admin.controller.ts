import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Session } from '@nestjs/common';
import { DemandeAdminService } from './demande-admin.service';
import { CreateDemandeAdminDto } from './dto/create-demande-admin.dto';
import { UpdateDemandeAdminDto } from './dto/update-demande-admin.dto';
import { AccepterDto } from './dto/accept-demande-admin.dto';

@Controller('demande-admin')
export class DemandeAdminController {
  constructor(private readonly demandeAdminService: DemandeAdminService) {}

  @Post('create')
  create(@Body() createDemandeAdminDto: CreateDemandeAdminDto) {
    return this.demandeAdminService.create(createDemandeAdminDto);
  }

  @Get()
  findAll() {
    return this.demandeAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.demandeAdminService.findOne(id);
  }

  @Post('accepter')
  accepter(@Session() request: Record<string, any>,@Body() accepterDto:AccepterDto) {
    return this.demandeAdminService.Accpeter(request,accepterDto);
  }
  @Post('refuser')
  refuser(@Session() request: Record<string, any>,@Body() accepterDto:AccepterDto) {
    return this.demandeAdminService.Refuser(request,accepterDto);
  }
}
