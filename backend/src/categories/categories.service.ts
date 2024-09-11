import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException, Session } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { IsNull, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';

import { CategoryRepository } from './category.repository';
import { Roles } from 'src/enum/user_enum';

import { FindByNameCategoryDto } from './dto/find-ByName.dto';
import { UserController } from 'src/user/user.controller';
import { FindByIdAndNameDto } from './dto/find-ById-Name.dto';
import { retry } from 'rxjs';
import { FindByNameParentDto } from './dto/find-ByParentName.dto';
import { ImageRepository } from 'src/images/image.repository';
import { ImagesController } from 'src/images/images.controller';
import { ImagesService } from 'src/images/images.service';
import { ProductService } from 'src/product/product.service';
import { RemoveProductDto } from 'src/product/dto/remove-product.dto';
import { where } from 'sequelize';





@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity) private readonly categoryRepository: CategoryRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly imageControleur: ImagesService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService
  ) { }


  async create(@Session() request: Record<string, any>, createCategoryDto: CreateCategoryDto) {
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
    const category1 = await this.categoryRepository.findOne({ where: { nameCategory: createCategoryDto.nameCategory } });
    if (category1) {
      return await {
        message: 'ce category existe deja',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }



    const category = this.categoryRepository.create(createCategoryDto);
    if (!createCategoryDto.NameparentCategory) {

      category.addedBy = admin.data;
      category.createdAt = new Date();
      this.categoryRepository.save(category)
      const image = await this.imageControleur.create_category(request, createCategoryDto.image);
      category.image = image.data
      await this.categoryRepository.save(category)
    }
    else {
      const parent = await this.categoryRepository.findOne({ where: { nameCategory: createCategoryDto.NameparentCategory } })
      if (!parent) {
        return await {
          message: 'la categorie parente n\'existe pas',
          statusCode: HttpStatus.BAD_REQUEST,

        }
      }

      category.addedBy = admin.data;
      category.createdAt = new Date();
      category.parentCategory = parent
      const categorys = await this.categoryRepository.save(category)
      const image = await this.imageControleur.create_category(request, createCategoryDto.image);
      console.log(image.data)
      categorys.image = image.data
      await this.categoryRepository.save(category)
    }
    console.log(category)
    const categories = await this.categoryRepository.findOne({ where: { nameCategory: createCategoryDto.nameCategory }, relations: ['image', 'parentCategory'] });
    return await {
      data: categories,
      statusCode: HttpStatus.OK,

    }
  }
  async findParentCategories() {

    const parentCategories = await this.categoryRepository.find({ where: { parentCategory:{id:IsNull()} } })
    if (parentCategories.length === 0) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: parentCategories,
      statusCode: HttpStatus.OK,
    }
  }
  async findByIdAndName(createCategoryDto: FindByIdAndNameDto) {
    const user = await this.userService.findById(createCategoryDto.id);
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
      const categorie = await this.categoryRepository.findOne({ where: { nameCategory: createCategoryDto.nameCategory } });
      if (!categorie) {
        return await {
          data: null,
          statusCode: HttpStatus.BAD_REQUEST,
        }
      }
      return await {
        data: categorie,
        statusCode: HttpStatus.OK
      };
    }
    const categorie = await this.categoryRepository.findOne({ where: { addedBy: { id: createCategoryDto.id }, nameCategory: createCategoryDto.nameCategory } });
    if (!categorie) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: categorie,
      statusCode: HttpStatus.OK
    };
  }


  async findSubcategories(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id:id }, relations: ['addedBy', 'image', 'products', 'subcategories'] });
    if (!category) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }


    const subcategories = await this.categoryRepository.find({ where: { parentCategory: { id: (await category).id } }, relations: ['addedBy', 'image', 'products','products.colours', 'products.colours.images', 'products.colours.sizes', 'subcategories',] });
    if (subcategories.length === 0) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: subcategories,
      statusCode: HttpStatus.OK
    };
  }

  async findAll() {
    const categories = await this.categoryRepository.find({ relations: ["image", "parentCategory"] });
    if (!categories) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: categories,
      statusCode: HttpStatus.OK
    };
  }
  async findByName(nameCategory: FindByNameCategoryDto) {
    const categorie = await this.categoryRepository.findOne({ where: { nameCategory: nameCategory.nameCategory }, relations: ['image'] });
    console.log(categorie)
    if (!categorie) {
      return await {
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    return await {
      data: categorie,
      statusCode: HttpStatus.OK
    };
  }

  async findOne(id: number) {
    const categorie = await this.categoryRepository.findOne({ where: { id: id }, relations: ['addedBy', 'image', 'products', 'products.colours', 'products.colours.images', 'products.colours.sizes', 'subcategories', 'parentCategory'] })
    return await {
      data: categorie,
      statusCode: HttpStatus.OK
    }
  }


  /* async update(@Session() request:Record<string, any>,id: number, fields:Partial< UpdateCategoryDto> ) {
    const category=await this.findOne(id);
    if(!category) throw new NotFoundException('Catgory not found.');
    Object.assign(category,fields);
    category.updatedAt=new Date();
    return await  this.categoryRepository.save(category);
  } */

  async update(@Session() request: Record<string, any>, id: number, fields: Partial<UpdateCategoryDto>) {
    const category = await this.findOne(id);
    console.log(category)
    if (!category) {
      return await {
        message: 'Category not found.',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const idAdmin = request.idUser
    if (!idAdmin) {
      return await {
        message: 'vous devez vous connecter pour Modifier une categorie',
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
    if (fields.NameparentCategory) {
      const parentCategory = await this.categoryRepository.findOne({ where: { nameCategory: fields.NameparentCategory } });
      if (!parentCategory) {
        return await {
          message: 'Parent Category not found.',
          statusCode: HttpStatus.BAD_REQUEST,
        }
      } if (fields.nameCategory) {
        const nameCategory = await this.categoryRepository.findOne({ where: { nameCategory: fields.nameCategory } });
        if (nameCategory) {
          return await {
            message: 'Name Category existe deja.',
            statusCode: HttpStatus.BAD_REQUEST,
          }
        }
      }
      if (fields.nameCategory) {
        category.data.nameCategory = fields.nameCategory
      }
      category.data.parentCategory = parentCategory;
      category.data.description = fields.description;
      category.data.updatedAt = new Date();
      await this.categoryRepository.save(category.data);
      await this.imageControleur.update_category(request, fields.image);


      const categorie = await this.categoryRepository.findOne({ where: { id: id }, relations: ['addedBy', 'image', 'products', 'parentCategory'] })
      console.log(categorie)
      return await {
        data: categorie,
        statusCode: HttpStatus.OK,
      }
    }
    if (fields.nameCategory) {
      const nameCategory = await this.categoryRepository.findOne({ where: { nameCategory: fields.nameCategory } });
      if (nameCategory) {
        return await {
          message: 'Name Category existe deja.',
          statusCode: HttpStatus.BAD_REQUEST,
        }
      }
    }
    category.data.description = fields.description;
    if (fields.nameCategory) {
      category.data.nameCategory = fields.nameCategory
    }
    category.data.updatedAt = new Date();
    console.log("Categorie")
    await this.categoryRepository.save(category.data);
    console.log(category.data)
    const image = await this.imageControleur.update_category(request, fields.image);
    console.log(image)
    const categorie = await this.categoryRepository.findOne({ where: { id: id }, relations: ['addedBy', 'image', 'products', 'parentCategory'] })
    return await {
      data: categorie,
      statusCode: HttpStatus.OK,
    }
  }

  async remove(@Session() request: Record<string, any>, id: number) {
    const category = await this.findOne(id);
    console.log("category", category)
    console.log("produts", category.data.products)
    if (!category.data) {
      return {
        message: 'Category not found.',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    const idAdmin = request.idUser;
    if (!idAdmin) {
      return {
        message: 'Vous devez vous connecter pour modifier une catégorie',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    const admin = await this.userService.findById(idAdmin);
    if (!admin || admin.data.role === Roles.USER) {
      return {
        message: 'Vous devez être un admin',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    // Supprimer les sous-catégories dépendantes
    const subcategories = await this.findSubcategories(category.data.id);
    console.log("subcategories", subcategories)
    if (subcategories.data && subcategories.data.length > 0) {
      for (const subcategory of subcategories.data) {
        const image = await this.remove(request, subcategory.id);
        console.log(image)
      }
    }
    if (category.data.image) {
      console.log("image", category.data.image)
      const deleteImage = {
        id: category.data.image.id,
        nomCategorie: category.data.nameCategory,
        nameCouleur: null,
      }
      // Supprimer les images liées, si applicable
      if (category.data && category.data.image) {
        const image = await this.imageControleur.remove_category(request, deleteImage);
        console.log(image)
      }
    }


    if (category.data.products.length > 0) {
      for (const product of category.data.products) {
        const removeProductDto: RemoveProductDto = {
          id: product.id,
          listeCouleur: product.colours ? product.colours.map(couleur => ({
            id: couleur.id,
            nameProduct: product.nameProduct,
            listeimage: couleur.images.map(image => ({
              id: image.id,
              nomCategorie: null,
              nameCouleur: couleur.nameCouleur,
            })),
            listesize: couleur.sizes.map(size => ({

              id: size.id,
              idCouleur: couleur.id,
            })),
          })) : [],
        };
        await this.productService.remove(request, removeProductDto);
      }
    }

    // Supprimer la catégorie principale
    const categories = await this.categoryRepository.findOne({ where: { id: id } });
    console.log(categories)
    await this.categoryRepository.remove(categories);
    return await {
      data: categories,
      statusCode: HttpStatus.OK,
    }
  }



  async nouveauCat() {

    const newcat = await this.categoryRepository
      .createQueryBuilder('categories')
      .leftJoinAndSelect('categories.parentCategory', 'parentCategory')
      .leftJoinAndSelect('categories.subcategories', 'subcategories')
      .leftJoinAndSelect('categories.addedBy', 'addedBy')
      .leftJoinAndSelect('categories.products', 'products')
      .leftJoinAndSelect('categories.image', 'image')
      .orderBy('categories.createdAt', 'DESC')
      .limit(5)
      .getMany();

    console.log(newcat);
    return {
      data: newcat,
      statusCode: HttpStatus.OK,
    };
  }



}

