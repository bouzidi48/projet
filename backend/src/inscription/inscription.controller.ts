import { Controller, Get, Post, Body, Patch, Param, Delete, Session } from '@nestjs/common';
import { InscriptionService } from './inscription.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserVerifyDto } from './dto/verify-user.dto';


@Controller('inscription')
export class InscriptionController {
  constructor(private readonly inscriptionService: InscriptionService) {}
  @Post('signup')
  async signup(@Session() request:Record<string, any>,@Body() signupUserDto: UserSignUpDto) {
    return await this.inscriptionService.signup(request,signupUserDto);
  }
  @Post('verifierInscription')
  async verfierInscription(@Session() request:Record<string, any>,@Body() code: UserVerifyDto) {
    return await this.inscriptionService.verfierInscription(request,code);
  }
  
}
