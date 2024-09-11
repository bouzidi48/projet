import { forwardRef, HttpStatus, Inject, Injectable, Session } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Size } from './entities/size.entity';
import { SizeRepository } from './size.repository';
import { UserService } from 'src/user/user.service';
import { CouleurService } from 'src/couleur/couleur.service';
import { Roles } from 'src/enum/user_enum';
import { FindBySizeDto } from './dto/find-by-size.dto';
import { FindByCouleurDto } from './dto/find-by-couleur.dto';
import { FindByIdNameDto } from './dto/find-by-Id-Name.dto';
import { RemoveSizeDto } from './dto/remove-size.dto';
import { UserController } from 'src/user/user.controller';
import { CouleurController } from 'src/couleur/couleur.controller';

@Injectable()
export class SizeService {
  constructor(@InjectRepository(Size) private readonly sizeRepository: SizeRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => CouleurService))
    private readonly couleurService: CouleurService,
  ) { }
  async create(@Session() request: Record<string, any>, createSizeDto: CreateSizeDto) {
    const idAdmin = request.idUser
    console.log(idAdmin)
    if (!idAdmin) {
      return await {
        message: 'vous devez vous connecter pour ajouter une categorie',
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
    const size1 = await this.sizeRepository.findOne({ where: { typeSize: createSizeDto.typeSize, couleur: { nameCouleur: createSizeDto.nameCouleur,product:{nameProduct:createSizeDto.nameProduct} } } });
    console.log("size1",size1)
    if (size1) {
      return await {
        message: 'cette size existe deja dans se produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const couleur = await this.couleurService.findByNameAndId({ id: idAdmin, nameCouleur: createSizeDto.nameCouleur, nameProduct: createSizeDto.nameProduct })

    if (!couleur.data) {
      return await {
        message: 'cette couleur n\'existe pas ou vous n\'etes pas l\'admin de ce produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    const size = await this.sizeRepository.create(createSizeDto);
    size.addedBy = admin.data;
    size.createdate = new Date();
    size.couleur = couleur.data;
    await this.sizeRepository.save(size);
    return await {
      message: 'couleur ajoute avec succes',
      statusCode: HttpStatus.OK,
    }
  }

  async findAll() {
    const size = await this.sizeRepository.find();
    if (size.length == 0) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      message: size,
      statusCode: HttpStatus.OK,
    }
  }

  async findByNameSize(typeSize: FindBySizeDto) {
    const size = await this.sizeRepository.find({ where: { typeSize: typeSize.typeSize } });
    if (size.length == 0) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      message: size,
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

    const sizes = await this.sizeRepository.find({ where: { couleur: { id: couleur.data.id } } });
    if (!sizes) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      message: sizes,
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
      const size = await this.sizeRepository.findOne({ where: { typeSize: nameProduct.typeSize, couleur: { id: nameProduct.idCouleur} } });
      if (!size) {
        return await {
          data: null,
          statusCode: HttpStatus.BAD_REQUEST,
        }
      }
      return await {
        data: size,
        statusCode: HttpStatus.OK,
      }
    }
    const size = await this.sizeRepository.findOne({ where: { typeSize: nameProduct.typeSize,couleur:{id:nameProduct.idCouleur}, addedBy: { id: nameProduct.id } } });
    if (!size) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: size,
      statusCode: HttpStatus.OK,
    }
  }

  async findOne(id: number) {
    const size = await this.sizeRepository.findOne({ where: { id: id } });
    if (!size) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: size,
      statusCode: HttpStatus.OK,
    }
  }

  async findByIdSizeIdCouleur(idSize: number, idCouleur: number) {
    const couleur = await this.sizeRepository.findOne({ where: { id: idSize, couleur: { id: idCouleur } } });
    if (!couleur) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      message: couleur,
      statusCode: HttpStatus.OK,
    }
  }

  async update(@Session() request: Record<string, any>, updateCouleurDto: UpdateSizeDto) {
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
    const size1 = await this.sizeRepository.findOne({ where: { id: updateCouleurDto.id } });
    console.log(size1)
    if (!size1) {
      return await {
        message: 'cette size n existe pas',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const size = await this.findByNameAndId({ id: idAdmin, idCouleur: updateCouleurDto.idCouleur, typeSize: size1.typeSize })
    console.log("size",size)
    if (!size.data) {
      return await {
        message: 'aucun size avec ce nom ou vous n\'etes pas l\'admin de cette size',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const couleur = await this.couleurService.findByNameAndId({ id: idAdmin, nameCouleur: updateCouleurDto.nameCouleur, nameProduct: updateCouleurDto.nameProduct })
    console.log("couleur.size",couleur)
    if (!couleur.data) {
      return await {
        message: 'l couleur que vous avez saisi n\'existe pas ou vous n\'etes pas l\'admin de ce couleur',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    if (updateCouleurDto.typeSize) {
      console.log('idCouelur',updateCouleurDto.idCouleur)
      const siz = await this.sizeRepository.findOne({ where: { typeSize: updateCouleurDto.typeSize, couleur: { id: updateCouleurDto.idCouleur} } });
      if (siz) {
        return await {
          message: 'cette size existe deja',
          statusCode: HttpStatus.BAD_REQUEST,
        }
      }
    }
    if(updateCouleurDto.typeSize){
      size.data.typeSize = updateCouleurDto.typeSize;
    }
    
    size.data.addedBy = admin.data;
    size.data.updatedate = new Date();
    size.data.stockQuantity = updateCouleurDto.stockQuantity;
    size.data.couleur = couleur.data;
    this.sizeRepository.save(size.data)
    return await {
      message: size.data,
      statusCode: HttpStatus.OK,
    }
  }

  async remove(@Session() request: Record<string, any>, removeCouleurDto: RemoveSizeDto) {
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
    const size1 = await this.sizeRepository.findOne({ where: { id: removeCouleurDto.id } });
    if(!size1){
      return await {
        message: 'cette size n\'existe pas',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const size = await this.findByNameAndId({ id: idAdmin, idCouleur: removeCouleurDto.idCouleur, typeSize: size1.typeSize })
    if (!size.data) {
      return await {
        message: 'aucune couleur avec ce nom ou vous n\'etes pas l\'admin de ce produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    await this.sizeRepository.remove(size.data)
    return await {
      message: 'la couleur a bien ete supprimer',
      statusCode: HttpStatus.OK,
    }
  }
}
