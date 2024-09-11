import { forwardRef, HttpStatus, Inject, Injectable, Session } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageRepository } from './image.repository';
import { UserService } from 'src/user/user.service';
import { CouleurService } from 'src/couleur/couleur.service';
import { Roles } from 'src/enum/user_enum';
import { FindByImageDto } from './dto/find-by-Image.dto';
import { FindByCouleurDto } from './dto/find-by-couleur.dto';
import { FindByIdNameDto } from './dto/find-by-Id-Name.dto';
import { RemoveImageDto } from './dto/remove-image.dto';
import { Images } from './entities/image.entity';
import { UserController } from 'src/user/user.controller';
import { CouleurController } from 'src/couleur/couleur.controller';
import { CreateImageCategoryDto } from './dto/create-image-category.dto';
import { CategoriesService } from 'src/categories/categories.service';

import { UpdateImageCategoryDto } from './dto/update-image-category.dto';
import { FindByCategorieDto } from './dto/find-by-category.dto';

@Injectable()
export class ImagesService {
  constructor(@InjectRepository(Images) private readonly imageRepository: ImageRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly couleurService: CouleurService,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoryService: CategoriesService
  ) { }
  async create_product(@Session() request: Record<string, any>, createImageDto: CreateImageDto) {
    const idAdmin = request.idUser
    console.log(idAdmin)
    if (!idAdmin) {
      return await {
        message: 'vous devez vous connecter pour ajouter une image',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const admin = await this.userService.findById(idAdmin)
    if (!admin || admin.data.role === Roles.USER) {
      return await {
        message: 'vous devez etre un admin',
        statusCode: HttpStatus.BAD_REQUEST,

      }
    }
    const image1 = await this.imageRepository.findOne({ where: { UrlImage: createImageDto.UrlImage, couleur: { nameCouleur: createImageDto.nameCouleur, product:{nameProduct:createImageDto.nameProduct} } } });
    console.log(image1)
    if (image1) {
      return await {
        message: 'cette image existe deja dans se produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const couleur = await this.couleurService.findByNameAndId({ id: idAdmin, nameCouleur: createImageDto.nameCouleur, nameProduct: createImageDto.nameProduct })
    if (!couleur) {
      return await {
        message: 'cette couleur n\'existe pas ou vous n\'etes pas l\'admin de ce produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    const image = await this.imageRepository.create(createImageDto);
    image.addedBy = admin.data;
    image.createdate = new Date();
    image.couleur = couleur.data;
    await this.imageRepository.save(image);
    return await {
      data: image,
      statusCode: HttpStatus.OK,
    }
  }

  async create_category(@Session() request: Record<string, any>, createImageDto: CreateImageCategoryDto) {
    const idAdmin = request.idUser
    console.log(idAdmin)
    if (!idAdmin) {
      return await {
        message: 'vous devez vous connecter pour ajouter une image',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const admin = await this.userService.findById(idAdmin)
    if (!admin || admin.data.role === Roles.USER) {
      return await {
        message: 'vous devez etre un admin',
        statusCode: HttpStatus.BAD_REQUEST,

      }
    }
    const image1 = await this.imageRepository.findOne({ where: { UrlImage: createImageDto.UrlImage, category: { nameCategory: createImageDto.nameCategorie } } });
    console.log(image1)
    if (image1) {
      return await {
        message: 'cette image existe deja dans se produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const categorie = await this.categoryService.findByIdAndName({ id: idAdmin, nameCategory: createImageDto.nameCategorie })
    if (!categorie) {
      return await {
        message: 'cette couleur n\'existe pas ou vous n\'etes pas l\'admin de ce produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    const image = await this.imageRepository.create(createImageDto);
    image.addedBy = admin.data;
    image.createdate = new Date();
    image.category = categorie.data;
    await this.imageRepository.save(image);

    return await {
      data: image,
      statusCode: HttpStatus.OK,
    }
  }

  async findAll() {
    const image = await this.imageRepository.find();
    if (image.length == 0) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      message: image,
      statusCode: HttpStatus.OK,
    }
  }

  async findByNameImage(url: FindByImageDto) {
    const image = await this.imageRepository.find({ where: { UrlImage: url.urlImage } });
    if (image.length == 0) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      message: image,
      statusCode: HttpStatus.OK,
    }
  }

  async findByCategory(nameCategory: FindByCategorieDto) {
    const category = await this.categoryService.findByName({ nameCategory: nameCategory.nameCategory });
    if (!category) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const images = await this.imageRepository.find({ where: { category: { id: category.data.id } } });
    if (images.length == 0) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      message: images,
      statusCode: HttpStatus.OK,
    }
  }

  async findByCouleur(nameCategory: FindByCouleurDto) {
    const couleur = await this.couleurService.findByNameCouleur({ nameCouleur: nameCategory.nameCouleur })
    if (!couleur) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    const images = await this.imageRepository.find({ where: { couleur: { id: couleur.data.id } } });
    if (images.length == 0) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      message: images,
      statusCode: HttpStatus.OK,
    }
  }

  async findByNameAndId(nameProduct: FindByIdNameDto) {
    const user = await this.userService.findById(nameProduct.id);
    if (!user) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    if (user.data.role === Roles.USER) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    if (user.data.role === Roles.SUPERADMIN) {
      if (nameProduct.nameCouleur) {


        const image = await this.imageRepository.findOne({ where: { UrlImage: nameProduct.urlImage, couleur: { nameCouleur: nameProduct.nameCouleur } } });
        if (!image) {
          return await {
            data: null,
            statusCode: HttpStatus.BAD_REQUEST,
          }
        }
        return await {
          data: image,
          statusCode: HttpStatus.OK,
        }
      }
      if (nameProduct.nomCategorie) {

        const image = await this.imageRepository.findOne({ where: { UrlImage: nameProduct.urlImage, category: { nameCategory: nameProduct.nomCategorie } } });
        if (!image) {
          return await {
            data: null,
            statusCode: HttpStatus.BAD_REQUEST,
          }
        }
        return await {
          data: image,
          statusCode: HttpStatus.OK,
        }
      }
    }
    const image = await this.imageRepository.findOne({ where: { UrlImage: nameProduct.urlImage, addedBy: { id: nameProduct.id } } });
    if (!image) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: image,
      statusCode: HttpStatus.OK,
    }
  }

  async findOne(id: number) {
    const image = await this.imageRepository.findOne({ where: { id: id } });
    if (!image) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      message: image,
      statusCode: HttpStatus.OK,
    }
  }

  async update_product(@Session() request: Record<string, any>, updateCouleurDto: UpdateImageDto) {
    const idAdmin = request.idUser
    if (!idAdmin) {
      return await {
        message: 'vous devez vous connecter',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const admin = await this.userService.findById(idAdmin)
    if (!admin || admin.data.role === Roles.USER) {
      return {
        message: 'vous devez etre un admin',
        statusCode: HttpStatus.BAD_REQUEST,

      }
    }
    const image1 = await this.imageRepository.findOne({ where: { id: updateCouleurDto.id } });
    if(!image1){
      return await {
        message: 'cette image n\'existe pas',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const image = await this.findByNameAndId({ id: idAdmin, urlImage: image1.UrlImage, nameCouleur: updateCouleurDto.nameCouleur, nomCategorie:null })
    if (!image.data) {
      return await {
        message: 'aucun size avec ce nom ou vous n\'etes pas l\'admin de cette size',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const couleur = await this.couleurService.findByNameAndId({ id: idAdmin, nameCouleur: updateCouleurDto.nameCouleur, nameProduct: updateCouleurDto.nameProduct })
    if (!couleur.data) {
      return await {
        message: 'l couleur que vous avez saisi n\'existe pas ou vous n\'etes pas l\'admin de ce couleur',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    if (updateCouleurDto.urlImage) {
      const ima = await this.imageRepository.findOne({ where: { UrlImage: updateCouleurDto.urlImage } });
      if (ima) {
        return await {
          message: 'cette couleur existe deja',
          statusCode: HttpStatus.BAD_REQUEST,
        }
      }
    }
    if(updateCouleurDto.urlImage){
      image.data.UrlImage = updateCouleurDto.urlImage;
    }
    image.data.updatedate = new Date();
    image.data.couleur = couleur.data;
    await this.imageRepository.save(image.data)
    return await {
      message: image.data,
      statusCode: HttpStatus.OK,
    }
  }
  async update_category(@Session() request: Record<string, any>, updateCouleurDto: UpdateImageCategoryDto) {
    const idAdmin = request.idUser
    if (!idAdmin) {
      return await {
        message: 'vous devez vous connecter',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const admin = await this.userService.findById(idAdmin)
    if (!admin || admin.data.role === Roles.USER) {
      return await {
        message: 'vous devez etre un admin',
        statusCode: HttpStatus.BAD_REQUEST,

      }
    }
    const image1 = await this.imageRepository.findOne({ where: { id: updateCouleurDto.id } });
    if(!image1){
      return await {
        message: 'cette image n\'existe pas',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    } 
    const image = await this.findByNameAndId({ id: idAdmin, urlImage: image1.UrlImage, nomCategorie: updateCouleurDto.nomCategorie, nameCouleur:null })
    console.log(image)
    if (!image.data) {
      return await {
        message: 'aucun size avec ce nom ou vous n\'etes pas l\'admin de cette size',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const categorie = await this.categoryService.findByIdAndName({ id: idAdmin, nameCategory: updateCouleurDto.nomCategorie })
    if (!categorie.data) {
      return await {
        message: 'l couleur que vous avez saisi n\'existe pas ou vous n\'etes pas l\'admin de ce couleur',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    if (updateCouleurDto.UrlImage) {
      const ima = await this.imageRepository.findOne({ where: { UrlImage: updateCouleurDto.UrlImage } });
      if (ima) {
        return await {
          message: 'cette couleur existe deja',
          statusCode: HttpStatus.BAD_REQUEST,
        }
      }
    }
    if(updateCouleurDto.UrlImage){
      image.data.UrlImage = updateCouleurDto.UrlImage;
    }
    
    image.data.updatedate = new Date();
    await this.imageRepository.save(image.data)
    console.log(image.data)
    return await {
      message: image.data,
      statusCode: HttpStatus.OK,
    }
  }

  async remove_category(@Session() request: Record<string, any>, removeCouleurDto: RemoveImageDto) {
    const idAdmin = request.idUser
    if (!idAdmin) {
      return await {
        message: 'vous devez vous connecter',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const admin = await this.userService.findById(idAdmin)
    if (!admin || admin.data.role === Roles.USER) {
      return await {
        message: 'vous devez etre un admin',
        statusCode: HttpStatus.BAD_REQUEST,

      }
    }
    const image1 = await this.imageRepository.findOne({ where: { id: removeCouleurDto.id } });
    console.log(image1)
    if(!image1){
      return await {
        message: 'cette image n\'existe pas',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const image = await this.findByNameAndId({ id: idAdmin, urlImage: image1.UrlImage, nomCategorie: removeCouleurDto.nomCategorie, nameCouleur:null })
    console.log(image)
    if (!image.data) {
      return await {
        message: 'aucune couleur avec ce nom ou vous n\'etes pas l\'admin de ce produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    console.log(image.data)
    await this.imageRepository.remove(image.data)
    return await {
      message: 'la couleur a bien ete supprimer',
      statusCode: HttpStatus.OK,
    }
  }
  async remove_product(@Session() request: Record<string, any>, removeCouleurDto: RemoveImageDto) {
    const idAdmin = request.idUser
    if (!idAdmin) {
      return await {
        message: 'vous devez vous connecter',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const admin = await this.userService.findById(idAdmin)
    if (!admin || admin.data.role === Roles.USER) {
      return await {
        message: 'vous devez etre un admin',
        statusCode: HttpStatus.BAD_REQUEST,

      }
    }
    const image1 = await this.imageRepository.findOne({ where: { id: removeCouleurDto.id } });
    if(!image1)
      {
        return await {
          message: 'cette image n\'existe pas',
          statusCode: HttpStatus.BAD_REQUEST,
        }
      }
    const image = await this.findByNameAndId({ id: idAdmin, urlImage: image1.UrlImage, nomCategorie: null, nameCouleur:removeCouleurDto.nameCouleur })
    if (!image.data) {
      return await {
        message: 'aucune couleur avec ce nom ou vous n\'etes pas l\'admin de ce produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    await this.imageRepository.remove(image.data)
    return await {
      message: 'la couleur a bien ete supprimer',
      statusCode: HttpStatus.OK,
    }
  }
}
