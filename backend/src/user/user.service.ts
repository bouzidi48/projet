import { forwardRef, HttpStatus, Inject, Injectable, NotFoundException, Session } from '@nestjs/common';

import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { startOfMonth, startOfWeek, subWeeks } from 'date-fns';




import { UserRepository } from './user.repository';

import { UpdatePasswordDto } from './dto/modifier-password.dto';
import { UserNameUpdateDto } from './dto/update-username.dto';
import * as bcrypt from 'bcrypt';
import { AncienPasswordDto } from './dto/ancien-password.dto';
import { AncienUsernameDto } from './dto/ancien-username.dto';
import { UserCreateDto } from './dto/create-user.dto';

import { FindByEmail } from './dto/find-email.dto';
import { FindByUsername } from './dto/find-username.dto';
import { UserUpdateDto } from './dto/update-user.dto';

import { Roles } from 'src/enum/user_enum';
import { FindByUsernameByEmail } from './dto/find-username-email.dto';
import dataSource from 'db/data_source';
import { RoleUpdateDto } from './dto/updaterole.dto';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { ReviewRepository } from 'src/review/review.repository';
import { Order } from 'src/order/entities/order.entity';
import { OrderRepository } from 'src/order/order.repository';
import { OrderService } from 'src/order/order.service';
import { CouleurService } from 'src/couleur/couleur.service';
import { ProductService } from 'src/product/product.service';
import { CategoriesService } from 'src/categories/categories.service';



@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: UserRepository,
    @InjectRepository(ReviewEntity) private reviewRepository: ReviewRepository,
    private readonly couleurService: CouleurService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoriesService,
  ) { }

  async nbUser(@Session() request: Record<string, any>) {
    const idUser = request.idUser;
    console.log(idUser)

    if (!idUser) {
      return {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    const user = await this.userRepository.findOne({ where: { id: idUser } });
    console.log(user)
    if (!user || user.role !== Roles.ADMIN && user.role !== Roles.SUPERADMIN) {
      return {
        data: null,
        statusCode: HttpStatus.FORBIDDEN, // On retourne FORBIDDEN si l'utilisateur n'a pas les droits nécessaires
      };
    }

    // Compter le nombre total d'utilisateurs
    const userCount = await this.userRepository.count({
      where: [
        { role: Roles.USER },
        { role: Roles.ADMIN },
        { role: Roles.SUPERADMIN },
      ],
    });
    console.log(userCount)
    return {
      data: userCount,
      statusCode: HttpStatus.OK,
    };
  }
  async nbUserParYear(@Session() request: Record<string, any>) {
    const idUser = request.idUser;
    console.log(idUser);
  
    if (!idUser) {
      return {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  
    const user = await this.userRepository.findOne({ where: { id: idUser } });
    console.log(user);
    if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.SUPERADMIN)) {
      return {
        data: null,
        statusCode: HttpStatus.FORBIDDEN, // On retourne FORBIDDEN si l'utilisateur n'a pas les droits nécessaires
      };
    }
  
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
  
    // Regrouper les utilisateurs par année de création et les compter pour l'année courante et l'année précédente
    const userCountsByYear = await this.userRepository
      .createQueryBuilder("user")
      .select("EXTRACT(YEAR FROM user.createdate) AS year")
      .addSelect("COUNT(user.id)", "count")
      .where("EXTRACT(YEAR FROM user.createdate) IN (:...years)", { years: [currentYear, previousYear] })
      .andWhere("user.role IN (:...roles)", { roles: [Roles.USER, Roles.ADMIN, Roles.SUPERADMIN] })
      .groupBy("year")
      .orderBy("year", "ASC")
      .getRawMany();
  
    console.log(userCountsByYear);
  
    // Initialiser les résultats avec 0 par défaut
    const result = {
      [currentYear]: 0,
      [previousYear]: 0,
    };
  
    // Remplir les données si elles existent
    userCountsByYear.forEach((entry) => {
      result[entry.year] = parseInt(entry.count, 10); // Convertir en nombre
    });
  
    return {
      data: result,
      statusCode: HttpStatus.OK,
    };
  }
  
  async nbUserParMonth(@Session() request: Record<string, any>) {
    const idUser = request.idUser;
    console.log(idUser);
  
    if (!idUser) {
      return {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  
    const user = await this.userRepository.findOne({ where: { id: idUser } });
    console.log(user);
    if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.SUPERADMIN)) {
      return {
        data: null,
        statusCode: HttpStatus.FORBIDDEN, // On retourne FORBIDDEN si l'utilisateur n'a pas les droits nécessaires
      };
    }
  
    // Date actuelle (mois courant)
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Les mois en JS commencent à 0, donc on ajoute 1
  
    // Date pour 3 mois avant le mois courant
    const startDate = new Date(currentYear, currentMonth - 4, 1); // Premier jour du mois, 3 mois avant
  
    // Regrouper les utilisateurs par mois pour les 3 mois précédents + mois courant
    const userCountsByMonth = await this.userRepository
      .createQueryBuilder("user")
      .select("EXTRACT(MONTH FROM user.createdate) AS month")
      .addSelect("EXTRACT(YEAR FROM user.createdate) AS year")
      .addSelect("COUNT(user.id)", "count")
      .where("user.createdate >= :startDate", { startDate: startDate })
      .andWhere("user.role IN (:...roles)", { roles: [Roles.USER, Roles.ADMIN, Roles.SUPERADMIN] })
      .groupBy("year, month")
      .orderBy("year", "ASC")
      .addOrderBy("month", "ASC")
      .getRawMany();
  
    console.log(userCountsByMonth);
  
    // Initialiser les résultats pour les 3 mois précédents et le mois en cours avec total = 0 par défaut
    const result = {};
    for (let i = 3; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i - 1); // Calculer le mois et l'année
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // +1 pour que janvier = 1, février = 2, etc.
      result[`${year}-${month}`] = 0; // Initialiser chaque mois avec 0
    }
  
    // Mettre à jour les résultats avec les données récupérées
    userCountsByMonth.forEach((entry) => {
      const key = `${entry.year}-${entry.month}`;
      result[key] = parseInt(entry.count, 10); // Convertir en nombre
    });
  
    return {
      data: result,
      statusCode: HttpStatus.OK,
    };
  }
  
  
  async nbUserParWeek(@Session() request: Record<string, any>) {
    const idUser = request.idUser;
    console.log(idUser);
  
    if (!idUser) {
      return {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  
    const user = await this.userRepository.findOne({ where: { id: idUser } });
    console.log(user);
    if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.SUPERADMIN)) {
      return {
        data: null,
        statusCode: HttpStatus.FORBIDDEN, // On retourne FORBIDDEN si l'utilisateur n'a pas les droits nécessaires
      };
    }
  
    // Date actuelle
    const currentDate = new Date();
    console.log(currentDate);
  
    // Calculer la date de début (5 jours avant la date actuelle)
    const startOfLast5Days = new Date();
    startOfLast5Days.setDate(currentDate.getDate() - 5);
    console.log(startOfLast5Days);
  
    // Filtrer les utilisateurs créés entre le début des 5 derniers jours et aujourd'hui
    const userCountsByDay = await this.userRepository
      .createQueryBuilder("user")
      .select("EXTRACT(YEAR FROM user.createdate) AS year")
      .addSelect("EXTRACT(MONTH FROM user.createdate) AS month")
      .addSelect("EXTRACT(DAY FROM user.createdate) AS day")
      .addSelect("COUNT(user.id)", "count")
      .where("user.createdate BETWEEN :start AND :end", {
        start: startOfLast5Days,
        end: currentDate,
      })
      .andWhere("user.role IN (:...roles)", { roles: [Roles.USER, Roles.ADMIN, Roles.SUPERADMIN] })
      .groupBy("year, month, day")
      .orderBy("year", "ASC")
      .addOrderBy("month", "ASC")
      .addOrderBy("day", "ASC")
      .getRawMany();
  
    console.log(userCountsByDay);
  
    // Initialiser les résultats avec 0 pour les 5 jours précédents
    const result = {};
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Les mois commencent à 0 en JS
      const day = date.getDate();
  
      result[`${year}-${month}-${day}`] = 0; // Initialiser chaque jour avec 0
    }
  
    // Mettre à jour les résultats avec les données récupérées
    userCountsByDay.forEach((entry) => {
      const key = `${entry.year}-${entry.month}-${entry.day}`;
      result[key] = parseInt(entry.count, 10); // Mettre à jour le total pour chaque jour
    });
  
    return {
      data: result,
      statusCode: HttpStatus.OK,
    };
  }
  
  



  async ancienPassword(@Session() request: Record<string, any>, password: AncienPasswordDto) {
    const id = request.idUser
    console.log(id)
    const user = await this.userRepository.findOne({ where: { id: id } });
    console.log(user)
    const validPassword = await bcrypt.compare(password.password, user.password);
    console.log(validPassword)
    if (!validPassword) {
      return await {
        message: 'ancien mot de passe incorrect',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    return await {
      message: 'ancien mot de passe correct',
      statusCode: HttpStatus.OK,
    };
  }

  async updatePassword(@Session() request: Record<string, any>, updateDto: UpdatePasswordDto) {
    const confirmpassword = updateDto.confirmpassword
    const password = updateDto.password
    const id = request.idUser
    console.log(id)
    console.log(confirmpassword)
    console.log(password)
    console.log(confirmpassword == password)
    if (confirmpassword == password) {
      const user = await this.userRepository.findOne({ where: { id: id } });
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updateDto.password, saltRounds);
      console.log(typeof (user))
      user.password = hashedPassword;
      user.updatedate = new Date();
      this.userRepository.save(user);
      return await {
        message: 'le mot de passe modifier avec succes ,vous devez vous connecter avec votre nouveau mot de passe',
        statusCode: HttpStatus.OK,
      };
    }
    return await {
      message: 'Password != ConfirmPassword',
      statusCode: HttpStatus.BAD_REQUEST,
    };
  }

  async ancienUsername(@Session() request: Record<string, any>, username: AncienUsernameDto) {
    const id = request.idUser
    const user = await this.userRepository.findOne({ where: { id: id } });
    const validUsername = await (user.username === username.username);
    if (!validUsername) {
      return await {
        message: 'ancien username incorrect',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    return await {
      message: 'ancien username correct',
      statusCode: HttpStatus.OK,
    };
  }

  async updateUsername(@Session() request: Record<string, any>, updateUsername: UserNameUpdateDto) {
    const user = await this.userRepository.findOne({ where: { username: updateUsername.username } });
    console.log(user)
    console.log(request.idUser)


    if (!user) {
      const id = request.idUser
      if (!id) {
        return await {
          message: 'user not found',
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
      const currentUser = await this.userRepository.findOne({ where: { id: id } });
      currentUser.username = updateUsername.username;
      currentUser.updatedate = new Date();
      console.log(currentUser)
      this.userRepository.save(currentUser);
      return await {
        message: 'Username modifier avec succés,vous devez vous connecter avec votre nouveau username',
        statusCode: HttpStatus.OK,
      };
    }
    return await {
      message: 'user deja existe',
      statusCode: HttpStatus.BAD_REQUEST,
    }
  }


  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: user,
      statusCode: HttpStatus.OK
    };
  }

  async create(createUserDto: UserCreateDto) {
    const user = this.userRepository.create({ ...createUserDto, createdate: new Date() });
    this.userRepository.save(user);
  }
  async findById(find: number) {
    const user = await this.userRepository.findOne({ where: { id: find } });
    if (!user) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: user,
      statusCode: HttpStatus.OK
    };
  }
  async findByEmail(find: FindByEmail) {
    const user = await this.userRepository.findOne({ where: { email: find.email } });
    if (!user) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: user,
      statusCode: HttpStatus.OK
    };
  }
  async findByUserName(find: FindByUsername) {
    const user = await this.userRepository.findOne({ where: { username: find.username } });
    if (!user) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: user,
      statusCode: HttpStatus.OK
    };
  }

  async update(user: User, updateUserDto: UserUpdateDto) {
    const user1 = await this.userRepository.findOne({ where: { id: user.id } });
    console.log("user1",user1)
    user1.password = updateUserDto.password;
    user1.username = updateUserDto.username;
    user1.updatedate = new Date();
    const user2 = await this.userRepository.save(user1);
    console.log("user2",user2)

  }

  async createAdmin(createUserAdminDto: UserCreateDto) {
    const user = this.userRepository.create(createUserAdminDto);
    user.role = Roles.ADMIN;
    user.createdate = new Date();
    this.userRepository.save(user);
  }

  async findByUsernameAndEmail(find: FindByUsernameByEmail) {
    const user = await this.userRepository.findOne({ where: { email: find.email, username: find.username } });
    if (!user) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: user,
      statusCode: HttpStatus.OK
    };
  }
  async updateRole(updateRole: RoleUpdateDto) {
    console.log(updateRole)
    const user1 = await this.userRepository.findOne({ where: { id: updateRole.id } });
    if (!user1) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    if (updateRole.role === Roles.ADMIN) {
      user1.role = Roles.ADMIN;
    }
    else if (updateRole.role === Roles.USER) {
      user1.role = Roles.USER;
    }

    user1.updatedate = new Date();
    this.userRepository.save(user1);
    return {
      data: user1,
      statusCode: HttpStatus.OK
    }
  }
  async findAll() {
    const users = await this.userRepository.find();
    if (!users) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: users,
      statusCode: HttpStatus.OK
    };
  }
  async delete(@Session() request: Record<string, any>, id: number) {
    const idAdmin = request.idUser;
    console.log(idAdmin)

    if (!idAdmin) {
      console.log("slaut")
      return await {
        data: null,
        message: "vous devez vous connecter pour supprimer un user",
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const admin = await this.userRepository.findOne({ where: { id: idAdmin } })
    if (!admin || admin.role != Roles.SUPERADMIN) {
      return await {
        data: null,
        message: "vous devez etre un superadmin",
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const user = await this.userRepository.findOne({ where: { id: id }, relations: ['review', 'orders', 'products', 'categories'] });
    console.log(user)
    if (!user) {
      return await {
        data: null,
        message: "user introuvable",
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    if (user.review.length > 0) {
      for (const review of user.review) {
        await this.reviewRepository.remove(review)
      }
    }
    if (user.orders.length > 0) {
      for (const order of user.orders) {
        await this.orderService.deleteOrder(request, order.id)
      }
    }
    if (user.products.length > 0) {
      for (const product of user.products) {
        const product1 = await this.productService.findById(product.id)
        const couleurs = []
        for (const couleur of product1.data.colours) {
          const couleur1 = await this.couleurService.findOne(couleur.id)
          console.log("salut")
          console.log(couleur1.data)
          const listeimages = couleur1.data.images
          const listsizes = couleur1.data.sizes
          console.log(listeimages)
          console.log(listsizes)
          const listeimage = []
          const listsize = []
          if (listeimages.length > 0) {
            for (const image of listeimages) {
              listeimage.push({ urlImage: image.UrlImage, nomCategorie: null, nameCouleur: couleur.nameCouleur })
            }
          }
          if (listsizes.length > 0) {
            for (const size of listsizes) {
              listsize.push({ typeSize: size.typeSize, nameCouleur: couleur.nameCouleur })
            }
          }
          couleurs.push({ nameCouleur: couleur.nameCouleur, listeimage: listeimage, listesize: listsize, nameProduct: couleur1.data.product.nameProduct })
        }
        const supprimer = await this.productService.remove(request, { id: product.id, listeCouleur: couleurs })
        console.log("salut1")
        console.log(supprimer)
      }
    }
    if (user.categories.length > 0) {
      for (const category of user.categories) {
        const category1 = await this.categoryService.findOne(category.id)
        if (category1.data.image) {
          await this.categoryService.remove(request, category1.data.id)
        }
        else {
          await this.categoryService.remove(request, category1.data.id)
        }
      }
    }
    await this.userRepository.remove(user);
    return await {
      data: user,
      message: "user supprime avec succes",
      statusCode: HttpStatus.OK
    };
  }

}
