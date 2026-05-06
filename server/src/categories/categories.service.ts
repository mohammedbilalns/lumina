import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {

  constructor(
    private readonly categoryRepository: CategoriesRepository,
  ){}

  async getCategories() {
    const categories = await this.categoryRepository.getCategories()
    return {categories}
  }

}
