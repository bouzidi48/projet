import { HttpStatus, Inject, Injectable, Session } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { MailerService } from '@nestjs-modules/mailer';

import * as bcrypt from 'bcrypt';
import { generate } from 'randomstring';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserVerifyDto } from './dto/verify-user.dto';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';

@Injectable()
export class InscriptionService {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService:MailerService,
  ) {}

  async signup(@Session() request:Record<string, any>,userSignUpDto: UserSignUpDto) {
    const existingEmail = await this.userService.findByEmail({email:userSignUpDto.email});
    console.log(existingEmail);
    const existingUser = await this.userService.findByUserName({username:userSignUpDto.username});
    console.log(existingUser);
    if (existingEmail.data || existingUser.data) {
      return await {
        message: 'Email ou username déjà existe',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    
    // Hash the password
    const saltRounds = 10;
    
    const hashedPassword = await bcrypt.hash(userSignUpDto.password, saltRounds);
    
    // Replace the plain password with the hashed password
    const userWithHashedPassword = { ...userSignUpDto, password: hashedPassword };
  
    const codeConfirmation = await generate({
      length: 6,
      charset: 'numeric',
    });
    console.log(typeof(codeConfirmation));
    console.log(userSignUpDto);
    console.log(typeof(userSignUpDto));
    
    request.code = codeConfirmation; // Utilisez req.session.code pour stocker le code de confirmation
    request.user = userWithHashedPassword; // Utilisez req.session.user pour stocker les données de l'utilisateur
    console.log(request.code, codeConfirmation);
    console.log(request.user);
    
    return await this.sendEmail(codeConfirmation, userSignUpDto.email);
  }

  async sendEmail(code:string,email:string) {
    await this.mailerService.sendMail({
      to: email,
      from:process.env.EMAIL_HOST_USER,
      subject: 'code de confirmation',
      text:'le code de confirmation est '+code,
    });
    return await {
      message: 'le code est envoyer avec succes',
      statusCode: HttpStatus.OK,
    };
  }

  async verfierCode(@Session() request:Record<string, any>,codeDto:UserVerifyDto) {
    console.log(codeDto)
    console.log(request.code)
    console.log(request.code,codeDto.code)
    if (request.code === codeDto.code) {
      return await true;
    }
    return await false;
  }



  async verfierInscription(@Session() request:Record<string, any>,codeDto:UserVerifyDto) {
    const verifier = await this.verfierCode(request,codeDto)
    if (verifier === true) {
      const userSignUpDto = request.user
      console.log(userSignUpDto)
      this.userService.create(userSignUpDto);
      return await {
        message: 'Bienvenue dans notre application',
        statusCode: HttpStatus.OK,
      };
    }
    return await {
      message: 'code incorrect',
      statusCode: HttpStatus.BAD_REQUEST,
    };
  }
}
