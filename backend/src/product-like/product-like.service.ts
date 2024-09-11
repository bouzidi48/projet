import { Body, forwardRef, HttpStatus, Inject, Injectable, Session } from '@nestjs/common';
import { CreateProductLikeDto } from './dto/create-product-like.dto';

import { ProductLikeRepository } from './product-like.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductLikeEntity } from './entities/product-like.entity';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { UpdateProductLikeDto } from './dto/update-product-like.dto';
import { ProductController } from 'src/product/product.controller';
import { UserController } from 'src/user/user.controller';


@Injectable()
export class ProductLikeService {
  productLikedService: any;
  constructor(
    @Inject(forwardRef(() => ProductService))
    private readonly productService:ProductService,
    @Inject(forwardRef(() => UserService))
     private readonly userService:UserService,
    @InjectRepository(ProductLikeEntity) private readonly productLikeRepository:ProductLikeRepository
  ){}

  
  async likeProduct(@Session() request: Record<string, any>,productId:CreateProductLikeDto): Promise<{ message: string; statusCode: number }> {
    const userId = request.idUser;

    if (!userId) {
      if (!request.likes) {
        request.likes = [];
      }

      if (!request.likes.includes(productId.productId)) {
      
      request.likes.push(productId.productId);
      console.log(request.likes)
      return {
        message: 'Produit liké et ajouté à la session',
        statusCode: HttpStatus.OK,
      };
    }
    return await {
      message: 'Produit déjà liké',
      statusCode: HttpStatus.BAD_REQUEST,
    };
    }

    const user = await this.userService.findById(userId);
    const product = await this.productService.findById(productId.productId);

    if (!user || !product) {
      return {
        message: 'Utilisateur ou produit introuvable',
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
      const find = await this.productLikeRepository.findOne({where:{user:user.data,product:product.data}})
      if(find) {
        return await {
          message: 'Vous avez deja liké ce produit',
          statusCode: HttpStatus.BAD_REQUEST,
        }
      }
      const like= await this.productLikeRepository.create({user:user.data, product:product.data});
            like.liked_at=new Date();
           this.productLikeRepository.save(like);

     
    return {
      message: 'Produit liké avec succès',
      statusCode: HttpStatus.OK,
    };
  } 

  
  async unlikeProduct(@Session() request: Record<string, any>,productId:CreateProductLikeDto ): Promise<{ message: string; statusCode: number }> {
    const userId = request.idUser;

    if (!userId) {
      if (request.likes) {
        request.likes = request.likes.filter((id: number) => id !== productId.productId);

      }
      return {
        message: 'Produit déliké et retiré de la session',
        statusCode: HttpStatus.OK,
      };
    }

    const user = await this.userService.findById(userId);
    const product = await this.productService.findById(productId.productId);

    if (!user || !product) {
      return {
        message: 'Utilisateur ou produit introuvable',
        statusCode: HttpStatus.NOT_FOUND,
      };
    }

    await this.productLikeRepository.delete({user:user.data, product:product.data});

    return {
        message: 'Produit déliké avec succès',
        statusCode: HttpStatus.OK,
    };
  }

  async findAll(@Session() request: Record<string, any>) {
    const userId = request.idUser;
    const list1 = [];
  
    if (!userId) {
      if (request.likes && request.likes.length > 0) {
        for (const productId of request.likes) {
          const product = await this.productService.findById(productId);
          if (product) {
            list1.push(product);
          }
        }
      } 
      return {
        data: list1,
        statusCode: HttpStatus.OK,
      };
    }
  
    const user = await this.userService.findById(userId);
  
    if (!user || !user.data) {
      return {
        message: 'Utilisateur introuvable',
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  
    const list2 = await this.productLikeRepository.find({ where: { user: { id: user.data.id } } ,relations:{product:true},
      select:{
        product:{
          id:true,
          

        }}});
    console.log(list2[0])
    for (const productLike of list2) {
      const product = await this.productService.findById(productLike.product.id);
      if (product) {
        list1.push(product);
      }
    }
  
    return {
      data: list1,
      statusCode: HttpStatus.OK,
    };
  }
  


  findOne(id: number) {
    return `This action returns a #${id} productLike`;
  }

  update(id: number, updateProductLikeDto: UpdateProductLikeDto) {
    return `This action updates a #${id} productLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} productLike`;
  }
}
