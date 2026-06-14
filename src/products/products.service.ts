import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateProductDto, UpdateProductDto } from './dto';
import { PrismaService } from '../prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService {

  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createProductDto: CreateProductDto) {

    const product = await this.prismaService.product.create({
      data: createProductDto,
    });

    return product;
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 1 } = paginationDto;

    const products = await this.prismaService.product.findMany({
      take: limit,
      skip: (offset - 1) * limit,
      where: { isActive: true },
    })

    const total = await this.prismaService.product.count({
      where: {
        isActive: true,
      },
    });

    const lastPage = Math.ceil(total / limit);

    return {
      data: products,
      meta: {
        limit, page: offset, total, lastPage,
      }
    }
  }

  async findOne(id: number) {
    const product = await this.prismaService.product.findFirst({
      where: { id },
    });

    if ( !product ) {
      throw new NotFoundException(`Product with ID ${ id } not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    
    await this.findOne(id);
    const newProduct = await this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });

    return newProduct;
  }

  async remove(id: number) {

    await this.findOne(id);

    await this.prismaService.product.delete({
      where: { id },
    });

    return {
      'message': `Product with ID ${ id } removed`,
      'status': 200,
    };
  }
}
