import { Controller, Get } from '@nestjs/common';
import type { Category } from '@lumina/shared-types';
import type { SuccessResponse } from 'src/common/types/api-response.type';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly CategoriesService: CategoriesService) {}

  @Get()
  async getCategories(): Promise<SuccessResponse<{ categories: Category[] }>> {
    const result = await this.CategoriesService.getCategories();

    return {
      message: 'Categories fetched successfully',
      data: {
        categories: result.categories,
      },
    };
  }
}
