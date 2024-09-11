import { HttpStatus, Inject, Injectable, Session } from '@nestjs/common';
import { CreateDemandeAdminDto } from './dto/create-demande-admin.dto';
import { UpdateDemandeAdminDto } from './dto/update-demande-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DemandeAdmin } from './entities/demande-admin.entity';
import { DemandeAdminRepository } from './demande-admin.repositoty';
import { MailerService } from '@nestjs-modules/mailer';
import { UserController } from 'src/user/user.controller';
import { RepondreContactDto } from 'src/contact/dto/repondre-contact.dto';
import { AccepterDto } from './dto/accept-demande-admin.dto';
import { DemandeAdminStatus } from 'src/enum/demande-admin-status.enum';
import { generate } from 'randomstring';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/enum/user_enum';
import { UserService } from 'src/user/user.service';
@Injectable()
export class DemandeAdminService {
  constructor(
    @InjectRepository(DemandeAdmin) private readonly demandeAdminRepository:DemandeAdminRepository,
    private readonly mailerService:MailerService,
     private readonly userController:UserService,
 
  ){}
  async create(createDemandeAdminDto: CreateDemandeAdminDto) {
    const demandeExiste = await this.demandeAdminRepository.findOne({where : {email:createDemandeAdminDto.email,nom:createDemandeAdminDto.nom}});
    if(demandeExiste) {
      return await {
        message: 'demande existe',
        statusCode:HttpStatus.CONFLICT
      }
    }
    const demande = await this.demandeAdminRepository.create(createDemandeAdminDto);
    demande.createdate=new Date();
    await this.demandeAdminRepository.save(demande);
    return {
      data: demande,
      statusCode:HttpStatus.OK,
    }
  }

  async findAll() {
    const demandes = await this.demandeAdminRepository.find();
    if(!demandes) {
      return await {
        message: 'aucune demande',
        statusCode:HttpStatus.NOT_FOUND
      }
    }
    return await {
      data: demandes,
      statusCode:HttpStatus.OK
    }
  }

  async findOne(id: number) {
    const demande = this.demandeAdminRepository.findOne({where : {id:id}});
    if(!demande) {
      return await {
        message: 'aucune demande',
        statusCode:HttpStatus.NOT_FOUND
      }
    }
    return await {
      data: demande,
      statusCode:HttpStatus.OK
    }
  }


  async sendEmailAccepter(email: string,username:string,password:string) {
    await this.mailerService.sendMail({
      to: email,
      from:process.env.EMAIL_HOST_USER,
      subject: "demande d'admin",
      text:`Cher utilisateur,

      Nous avons le plaisir de vous informer que votre demande de devenir administrateur a été acceptée. Vos informations de connexion sont les suivantes :
      Nom d'utilisateur : ${username}
      Mot de passe : ${password}

      Veuillez conserver ces informations en lieu sûr. Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à nous contacter.

      Cordialement,
      [L'équipe d'administration]`
    });
    return await {
      message: 'le message est envoyer avec succes',
      statusCode: HttpStatus.OK,
    };
  }

  async Accpeter(@Session() request: Record<string, any>,accepterDto: AccepterDto) {
    console.log(accepterDto)
    const idAdmin=request.idUser
    if(!idAdmin) {
      return await {
        message: 'vous devez vous connecter',
        statusCode:HttpStatus.UNAUTHORIZED
      }
    }
    const admin = await this.userController.findById(idAdmin);
    if(!admin || admin.data.role === Roles.USER) {
      return await {
        message: 'vous devez etre administrateur',
        statusCode:HttpStatus.UNAUTHORIZED
      }
    }
    const demande = await this.demandeAdminRepository.findOne({where : {id:accepterDto.id}});
    if(!demande) {
      return await {
        message: 'aucune demande',
        statusCode:HttpStatus.NOT_FOUND
      }
    }
    if(demande.status === DemandeAdminStatus.ACCEPT) {
      return await {
        message: 'la demande est deja acceptée',
        statusCode:HttpStatus.CONFLICT
      }
    }
    else if(demande.status === DemandeAdminStatus.REFUSE) {
      return await {
        message: 'la demande est refusee',
        statusCode:HttpStatus.CONFLICT
      }
    }
    const user = await this.userController.findByUsernameAndEmail({username:demande.nom,email:demande.email});
    if(user.data) {
      demande.status = DemandeAdminStatus.ACCEPT;
      await this.demandeAdminRepository.save(demande);
      const update = await this.userController.updateRole({id:user.data.id,role:Roles.ADMIN});
      console.log(update)
      return await this.sendEmailAccepter(demande.email,demande.nom,user.data.password);
    }
    const usernameExist = await this.userController.findByUserName({username:demande.nom});
    const emailExist = await this.userController.findByEmail({email:demande.email});
    if(usernameExist.data || emailExist.data) {
      return await {
        message: 'l\'utilisateur avec ce nom d\'utilisateur ou ce courriel existe',
        statusCode:HttpStatus.NOT_FOUND
      }
      
    }
    
    demande.status = DemandeAdminStatus.ACCEPT;
    await this.demandeAdminRepository.save(demande);
    const password = await generate({
      length: 8,
      charset: 'numeric',
    });
    const saltRounds = 10;
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await this.userController.createAdmin({username:demande.nom,email:demande.email,password:hashedPassword});

    return await this.sendEmailAccepter(demande.email,demande.nom,password);

  }

  async sendEmailRefuser(email: string,username:string) {
    await this.mailerService.sendMail({
      to: email,
      from:process.env.EMAIL_HOST_USER,
      subject: "demande d'admin",
      text:`Cher ${username},

Nous vous remercions pour votre demande de devenir administrateur. Malheureusement, nous ne pouvons pas accepter votre demande à cette époque.

Nous comprenons que vous souhaitez jouer un rôle plus important dans notre communauté, mais nous devons nous assurer que nous avons les ressources et les capacités nécessaires pour accorder cette autorité.

Nous vous invitons de revenir vers nous à l'avenir si vous souhaitez réitérer votre demande. Nous restons à votre disposition pour discuter de vos qualifications et de vos intérêts.

Cordialement,
[L'équipe d'administration]`
    });
    return await {
      message: 'le message est envoyer avec succes',
      statusCode: HttpStatus.OK,
    };
  }

  async Refuser(@Session() request: Record<string, any>,refuserDto: AccepterDto) {
    console.log(refuserDto)
    const idAdmin=request.idUser
    if(!idAdmin) {
      return await {
        message: 'vous devez vous connecter',
        statusCode:HttpStatus.UNAUTHORIZED
      }
    }
    const admin = await this.userController.findById(idAdmin);
    if(!admin || admin.data.role === Roles.USER) {
      return await {
        message: 'vous devez etre administrateur',
        statusCode:HttpStatus.UNAUTHORIZED
      }
    }
    const demande = await this.demandeAdminRepository.findOne({where : {id:refuserDto.id}});
    if(!demande) {
      return await {
        message: 'aucune demande',
        statusCode:HttpStatus.NOT_FOUND
      }
    }
    if(demande.status === DemandeAdminStatus.REFUSE) {
      return await {
        message: 'la demande est deja refusee',
        statusCode:HttpStatus.CONFLICT
      }
    }
    else if(demande.status === DemandeAdminStatus.ACCEPT) {
      return await {
        message: 'la demande est acceptée',
        statusCode:HttpStatus.CONFLICT
      }
    }
    demande.status = DemandeAdminStatus.REFUSE;
    await this.demandeAdminRepository.save(demande);
    
    return await this.sendEmailRefuser(demande.email,demande.nom);

  }
}
