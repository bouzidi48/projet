import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Put, Session, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';

import { User } from './entities/user.entity';

import { UpdatePasswordDto } from './dto/modifier-password.dto';
import { UserNameUpdateDto } from './dto/update-username.dto';
import { AncienPasswordDto } from './dto/ancien-password.dto';
import { AncienUsernameDto } from './dto/ancien-username.dto';
import { UserCreateDto } from './dto/create-user.dto';

import { FindByEmail } from './dto/find-email.dto';
import { FindByUsername } from './dto/find-username.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { FindByUsernameByEmail } from './dto/find-username-email.dto';
import { Roles } from 'src/enum/user_enum';
import { RoleUpdateDto } from './dto/updaterole.dto';
import { request } from 'http';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('nbUserParMonth')
  async nbUserParMonth(@Session() request:Record<string,any>) {
    return await this.userService.nbUserParMonth(request);
  }
  @Get('nbUserParYear')
  async nbUserParYear(@Session() request:Record<string,any>) {
    return await this.userService.nbUserParYear(request);
  }
  @Get('nbUser')
  async nbUser(@Session() request:Record<string,any>) {
    return await this.userService.nbUser(request);
  }
  
  
  @Get('nbUserParWeek')
  async nbUserParWeek(@Session() request:Record<string,any>) {
    return await this.userService.nbUserParWeek(request);
  }
  @Post('ancienPassword')
  async ancienPassword(@Session() request: Record<string, any>, @Body() password: AncienPasswordDto) {
    return await this.userService.ancienPassword(request, password);
  }

  @Put('updatePassword')
  async updatePassword(@Session() request: Record<string, any>, @Body() updatePasswordDto: UpdatePasswordDto) {
    return await this.userService.updatePassword(request, updatePasswordDto);
  }

  @Post('ancienUsername')
  async ancienUsername(@Session() request: Record<string, any>, @Body() username: AncienUsernameDto) {
    return await this.userService.ancienUsername(request, username);
  }

  @Put('updateUsername')
  async updateUsername(@Session() request: Record<string, any>, @Body() updateUsername: UserNameUpdateDto) {
    return await this.userService.updateUsername(request, updateUsername);
  }

  @Post('create')
  async create(@Body() createUserDto: UserCreateDto) {
    return await this.userService.create(createUserDto);
  }

  @Get('single/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findById(id);
  }

  @Get('byEmail')
  async findByEmail(@Query() email: FindByEmail) {
    return await this.userService.findByEmail(email);
  }

  @Get('byUserName')
  async findByUserName(@Query() username: FindByUsername) {
    return await this.userService.findByUserName(username);
  }

  @Put('update')
  async update(@Body() user: User, @Body() updateUserDto: UserUpdateDto) {
    return await this.userService.update(user, updateUserDto);
  }

  @Post('createAdmin')
  async createAdmin(@Body() createUserDto: UserCreateDto) {
    return await this.userService.createAdmin(createUserDto);
  }

  @Get('findbyUsernameEmail')
  async findByUsernameEmail(@Query() usernameEmail: FindByUsernameByEmail) {
    return await this.userService.findByUsernameAndEmail(usernameEmail);
  }

  @Put('updateAdmin')
  async updateAdmin(@Body() updateRole: RoleUpdateDto) {
    return await this.userService.updateRole(updateRole);
  }
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
  @Delete('/delete/:id')
  async remove(@Session() request: Record<string, any>,@Param('id', ParseIntPipe) id: number) {
    return await this.userService.delete(request,id);
  }
  
}
