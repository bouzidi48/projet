import { Controller, Get, Post, Body, Patch, Param, Delete, Session, Query, Put, ParseIntPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ReviewEntity } from './entities/review.entity';
import { FindByNameProductDto } from 'src/product/dto/find-by-name-product.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  async create(@Session() request: Record<string, any>, @Body() createReviewDto: CreateReviewDto) {
    return await this.reviewService.create(request, createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('product')
  async findAllByProduct(@Query() nameProduct: FindByNameProductDto) {
    return this.reviewService.findAllByProduct(nameProduct);
  }

  @Get('average-rating')
  async getAverageRating(@Query() nameProductDto: FindByNameProductDto) {
    const averageRating = await this.reviewService.getAverageRating(nameProductDto);
    return { averageRating };
  }

  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number): Promise<ReviewEntity> {
    return await this.reviewService.findOne(+id);
  }

  @Put('updateReview')
  async updateReview(@Session() request: Record<string, any>, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.updateReview(request, updateReviewDto);
  }

  @Delete('deleteReview/:id')
  async deleteReview(@Session() request: Record<string, any>, @Param('id', ParseIntPipe) id: number) {
    return this.reviewService.deleteReview(request, id);
  }
}
