import { forwardRef, HttpStatus, Inject, Injectable, NotFoundException, Session } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { CategoryRepository } from 'src/categories/category.repository';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { Roles } from 'src/enum/user_enum';
import { FindByNameProductDto } from './dto/find-by-name-product.dto';
import { FindByCategorieDto } from './dto/find-by-categorie.dto';
import { RemoveProductDto } from './dto/remove-product.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { UserService } from 'src/user/user.service';
import { FindByNameAndIdProductDto } from './dto/find-by-name-id-product.dto';
import { AjouetrPanierDto } from './dto/ajouter-panier.dto';
import { Couleur } from 'src/couleur/entities/couleur.entity';
import { CouleurRepository } from 'src/couleur/couleur.repository';
import { Size } from 'src/size/entities/size.entity';
import { SizeRepository } from 'src/size/size.repository';
import { RemovePanierDto } from './dto/remove-panier.to';
import { CategoriesController } from 'src/categories/categories.controller';
import { UserController } from 'src/user/user.controller';
import { CouleurController } from 'src/couleur/couleur.controller';
import { SizeController } from 'src/size/size.controller';
import { ProductController } from './product.controller';
import { OrderStatus } from 'src/enum/order-status.enum';
import { CouleurService } from 'src/couleur/couleur.service';
import { ProductLikeService } from 'src/product-like/product-like.service';
import { Order } from 'src/order/entities/order.entity';
import { where } from 'sequelize';

@Injectable()
export class ProductService {


  constructor(
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoryService: CategoriesService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => CouleurService))
    private readonly couleurService: CouleurService,
    @InjectRepository(Size) private readonly sizeRepository: SizeRepository,
    @InjectRepository(Product) private readonly productRepository: ProductRepository,
    private readonly productLikeService: ProductLikeService,
  ) { }
  async listePanier(@Session() request: Record<string, any>) {
    console.log(request.panier)
    if (!request.panier) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: request.panier,
      statusCode: HttpStatus.OK,
    }
  }
  async create(@Session() request: Record<string, any>, createProductDto: CreateProductDto) {
    const idAdmin = request.idUser
    console.log(createProductDto)
    console.log(idAdmin)
    if (!idAdmin) {
      return await {
        message: 'vous devez vous connecter pour ajouter un produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const admin = await this.userService.findById(idAdmin)
    console.log(idAdmin)
    if (!admin || admin.data.role === Roles.USER) {
      return await {
        message: 'vous devez etre un admin',
        statusCode: HttpStatus.BAD_REQUEST,

      }
    }
    console.log(idAdmin)
    const pro = await this.productRepository.findOne({ where: { nameProduct: createProductDto.nameProduct } });
    if (pro) {
      return await {
        message: 'ce produit existe deja',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    console.log(idAdmin)
    const category = await this.categoryService.findByIdAndName({ id: idAdmin, nameCategory: createProductDto.nomCategory })
    if (!category.data) {
      return await {
        message: 'la categorie que vous avez saisi n\'existe pas ou vous n\'etes pas l\'admin de cette categorie',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    console.log(category.data)
    const product = await this.productRepository.create(createProductDto);
    product.addedBy = admin.data;
    product.category = category.data;
    product.createdate = new Date();
    await this.productRepository.save(product)
    console.log(product)
    for (let couleur of createProductDto.listeCouleur) {
      await this.couleurService.create(request, couleur)
    }
    const products = await this.productRepository.findOne({where:{id:product.id},relations:['colours','colours.images','colours.sizes','category']})
    console.log(products)
    return await {
      message: 'produit ajoute avec succes',
      data: products,
      statusCode: HttpStatus.OK,
    }
  }



  async findAll() {
    const products = await this.productRepository.find({ relations: ['colours', 'colours.images', 'colours.sizes','category'] });
    if (!products) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: products,
      statusCode: HttpStatus.OK,
    }
  }
  async findByNameProduct(nameProduct: FindByNameProductDto) {
    const product = await this.productRepository.findOne({ where: { nameProduct: nameProduct.nameProduct }, relations: ['colours', 'colours.images', 'colours.sizes'] });
    console.log(product)
    if (!product) {
      return {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return {
      data: product,
      statusCode: HttpStatus.OK,
    }
  }
  async findByNameAndIdProduct(nameProduct: FindByNameAndIdProductDto) {
    const user = await this.userService.findById(nameProduct.id)
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
      const product = await this.productRepository.findOne({ where: { nameProduct: nameProduct.nameProduct } });
      if (!product) {
        return await {
          data: null,
          statusCode: HttpStatus.BAD_REQUEST,
        }
      }
      return await {
        data: product,
        statusCode: HttpStatus.OK,
      }
    }
    const product = await this.productRepository.findOne({ where: { nameProduct: nameProduct.nameProduct, addedBy: { id: nameProduct.id } } });
    if (!product) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: product,
      statusCode: HttpStatus.OK,
    }
  }
  async findByCategory(nameCategory: FindByCategorieDto) {
    const categorie = await this.categoryService.findByName({ nameCategory: nameCategory.nameCategory })
    if (!categorie) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    const products = await this.productRepository.find({ where: { category: { id: categorie.data.id } } });
    if (!products) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: products,
      statusCode: HttpStatus.OK,
    }
  }



  async update(@Session() request: Record<string, any>, updateProductDto: UpdateProductDto) {
    const idAdmin = request.idUser
    if (!idAdmin) {
      return await {
        message: 'vous devez vous connecter',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    console.log("admin")
    const admin = await this.userService.findById(idAdmin)
    if (!admin || admin.data.role === Roles.USER) {
      return await {
        message: 'vous devez etre un admin',
        statusCode: HttpStatus.BAD_REQUEST,

      }
    }
    console.log("produt1")
    const product1 = await this.productRepository.findOne({where:{id:updateProductDto.id}})
    if(!product1){
      return await {
        message: 'ce produit n\'existe pas',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    console.log("produt")
    const product = await this.findByNameAndIdProduct({ nameProduct: product1.nameProduct, id: idAdmin });
    if (!product.data) {
      return await {
        message: 'aucun produit avec ce nom ou vous n\'etes pas l\'admin de ce produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    console.log("category")
    const category = await this.categoryService.findByIdAndName({ id: idAdmin, nameCategory: updateProductDto.nomCategory })
    if (!category.data) {
      return await {
        message: 'la categorie que vous avez saisi n\'existe pas ou vous n\'etes pas l\'admin de cette categorie',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    if (updateProductDto.nameProduct) {
      console.log(updateProductDto.nameProduct)
      console.log("pro")
      const pro = await this.productRepository.findOne({ where: { nameProduct: updateProductDto.nameProduct } });
      if (pro) {
        return await {
          message: 'ce produit existe deja',
          statusCode: HttpStatus.BAD_REQUEST,
        }
      }
    }
    
    if(updateProductDto.nameProduct){
      product.data.nameProduct = updateProductDto.nameProduct;
    }
    product.data.description = updateProductDto.description;
    product.data.price = updateProductDto.price;
    product.data.category = category.data;
    product.data.updatedate = new Date();
    console.log("listeCouleur")
    console.log(updateProductDto.listeCouleur)
    for (let couleur of updateProductDto.listeCouleur) {
      const couleur1 = await this.couleurService.update(request, couleur)
      console.log(couleur1)
    }
    console.log("listeAjouterCouleur")
    for(let couleur of updateProductDto.listeAjouterCouleur) {
      const couleur1 = await this.couleurService.create(request, couleur)
      console.log(couleur1)
    }
    console.log("listeSupprimerCouleur")
    console.log(updateProductDto.listeSupprimerCouleur)
    for(let couleur of updateProductDto.listeSupprimerCouleur) {
      const couleur1 = await this.couleurService.remove(request, couleur)
      console.log(couleur1)
    }
    await this.productRepository.save(product.data)
    const products = await this.productRepository.findOne({where:{id:updateProductDto.id}, relations: ['colours', 'colours.images', 'colours.sizes','category'] });
    console.log(products)
    return await {
      data: products,
      statusCode: HttpStatus.OK,
    }
  }
  async remove(@Session() request: Record<string, any>, removeProductDto: RemoveProductDto) {
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
    const product1 = await this.productRepository.findOne({where:{id:removeProductDto.id}})
    if(!product1){
      return await {
        message: 'ce produit n\'existe pas',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const product = await this.findByNameAndIdProduct({ nameProduct: product1.nameProduct, id: idAdmin });
    if (!product.data) {
      return await {
        message: 'aucun produit avec ce nom ou vous n\'etes pas l\'admin de ce produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    for (let couleur of removeProductDto.listeCouleur) {
      await this.couleurService.remove(request, couleur)
    }
    const product2 = await this.productRepository.findOne({ where: { id: removeProductDto.id } });
    await this.productRepository.remove(product2)
    return await {
      message: 'le produit a bien ete supprimer',
      statusCode: HttpStatus.OK,
    }
  }
  async findById(id: number) {
    const product = await this.productRepository.findOne({ where: { id: id },relations: ['colours', 'colours.images', 'colours.sizes','category','review'] });
    if (!product) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: product,
      statusCode: HttpStatus.OK,
    }
  }
  async ajouterPanier(@Session() request: Record<string, any>, ajouterPanierDto: AjouetrPanierDto) {
    console.log(ajouterPanierDto)
    const productId = ajouterPanierDto.productId
    const couleurId = ajouterPanierDto.couleurId
    const sizeId = ajouterPanierDto.sizeId
    const quantity = ajouterPanierDto.quantity
    console.log("1")
    if (!request.panier) {
      request.panier = {
        list: [],
        total: 0,
        totalAvecReduction: 0
      }
    }
    console.log("2")
    const product = await this.productRepository.findOne({ where: { id: productId } })
    if (!product) {
      return await {
        message: 'ce produit n\'existe pas',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    console.log("3")
    const couleur = await this.couleurService.findOne(ajouterPanierDto.couleurId)
    if (!couleur.data) {
      return await {
        message: 'ce couleur n\'existe pas',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    console.log("4")
    const size = await this.sizeRepository.findOne({ where: { id: sizeId } })
    if (!size) {
      return await {
        message: 'ce taille n\'existe pas',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    console.log("5")
    for (let i = 0; i < request.panier.list.length; i++) {
      if (request.panier.list[i].productId == productId && request.panier.list[i].couleurId == couleurId && request.panier.list[i].sizeId == sizeId) {
        if (request.panier.list[i].quantity + quantity > size.stockQuantity) {
          return await {
            data: null,
            statusCode: HttpStatus.BAD_REQUEST,
          }
        }
        request.panier.list[i].quantity = request.panier.list[i].quantity + quantity
        request.panier.total = request.panier.total - request.panier.list[i].price
        request.panier.list[i].price = product.price
        request.panier.total = request.panier.total + (request.panier.list[i].quantity * product.price)
        if (request.panier.total > 3000) {
          request.panier.totalAvecReduction = request.panier.total * 0.15
        }
        console.log(request.panier)
        return await {
          data: request.panier,
          statusCode: HttpStatus.OK,
        }
      }
    }
    console.log("6")
    request.panier.list.push({
      productId: productId,
      couleurId: couleurId,
      sizeId: sizeId,
      quantity: quantity,
      price: (product.price)
    })
    request.panier.total = request.panier.total + (quantity * product.price)
    if (request.panier.total > 3000) {
      request.panier.totalAvecReduction = request.panier.total - request.panier.total * 0.15
    }
    console.log(request.panier)
    return await {
      data: request.panier,
      statusCode: HttpStatus.OK,
    }
  }
  

  async removePanier(request: Record<string, any>) {
    for (let i = 0; i < request.panier.list.length; i++) {
        request.panier.total = request.panier.total - (request.panier.list[i].price * request.panier.list[i].quantity)
        request.panier.list.pop(request.panier.list[i])
    }
    console.log(request.panier)
    return await {
      data: request.panier,
      statusCode: HttpStatus.OK,

    }
  }
  async removefromPanier(@Session() request: Record<string, any>, removePanierDto: RemovePanierDto) {
    for (let i = 0; i < request.panier.list.length; i++) {
      if (request.panier.list[i].productId == removePanierDto.productId && request.panier.list[i].couleurId == removePanierDto.couleurId && request.panier.list[i].sizeId == removePanierDto.sizeId) {
        request.panier.total = request.panier.total - (request.panier.list[i].price * request.panier.list[i].quantity)
        request.panier.list.pop(request.panier.list[i])
        return await {
          data: request.panier,
          statusCode: HttpStatus.OK,
        }
      }
    }
    return await {
      data: request.panier,
      statusCode: HttpStatus.OK,

    }
  }
  async updateStock(sizeId: number, couleurId: number, productId: number, quantity: number, status: string, order: Order) {
    let product = await this.findById(productId);
    let couleur = await this.couleurService.findByIdCouleurIdProduct(productId, couleurId)
    let size = await this.sizeRepository.findOne({ where: { id: sizeId, couleur: { id: couleurId } } });
    if (!product.data || !couleur || !size) {
      return await {
        message: 'product not found',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    if (status === OrderStatus.SHIPPED && order.status === OrderStatus.PROCESSING) {
      console.log("deduct")
      size.stockQuantity =size.stockQuantity - quantity
      size.updatedate = new Date()

    } else if (order.status === OrderStatus.SHIPPED && status === OrderStatus.CENCELLED) {
      console.log("restore")
      size.stockQuantity = size.stockQuantity + quantity;
      size.updatedate = new Date()
    }
    size = await this.sizeRepository.save(size);
    console.log(size)

    return {
      message: 'stock updated successfully',
      statusCode: HttpStatus.OK,
    }


  }

  async updateStock1(sizeId: number, couleurId: number, productId: number, quantity: number, action: string) {
    let product = await this.findById(productId);
    let couleur = await this.couleurService.findByIdCouleurIdProduct(productId, couleurId)
    let size = await this.sizeRepository.findOne({ where: { id: sizeId, couleur: { id: couleurId } } });

    if (action === 'restore') {
      size.stockQuantity += quantity;
    } else if (action === 'deduct') {
      size.stockQuantity -= quantity;
    }


    await this.sizeRepository.save(size);

    return {
      message: 'Stock updated successfully',
      statusCode: HttpStatus.OK,
    }
  }
  async trend() {
    const result = await this.productRepository.query(
      `SELECT p.id, p.nameProduct, p.description, p.price, AVG(r.ratings) as averageRating
       FROM products p
       JOIN review r ON p.id = r.productId
       GROUP BY p.id, p.nameProduct, p.description, p.price
       ORDER BY averageRating DESC
       LIMIT 3`
    );

    if (result.length === 0) {
      return {
        data: [],
        statusCode: HttpStatus.NO_CONTENT,
      };
    }

    return {
      data: result,
      statusCode: HttpStatus.OK,
    };



  }

  async recomendation(@Session() request: Record<string, any>) {

    const listeLike = await this.productLikeService.findAll(request)
    console.log(listeLike)
    // Si l'utilisateur n'existe pas ou n'a pas liké de produits
    if (listeLike.data.length === 0) {
      // Retourner des produits par défaut (par exemple les plus populaires)
      const defaultProducts = await this.productRepository
        .createQueryBuilder('products')
        .leftJoinAndSelect('products.colours', 'colours')
        .leftJoinAndSelect('colours.addedBy', 'addedBy') // Inclure l'utilisateur qui a ajouté la couleur
        .leftJoinAndSelect('colours.sizes', 'sizes') // Inclure les tailles associées à la couleur
        .leftJoinAndSelect('colours.images', 'images') // Inclure les images associées à la couleur
        .leftJoinAndSelect('colours.orderItems', 'orderItems') // Inclure les items de commande associés à la couleur
        .leftJoinAndSelect('products.category', 'category')
        .leftJoinAndSelect('products.addedBy', 'addedByProduct')
        .leftJoinAndSelect('products.review', 'review')
        .leftJoinAndSelect('products.likedBy', 'likedBy')
        .leftJoinAndSelect('products.orderItems', 'orderItemsProduct')
        .orderBy('products.createdate', 'DESC')
        .limit(5)
        .getMany();

      return {
        data: defaultProducts,
        statusCode: HttpStatus.OK,
      };

    }



    // Recherchez d'autres produits similaires aux produits likés
    const recommendedProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('products.colours', 'colours')
      .leftJoinAndSelect('colours.addedBy', 'addedBy') // Inclure l'utilisateur qui a ajouté la couleur
      .leftJoinAndSelect('colours.sizes', 'sizes') // Inclure les tailles associées à la couleur
      .leftJoinAndSelect('colours.images', 'images') // Inclure les images associées à la couleur
      .leftJoinAndSelect('colours.orderItems', 'orderItems') // Inclure les items de commande associés à la couleur
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.addedBy', 'addedByProduct')
      .leftJoinAndSelect('products.review', 'review')
      .leftJoinAndSelect('products.likedBy', 'likedBy')
      .leftJoinAndSelect('products.orderItems', 'orderItemsProduct')
      .where('product.id IN (:...likedProducts)', { likedProducts: listeLike.data.map(p => p.id) })
      .orWhere('product.categoryId IN (:...categories)', { categories: listeLike.data.map(p => p.category.id) })
      .limit(5) // Limitez à 5 produits par exemple
      .getMany();

    return await {
      data: recommendedProducts,
      statusCode: HttpStatus.OK,
    };
  }
  
}
