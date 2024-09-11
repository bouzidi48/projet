import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data_source';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import {config} from 'dotenv'




import { CategoriesModule } from './categories/categories.module';


import { InscriptionModule } from './inscription/inscription.module';
import { AuthentificationModule } from './authentification/authentification.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { CouleurModule } from './couleur/couleur.module';
import { ImagesModule } from './images/images.module';
import { ProductLikeModule } from './product-like/product-like.module';
import { SizeModule } from './size/size.module';
import { Order } from './order/entities/order.entity';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';
import { DemandeAdminModule } from './demande-admin/demande-admin.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true, // Rendre les variables d'environnement accessibles globalement
    }),
    MailerModule.forRoot({
      transport:{
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
          user:process.env.EMAIL_HOST_USER,
          pass:process.env.EMAIL_HOST_PASSWORD
        },
      },
    }),
    
    CategoriesModule,
    ContactModule,
    CouleurModule,
    ReviewModule,
    InscriptionModule,
    DemandeAdminModule,
    AuthentificationModule,
    OrderModule,
    ProductModule,
   
    ImagesModule,
   
    ProductLikeModule,
   SizeModule,

  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
