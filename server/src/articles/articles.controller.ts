import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtGuard } from 'src/security/guards/jwt/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type JwtPayload } from 'src/auth/types/jwt-payload.type';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createArticle(
    @CurrentUser()
    user: JwtPayload,

    @Body()
    data: Omit<CreateArticleDto, 'userId'>,
  ) {
    const result = await this.articlesService.createArticle({
      userId: user.sub,
      ...data,
    });

    return {
      message: 'Article created successfully',
      data: {
        article: result.article,
      },
    };
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async listOwnArticles(
    @CurrentUser()
    user: JwtPayload,

    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,
  ) {
    const result = await this.articlesService.listOwnArticles({
      userId: user.sub,
      page,
      limit,
    });

    return {
      message: 'Own articles fetched successfully',
      data: {
        articles: result.articles,
        pagination: result.pagination,
      },
    };
  }

  @Get('preferences')
  @UseGuards(JwtGuard)
  async listPreferredArticles(
    @CurrentUser()
    user: JwtPayload,

    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,
  ) {
    const result = await this.articlesService.listPreferredArticles({
      userId: user.sub,
      page,
      limit,
    });

    return {
      message: 'Preferred articles fetched successfully',
      data: {
        articles: result.articles,
        pagination: result.pagination,
      },
    };
  }

  @Get(':articleId')
  @UseGuards(JwtGuard)
  async getArticle(
    @CurrentUser()
    user: JwtPayload,

    @Param('articleId')
    articleId: string,
  ) {
    const result = await this.articlesService.getArticle({
      userId: user.sub,
      articleId,
    });

    return {
      message: 'Article fetched successfully',
      data: {
        article: result.article,
      },
    };
  }

  @Patch(':articleId')
  @UseGuards(JwtGuard)
  async updateArticle(
    @CurrentUser()
    user: JwtPayload,

    @Param('articleId')
    articleId: string,

    @Body()
    data: Omit<UpdateArticleDto, 'userId' | 'articleId'>,
  ) {
    const result = await this.articlesService.updateArticle({
      userId: user.sub,
      articleId,
      ...data,
    });

    return {
      message: 'Article updated successfully',
      data: {
        article: result.article,
      },
    };
  }

  @Delete(':articleId')
  @UseGuards(JwtGuard)
  async deleteArticle(
    @CurrentUser()
    user: JwtPayload,

    @Param('articleId')
    articleId: string,
  ) {
    await this.articlesService.deleteArticle({
      userId: user.sub,
      articleId,
    });

    return {
      message: 'Article deleted successfully',
    };
  }
}
