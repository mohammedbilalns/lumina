import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Category } from '@lumina/shared-types';
import type { SuccessResponse } from 'src/common/types/api-response.type';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly CategoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'List categories',
    description: 'Returns all available article categories. This endpoint does not require request input.',
  })
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
