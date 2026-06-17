import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateReviewDto } from './dto/create-review.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PrismaService } from '../prisma.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  async create(productId: number, createReviewDto: CreateReviewDto) {

    await this.productsService.findOne(productId); 


    const review = await this.prismaService.review.create({
      data: {
        ...createReviewDto,
        productId,
      },
    });

    return review;
  }

  async findAll(
    productId: number,
    paginationDto: PaginationDto,
  ) {

    const { limit = 10, offset = 1} = paginationDto;

    const reviews = await this.prismaService.review.findMany({
      take: limit,
      skip: ( offset - 1 ) * limit,
      where: { productId },
    });

    const total = await this.prismaService.review.count({
      where: { productId },
    });

    const lastPage = Math.ceil( total / limit );

    return {
      data: reviews,
      meta: {
        limit, page: offset, total, lastPage, 
      },
    };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} review`;
  // }

  // update(id: number, updateReviewDto: UpdateReviewDto) {
  //   return `This action updates a #${id} review`;
  // }

  async remove(productId: number, reviewId: number) {

    const review = await this.prismaService.review.findFirst({
      where: { id: reviewId, productId },
    });

    if ( !review ) {
      throw new NotFoundException(`There is no review with ID #${ reviewId } for product #${ productId }`);
    }

    await this.prismaService.review.delete({
      where: { id: reviewId },
    });

    return  {
      message: `Review with ID #${ reviewId } remove`,
      status: 200,
    };
  }
}
