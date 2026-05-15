import { type ArticleWithRelations } from 'src/database/database.types';

export class ArticleMapper {
  static toArticleResponse(article: ArticleWithRelations) {
    return {
      id: article.id,
      title: article.title,
      description: article.description,
      content: article.content,
      featuredImage: article.featuredImage,
      likesCount: article.likesCount,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
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

  static toArticleListResponse(articles: ArticleWithRelations[]) {
    return articles.map((article) => this.toArticleResponse(article));
  }

  static toPaginationResponse(page: number, limit: number, total: number) {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
