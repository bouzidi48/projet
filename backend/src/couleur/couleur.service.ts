import { forwardRef, HttpStatus, Inject, Injectable, NotFoundException, Session } from '@nestjs/common';
import { CreateCouleurDto } from './dto/create-couleur.dto';
import { UpdateCouleurDto } from './dto/update-couleur.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Couleur } from './entities/couleur.entity';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { CouleurRepository } from './couleur.repository';
import { Roles } from 'src/enum/user_enum';
import { FindByProductDto } from './dto/find-by-product.dto';
import { RemoveCouleurDto } from './dto/remove-couleur.dto';
import { FindByCouleurDto } from './dto/find-by-couleur.dto';
import { FindByIdNameDto } from './dto/find-by-Id-Name.dto';
import { UserController } from 'src/user/user.controller';
import { ProductController } from 'src/product/product.controller';
import { SizeService } from 'src/size/size.service';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class CouleurService {
  constructor(@InjectRepository(Couleur) private readonly couleurRepository: CouleurRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    private readonly sizeService: SizeService,
    @Inject(forwardRef(() => ImagesService))
    private readonly imageService: ImagesService
  ) { }
  async create(@Session() request: Record<string, any>, createCouleurDto: CreateCouleurDto) {
    const idAdmin = request.idUser
    console.log(idAdmin)
    if (!idAdmin) {
      return await {
        message: 'vous devez vous connecter pour ajouter une couleur',
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
    const couleur1 = await this.couleurRepository.findOne({ where: { nameCouleur: createCouleurDto.nameCouleur, product: { nameProduct: createCouleurDto.nameProduct } } });
    console.log(couleur1)
    if (couleur1) {
      return await {
        message: 'cette couleur existe deja dans se produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const product = await this.productService.findByNameAndIdProduct({ id: idAdmin, nameProduct: createCouleurDto.nameProduct })
    console.log(product.data)
    if (!product.data) {
      return await {
        message: 'ce produit n\'existe pas ou vous n\'etes pas l\'admin de ce produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    const couleur = await this.couleurRepository.create(createCouleurDto);
    couleur.addedBy = admin.data;
    couleur.createdate = new Date();
    couleur.product = product.data;
    await this.couleurRepository.save(couleur);
    for (let image of createCouleurDto.listeimage) {
      await this.imageService.create_product(request, image)
    }
    console.log("listesize")
    for (let size of createCouleurDto.listesize) {
      await this.sizeService.create(request, size)
    }
    return await {
      message: 'couleur ajoute avec succes',
      statusCode: HttpStatus.OK,
    }

  }

  async findAll() {
    const couleur = await this.couleurRepository.find();
    if (couleur.length == 0) {
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

  async findByNameCouleur(nameCouleur: FindByCouleurDto) {
    const couleur = await this.couleurRepository.find({ where: { nameCouleur: nameCouleur.nameCouleur }, relations: ['images', 'sizes'] });
    if (couleur.length == 0) {
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

  async findByProduct(nameCategory: FindByProductDto) {
    const product = await this.productService.findByNameProduct({ nameProduct: nameCategory.nameProduct })
    if (!product) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    const couleurs = await this.couleurRepository.find({ where: { product: { id: product.data.id } } });
    if (!couleurs) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      message: couleurs,
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
      const couleur = await this.couleurRepository.findOne({ where: { nameCouleur: nameProduct.nameCouleur, product: { nameProduct: nameProduct.nameProduct } } });
      if (!couleur) {
        return await {
          data: null,
          statusCode: HttpStatus.BAD_REQUEST,
        }
      }
      return await {
        data: couleur,
        statusCode: HttpStatus.OK,
      }
    }
    const couleur = await this.couleurRepository.findOne({ where: { nameCouleur: nameProduct.nameCouleur, addedBy: { id: nameProduct.id }, product: { nameProduct: nameProduct.nameProduct } } });
    if (!couleur) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: couleur,
      statusCode: HttpStatus.OK,
    }
  }

  async findOne(id: number) {
    const couleur = await this.couleurRepository.findOne({ where: { id: id }, relations: ['images', 'sizes', 'product'] });
    if (!couleur) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: couleur,
      statusCode: HttpStatus.OK,
    }
  }
  async findByIdCouleurIdProduct(idProduct: number, idCouleur: number) {
    const couleur = await this.couleurRepository.findOne({ where: { id: idCouleur, product: { id: idProduct } } });
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

  async update(@Session() request: Record<string, any>, updateCouleurDto: UpdateCouleurDto) {
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
    const couleur1 = await this.couleurRepository.findOne({where:{id:updateCouleurDto.id}})
    if(!couleur1){
      return await {
        message: 'cette couleur n\'existe pas',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    console.log("couleur1",couleur1)
    console.log("nameProduct",updateCouleurDto.nameProduct)
    const couleur = await this.findByNameAndId({ id: idAdmin, nameCouleur: couleur1.nameCouleur,nameProduct:updateCouleurDto.nameProduct })
    if (!couleur.data) {
      return await {
        message: 'aucun couleur avec ce nom ou vous n\'etes pas l\'admin de cette couleur',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    console.log("couleur",couleur)

    const product = await this.productService.findByNameAndIdProduct({ id: idAdmin, nameProduct: updateCouleurDto.nameProduct })
    if (!product) {
      return await {
        message: 'le produit que vous avez saisi n\'existe pas ou vous n\'etes pas l\'admin de ce produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    if (updateCouleurDto.nameCouleur) {
      console.log(updateCouleurDto.nameCouleur)
      const col = await this.couleurRepository.findOne({ where: { nameCouleur: updateCouleurDto.nameCouleur, product: { nameProduct: updateCouleurDto.nameProduct} } });
      console.log("col",col)
      if (col) {
        return await {
          message: 'cette couleur existe deja',
          statusCode: HttpStatus.BAD_REQUEST,
        }
      }
    }
    if(updateCouleurDto.nameCouleur){
      couleur.data.nameCouleur = updateCouleurDto.nameCouleur;
    }
    couleur.data.addedBy = admin.data;
    couleur.data.updatedate = new Date();
    couleur.data.product = product.data;
    this.couleurRepository.save(couleur.data)
    console.log("listeColeur.listeimage")
    for (let image of updateCouleurDto.listeimage) {
      const image1 =await this.imageService.update_product(request, image)
      console.log(image1)
    }
    console.log("listeColeur.listesize")
    for (let size of updateCouleurDto.listesize) {
      const size1 =await this.sizeService.update(request, size)
      console.log(size1)
    }
    console.log("listeColeur.listeAjouterImage")
    for(let image of updateCouleurDto.listeAjouterImage){
      const image1 =await this.imageService.create_product(request, image)
      console.log(image1)
    }
    console.log("listeColeur.listeAjouterSize")
    console.log(updateCouleurDto.listeAjouterSize)
    for(let size of updateCouleurDto.listeAjouterSize){
      const size1 =await this.sizeService.create(request, size)
      console.log(size1)
    }
    console.log("listeColeur.listeSupprimerImage")
    for(let image of updateCouleurDto.listeSupprimerImage){
      const image1 =await this.imageService.remove_product(request, image)
      console.log(image1)
    }
    console.log("listeColeur.listeSupprimerSize")
    for(let size of updateCouleurDto.listeSupprimerSize){
      const size1 =await this.sizeService.remove(request, size)
      console.log(size1)
    }
    return {
      message: couleur.data,
      statusCode: HttpStatus.OK,
    }
  }

  async remove(@Session() request: Record<string, any>, removeCouleurDto: RemoveCouleurDto) {
    const idAdmin = request.idUser
    if (!idAdmin) {
      return {
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
    const couleur1 = await this.couleurRepository.findOne({where:{id:removeCouleurDto.id}})
    if(!couleur1){
      return await {
        message: 'cette couleur n\'existe pas',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const couleur = await this.findByNameAndId({ id: idAdmin, nameProduct: removeCouleurDto.nameProduct, nameCouleur: couleur1.nameCouleur })
    if (!couleur) {
      return {
        message: 'aucune couleur avec ce nom ou vous n\'etes pas l\'admin de ce produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    for (let image of removeCouleurDto.listeimage) {
      await this.imageService.remove_product(request, image)
    }
    for (let size of removeCouleurDto.listesize) {
      await this.sizeService.remove(request, size)
    }
    await this.couleurRepository.remove(couleur.data)
    return {
      message: 'la couleur a bien ete supprimer',
      statusCode: HttpStatus.OK,
    }
  }
}
