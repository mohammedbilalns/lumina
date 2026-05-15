import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ArticlesRepository } from './articles.repository';
import { UsersRepository } from 'src/users/users.repository';
import { UserValidationService } from 'src/users/user-validation.service';
import { CategoriesRepository } from 'src/categories/categories.repository';
import { CreateArticleDto } from './dtos/create-article.dto';
import { ArticleMapper } from './mappers/article.mapper';
import { GetArticleDto } from './dtos/get-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { DeleteArticleDto } from './dtos/delete-article.dto';
import { ListOwnArticlesDto } from './dtos/list-own-articles.dto';
import { ListPreferredArticlesDto } from './dtos/list-preferred-articles.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly userValidationService: UserValidationService,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async createArticle(dto: CreateArticleDto) {
    await this.validateActiveUser(dto.userId);
    await this.validateCategory(dto.categoryId);

    const article = await this.articlesRepository.createArticle({
      title: dto.title,
      description: this.generateDescription(dto.content),
      content: dto.content,
      featuredImage: dto.featuredImage?.trim() || null,
      authorId: dto.userId,
      categoryId: dto.categoryId,
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return { article: ArticleMapper.toArticleResponse(article) };
  }

  async getArticle(dto: GetArticleDto) {
    await this.validateActiveUser(dto.userId);

    const article = await this.articlesRepository.findVisibleById(
      dto.articleId,
      dto.userId,
    );

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return { article: ArticleMapper.toArticleResponse(article) };
  }

  async updateArticle(dto: UpdateArticleDto) {
    await this.validateActiveUser(dto.userId);

    const existingArticle = await this.articlesRepository.findOwnedById(
      dto.articleId,
      dto.userId,
    );

    if (!existingArticle) {
      throw new NotFoundException('Article not found');
    }

    const categoryId = dto.categoryId ?? existingArticle.category.id;

    if (dto.categoryId) {
      await this.validateCategory(dto.categoryId);
    }

    const updatedArticle = await this.articlesRepository.updateArticle(
      dto.articleId,
      {
        title: dto.title ?? existingArticle.title,
        description: this.generateDescription(
          dto.content ?? existingArticle.content,
        ),
        content: dto.content ?? existingArticle.content,
        featuredImage:
          dto.featuredImage === undefined
            ? existingArticle.featuredImage
            : dto.featuredImage.trim() || null,
        categoryId,
      },
    );

    if (!updatedArticle) {
      throw new NotFoundException('Article not found');
    }

    return { article: ArticleMapper.toArticleResponse(updatedArticle) };
  }

  async deleteArticle(dto: DeleteArticleDto) {
    await this.validateActiveUser(dto.userId);

    const article = await this.articlesRepository.findOwnedById(
      dto.articleId,
      dto.userId,
    );

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    await this.articlesRepository.softDeleteArticle(dto.articleId);
  }

  async listOwnArticles(dto: ListOwnArticlesDto) {
    await this.validateActiveUser(dto.userId);
    this.validatePagination(dto.page, dto.limit);

    const { items, total } = await this.articlesRepository.listOwnArticles(
      dto.userId,
      dto.page,
      dto.limit,
    );

    return {
      articles: ArticleMapper.toArticleListResponse(items),
      pagination: ArticleMapper.toPaginationResponse(
        dto.page,
        dto.limit,
        total,
      ),
    };
  }

  async listPreferredArticles(dto: ListPreferredArticlesDto) {
    await this.validateActiveUser(dto.userId);
    this.validatePagination(dto.page, dto.limit);

    const { items, total } =
      await this.articlesRepository.listByUserPreferences(
        dto.userId,
        dto.page,
        dto.limit,
        dto.search,
      );

    return {
      articles: ArticleMapper.toArticleListResponse(items),
      pagination: ArticleMapper.toPaginationResponse(
        dto.page,
        dto.limit,
        total,
      ),
    };
  }

  private async validateActiveUser(userId: string) {
    const user = await this.usersRepository.findById(userId);
    this.userValidationService.validateActiveUser(user);
  }

  private async validateCategory(categoryId: string) {
    const category = await this.categoriesRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }

  private validatePagination(page: number, limit: number) {
    if (page < 1) {
      throw new BadRequestException('Page must be greater than 0');
    }

    if (![10, 20, 30].includes(limit)) {
      throw new BadRequestException('Limit must be one of 10, 20, or 30');
    }
  }

  private generateDescription(content: string) {
    const plainText = content
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, ' ')
      .trim();

    if (!plainText) {
      throw new BadRequestException(
        'Content must contain text to generate description',
      );
    }

    return plainText.slice(0, 500);
  }
}
