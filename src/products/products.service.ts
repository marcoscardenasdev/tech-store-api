import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateProductDto, UpdateProductDto } from './dto';
import { PrismaService } from '../prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoriesService: CategoriesService,
  ) { }

  async create(createProductDto: CreateProductDto) {

    const { categoryId } = createProductDto;

    // Comprobar que la categoria exista en la BD
    await this.categoriesService.findOne(categoryId);
    
    
    const product = await this.prismaService.product.create({
      data: {
        ...createProductDto,
        categoryId,
      },
    });

    return product;
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 1 } = paginationDto;

    const products = await this.prismaService.product.findMany({
      take: limit,
      skip: (offset - 1) * limit,
      where: { isActive: true },
      include: { category: true },
    });

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
      include: { category: true },
    });

    if ( !product ) {
      throw new NotFoundException(`Product with ID ${ id } not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    
    const { categoryId } = updateProductDto;
    // Si viene el ID de la categoria en el body
    if (categoryId != undefined) {
      // Comprobamos que exista en la BD
      await this.categoriesService.findOne(categoryId);
    }

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
