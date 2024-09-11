import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, Session } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserPasswordOublierDto } from './dto/password-oublier.dto';
import { UserVerifyDto } from './dto/verify-user.dto';
import { UpdatePasswordDto } from './dto/modifier-password.dto';
import { Request } from 'express';


@Controller('authentification')
export class AuthentificationController {
  constructor(private readonly authentificationService: AuthentificationService) {}

  @Post('login')
  async login(@Session() session2: Record<string, any>,@Body() userLoginDto: UserLoginDto) {
    return await this.authentificationService.login(session2,userLoginDto);
  }

  @Post('logout')
  async logout() {
    return await this.authentificationService.logout();
  }

  @Post('forgotPassword')
  async forgotPassword(@Session() request:Record<string, any>,@Body() userPasswordOublierDto: UserPasswordOublierDto) {
    return await this.authentificationService.forgotPassword(request,userPasswordOublierDto);
  }
  @Post('verifierPasswordOublier')
  async verfierPasswordOublier(@Session() request:Record<string, any>,@Body() code: UserVerifyDto) {
    return await this.authentificationService.verifierPasswordOublier(request,code);
  }

  @Put('modifierPassword')
  async modifierPassword(@Session() request:Record<string, any>,@Body() passDto:UpdatePasswordDto) {
    return await this.authentificationService.modifierPassword(request,passDto)
  }
}
