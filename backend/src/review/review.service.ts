import { HttpStatus, Inject, Injectable, NotFoundException, Session } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ProductService } from 'src/product/product.service';
import { request } from 'express';
import { Roles } from '../enum/user_enum';
import { ReviewRepository } from './review.repository';
import { FindByNameProductDto } from 'src/product/dto/find-by-name-product.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';
import { UserController } from 'src/user/user.controller';
import { ProductController } from 'src/product/product.controller';

@Injectable()
export class ReviewService {
  constructor(

    private readonly userService: UserService,
    private readonly productService: ProductService,
    @InjectRepository(ReviewEntity) private readonly reviewRepository: ReviewRepository) { }

  async create(@Session() request: Record<string, any>, createReviewDto: CreateReviewDto) {
    const idUser = request.idUser
    console.log(idUser)
    if (!idUser) {
      return await {
        message: 'vous devez vous connecter pour ajouter un review',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    const user = await this.userService.findById(idUser)
    if (!user || (user.data.role != Roles.ADMIN && user.data.role != Roles.USER && user.data.role != Roles.SUPERADMIN)) {
      return await {
        message: 'vous devez etre appartient a cette application',
        statusCode: HttpStatus.BAD_REQUEST,

      }
    }
    const product = await this.productService.findByNameProduct({ nameProduct: createReviewDto.nameProduct });

    if (!product) {
      return await {
        message: 'ce produit n\'existe pas',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    let review = await this.findOneByUserAndProduct(idUser, product.data.id);
    if (review) {
      return await {
        message: 'vous avez deja ajoute un review pour ce produit',
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }
    review = this.reviewRepository.create(createReviewDto);
    review.user = user.data;
    review.product = product.data;
    review.createdate = new Date();
    this.reviewRepository.save(review)
    return await {
      message: 'review  ajoute avec succes',
      statusCode: HttpStatus.OK,

    }
  }
  async findAll() {
    const review = await this.reviewRepository.find({ relations: ['product', 'user'] });
    if (!review) return await {
      data: null,
      statusCode: HttpStatus.BAD_REQUEST,
    }
    return await {
      data: review,
      statusCode: HttpStatus.OK,

    }
  }

  async findAllByProduct(nameProdct: FindByNameProductDto): Promise<ReviewEntity[]> {
    const product = await this.productService.findByNameProduct(nameProdct);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return await this.reviewRepository.find({
      where: { product: { id: product.data.id } },
      relations: ['user', 'product', 'product.category'],
    });
  }

  async getAverageRating(nameProductDto: FindByNameProductDto) {
    const product = await this.productService.findByNameProduct(nameProductDto);
    if (product.statusCode != 200) {
      return await {
        data: 0,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    const productId = product.data.id;

    const result = await this.reviewRepository.query(
      'SELECT AVG(ratings) as averageRating FROM review WHERE productId = ?',
      [productId],
    );

    if (result.length === 0 || result[0].averageRating === null) {
      return 0; // Aucun avis, donc moyenne de 0
    }

    return parseFloat(result[0].averageRating);
  }


  async findOne(id: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: {
          category: true
        }
      }
    })
    if (!review) throw new NotFoundException('Review not Found. ')

    return review;
  }

  async updateReview(
    @Session() request: Record<string, any>,
    updateReviewDto: UpdateReviewDto
  ) {
    const idAdmin = request.idUser;
    if (!idAdmin) {
      return {
        message: 'vous devez vous connecter pour mettre à jour un review',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    const admin = await this.userService.findById(idAdmin);
    if (!admin || (admin.data.role != Roles.ADMIN && admin.data.role != Roles.USER && admin.data.role != Roles.SUPERADMIN)) {
      return {
        message: 'vous devez etre appartient a cette application',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    if (admin.data.role != Roles.USER) {
      return {
        message: 'review non trouvé ou vous n\'êtes pas autorisé à le mettre à jour',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    /*  const product = await this.productService.findByNameProduct({ nameProduct: updateReviewDto.nameProduct });
 
     if (! product) {
       return {
         message: 'ce produit n\'existe pas',
         statusCode: HttpStatus.BAD_REQUEST,
       };
     } */

    const review = await this.reviewRepository.findOne({ where: { id: updateReviewDto.id, user: { id: idAdmin } } });
    if (!review) {
      return {
        message: 'review non trouvé ou vous n\'êtes pas autorisé à le mettre à jour',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    Object.assign(review, updateReviewDto);
    //review.product = product.data;
    review.updatedate = new Date(); // Ajout de la date de mise à jour
    await this.reviewRepository.save(review);

    return {
      message: 'review mis à jour avec succès',
      statusCode: HttpStatus.OK,
    };
  }
  async deleteReview(
    @Session() request: Record<string, any>,
    id: number
  ) {
    const idUser = request.idUser;
    console.log(idUser)
    if (!idUser) {

      return {
        message: 'vous devez vous connecter pour supprimer un review',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    } else {
      const admin = await this.userService.findById(idUser);
      if (!admin || (admin.data.role != Roles.ADMIN && admin.data.role != Roles.USER && admin.data.role != Roles.SUPERADMIN)) {
        return {
          message: 'vous devez etre appartient a cette application',
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
      if (admin.data.role != Roles.USER) {
        const review = await this.reviewRepository.findOne({ where: { id: id, user: { id: idUser } } });
        if (!review) {
          return {
            message: 'review non trouvé ou vous n\'êtes pas autorisé à le supprimer',
            statusCode: HttpStatus.BAD_REQUEST,
          };
        }

        await this.reviewRepository.remove(review);
        return {
          message: 'review supprimé avec succès',
          statusCode: HttpStatus.OK,
        };
      }
      const review = await this.reviewRepository.findOne({ where: { id: id } });
      if (!review) {
        return {
          message: 'review non trouvé ou vous n\'êtes pas autorisé à le supprimer',
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      await this.reviewRepository.remove(review);
      return {
        message: 'review supprimé avec succès',
        statusCode: HttpStatus.OK,
      };
    }
  }



  async findOneByUserAndProduct(userId: number, productId: number) {
  return await this.reviewRepository.findOne({
    where: {
      user: {
        id: userId
      },
      product: {
        id: productId
      }

    },
    relations: {
      user: true,
      product: {
        category: true
      }
    }
  })
}
}
