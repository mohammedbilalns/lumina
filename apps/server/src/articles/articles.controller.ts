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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Article, ListArticlesData } from '@lumina/shared-types';
import type { SuccessResponse } from 'src/common/types/api-response.type';
import { ArticlesService } from './articles.service';
import { JwtGuard } from 'src/security/guards/jwt/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type JwtPayload } from 'src/auth/types/jwt-payload.type';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { ArticleResponseMessages } from './constants/response-messages';

@ApiTags('articles')
@ApiBearerAuth()
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Create article',
    description: 'Creates a new article for the authenticated user.',
  })
  @ApiBody({ type: CreateArticleDto })
  async createArticle(
    @CurrentUser()
    user: JwtPayload,

    @Body()
    data: Omit<CreateArticleDto, 'userId'>,
  ): Promise<SuccessResponse<{ article: Article }>> {
    const result = await this.articlesService.createArticle({
      userId: user.sub,
      ...data,
    });

    return {
      message: ArticleResponseMessages.CREATED,
      data: {
        article: result.article,
      },
    };
  }

  @Get('me')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'List my articles',
    description:
      'Returns paginated articles created by the authenticated user.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number. Minimum 1.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    enum: [10, 20, 30],
    description: 'Page size.',
  })
  async listOwnArticles(
    @CurrentUser()
    user: JwtPayload,

    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,
  ): Promise<SuccessResponse<ListArticlesData>> {
    const result = await this.articlesService.listOwnArticles({
      userId: user.sub,
      page,
      limit,
    });

    return {
      message: ArticleResponseMessages.FETCHED_OWN,
      data: {
        articles: result.articles,
        pagination: result.pagination,
      },
    };
  }

  @Get('preferences')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'List preferred articles',
    description:
      'Returns paginated articles matched to the authenticated user preferences.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number. Minimum 1.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    enum: [10, 20, 30],
    description: 'Page size.',
  })
  async listPreferredArticles(
    @CurrentUser()
    user: JwtPayload,

    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,
  ): Promise<SuccessResponse<ListArticlesData>> {
    const result = await this.articlesService.listPreferredArticles({
      userId: user.sub,
      page,
      limit,
    });

    return {
      message: ArticleResponseMessages.FETCHED_PREFERRED,
      data: {
        articles: result.articles,
        pagination: result.pagination,
      },
    };
  }

  @Get('public')
  @ApiOperation({
    summary: 'List public articles',
    description:
      'Returns paginated public articles for guest browsing without requiring authentication.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number. Minimum 1.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    enum: [10, 20, 30],
    description: 'Page size.',
  })
  async listPublicArticles(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,

    @Query('search')
    search?: string,
  ): Promise<SuccessResponse<ListArticlesData>> {
    const result = await this.articlesService.listPublicArticles({
      page,
      limit,
      search,
    });

    return {
      message: ArticleResponseMessages.FETCHED_PUBLIC,
      data: {
        articles: result.articles,
        pagination: result.pagination,
      },
    };
  }

  @Get(':articleId')
  @ApiOperation({
    summary: 'Get article',
    description:
      'Fetches a single article by UUID. Authenticated users still see blocked-article filtering.',
  })
  @ApiParam({
    name: 'articleId',
    description: 'Article UUID.',
    example: '55de50b8-27e6-44d0-a3ec-a851f6cb3659',
  })
  async getArticle(
    @CurrentUser()
    user: JwtPayload | undefined,

    @Param('articleId')
    articleId: string,
  ): Promise<SuccessResponse<{ article: Article }>> {
    const result = await this.articlesService.getArticle({
      userId: user?.sub,
      articleId,
    });

    return {
      message: ArticleResponseMessages.FETCHED_ONE,
      data: {
        article: result.article,
      },
    };
  }

  @Patch(':articleId')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Update article',
    description: 'Updates one or more editable article fields.',
  })
  @ApiParam({
    name: 'articleId',
    description: 'Article UUID.',
    example: '55de50b8-27e6-44d0-a3ec-a851f6cb3659',
  })
  @ApiBody({ type: UpdateArticleDto })
  async updateArticle(
    @CurrentUser()
    user: JwtPayload,

    @Param('articleId')
    articleId: string,

    @Body()
    data: Omit<UpdateArticleDto, 'userId' | 'articleId'>,
  ): Promise<SuccessResponse<{ article: Article }>> {
    const result = await this.articlesService.updateArticle({
      userId: user.sub,
      articleId,
      ...data,
    });

    return {
      message: ArticleResponseMessages.UPDATED,
      data: {
        article: result.article,
      },
    };
  }

  @Delete(':articleId')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Delete article',
    description:
      'Deletes the specified article owned by the authenticated user.',
  })
  @ApiParam({
    name: 'articleId',
    description: 'Article UUID.',
    example: '55de50b8-27e6-44d0-a3ec-a851f6cb3659',
  })
  async deleteArticle(
    @CurrentUser()
    user: JwtPayload,

    @Param('articleId')
    articleId: string,
  ): Promise<SuccessResponse<void>> {
    await this.articlesService.deleteArticle({
      userId: user.sub,
      articleId,
    });

    return {
      message: ArticleResponseMessages.DELETED,
    };
  }
}
