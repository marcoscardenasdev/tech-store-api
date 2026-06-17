import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PrismaService } from '../prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class CategoriesService {

  private readonly logger = new Logger('CategoriesService');

  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    
    try {
      
      const category = await this.prismaService.category.create({
        data: createCategoryDto,
      });

      return category;
    } catch (error) {
      this.handlerDBExeptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 1} = paginationDto;

    const categories = await this.prismaService.category.findMany({
      take: limit,
      skip: (offset - 1) * limit,
    });

    const total = await this.prismaService.category.count({});

    const lastPage = Math.ceil(total / limit);

    return {
      data: categories,
      meta: {
        limit, page: offset, total, lastPage,
      },
    };
  }

  async findOne(id: number) {

    const category = await this.prismaService.category.findFirst({
      where: { id },
      include: { products: true },
    });

    if ( !category ) {
      throw new NotFoundException(`Category with ID: #${ id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {

    await this.findOne( id );

    const newCategory = await this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });


    return newCategory;
  }

  async remove(id: number) {

    await this.findOne( id );

    try {
      
      await this.prismaService.category.delete({
        where: { id },
      });

      return {
        message: `Category with ID: ${ id } remove`,
        status: 200, 
      };

    } catch (error) {
      this.handlerDBExeptions(error, id);  
    }

  }

  private handlerDBExeptions(error: any, id?: number) {


    if (error.code === 'P2002') {
      throw new ConflictException('The category name is already in use');
    }
    
    if (error.code === 'P2003' && id) {
        throw new ConflictException(`Cannot delete category #${ id } because it has associated products`);
    }
    


    this.logger.error(error);

  }
}
