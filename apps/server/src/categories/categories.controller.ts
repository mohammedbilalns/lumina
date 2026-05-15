import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly CategoriesService: CategoriesService) {}

  @Get()
  async getCategories() {
    const result = await this.CategoriesService.getCategories();

    return {
      message: 'Categories fetched successfully',
      data: {
        categories: result.categories,
      },
    };
  }
}
