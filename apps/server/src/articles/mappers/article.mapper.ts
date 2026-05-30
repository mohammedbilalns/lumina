import type { Article, PaginationMeta } from '@lumina/shared-types';
import { type ArticleWithRelations } from 'src/database/database.types';

export class ArticleMapper {
  static toArticleResponse(article: ArticleWithRelations): Article {
    return {
      id: article.id,
      title: article.title,
      description: article.description,
      content: article.content,
      featuredImage: article.featuredImage,
      likesCount: article.likesCount,
      reactionType:
        article.viewerReactionType === 'LIKE' ||
        article.viewerReactionType === 'DISLIKE'
          ? article.viewerReactionType
          : null,
      isLiked: article.viewerReactionType === 'LIKE',
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      author: {
        id: article.author.id,
        firstName: article.author.firstName,
        lastName: article.author.lastName,
      },
      category: {
        id: article.category.id,
        name: article.category.name,
        slug: article.category.slug,
      },
    };
  }

  static toArticleListResponse(articles: ArticleWithRelations[]): Article[] {
    return articles.map((article) => this.toArticleResponse(article));
  }

  static toPaginationResponse(
    page: number,
    limit: number,
    total: number,
  ): PaginationMeta {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
