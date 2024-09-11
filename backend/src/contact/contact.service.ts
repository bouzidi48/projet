import { HttpStatus, Inject, Injectable, Session } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { ContactRepository } from './contact.repository';
import { UserController } from 'src/user/user.controller';
import { RepondreContactDto } from './dto/repondre-contact.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact) private readonly contactRepository:ContactRepository,
    private readonly mailerService:MailerService,
     private readonly userController:UserService,
 
  ){}
  async create( createContactDto: CreateContactDto) {
    console.log("hhh")
    const contact = await this.contactRepository.create(createContactDto);
    console.log(contact)
    contact.createdAt=new Date();
    await this.contactRepository.save(contact);
    return {
      data: contact,
      statusCode:HttpStatus.OK,
    }
  }

  async findAll() {
    const contacts = await this.contactRepository.find();
    if(!contacts) {
      return await {
        message: 'aucun contact',
        statusCode:HttpStatus.NOT_FOUND
      }
    }
    return await {
      data: contacts,
      statusCode:HttpStatus.OK
    }
  }

  async findOne(id: number) {
    const contact = await this.contactRepository.findOne({where : {id:id}});
    if(!contact) {
      return await {
        message: 'aucun contact',
        statusCode:HttpStatus.NOT_FOUND
      }
    }
    return await {
      data: contact,
      statusCode:HttpStatus.OK
    }
  }

  async sendEmail(repondreContactDto: RepondreContactDto) {
    await this.mailerService.sendMail({
      to: repondreContactDto.email,
      from:process.env.EMAIL_HOST_USER,
      subject: 'Repondre a un contact',
      text:repondreContactDto.message,
    });
    return await {
      message: 'le message est envoyer avec succes',
      statusCode: HttpStatus.OK,
    };
  }

  async repondre(repondreContactDto: RepondreContactDto) {
    console.log("hhh")
    console.log("hadi repondre")
    console.log(repondreContactDto)
    const contact = await this.contactRepository.findOne({where : {id:repondreContactDto.id_contact}});
    if(!contact) {
      return await {
        message: 'aucun contact',
        statusCode:HttpStatus.NOT_FOUND
      }
    }
    return await this.sendEmail(repondreContactDto);

  }
  

  
}
