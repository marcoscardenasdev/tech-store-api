import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';

import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('products')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':productId/reviews')
  create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(productId, createReviewDto);
  }

  @Get(':productId/reviews')
  findAll(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.reviewsService.findAll(productId, paginationDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.reviewsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
  //   return this.reviewsService.update(+id, updateReviewDto);
  // }

  @Delete(':productId/reviews/:reviewId')
  remove(@Param('productId', ParseIntPipe) productId: number, @Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.reviewsService.remove(productId,reviewId);
  }
}
