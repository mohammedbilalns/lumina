import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  count,
  desc,
  eq,
  inArray,
  isNull,
  ne,
  notInArray,
} from 'drizzle-orm';
import {
  type ArticleWithRelations,
  type Database,
} from 'src/database/database.types';
import {
  articleReactions,
  articles,
  userPreferences,
} from 'src/database/schemas';

interface CreateArticleData {
  title: string;
  description: string;
  content: string;
  featuredImage?: string | null;
  authorId: string;
  categoryId: string;
}

interface UpdateArticleData {
  title?: string;
  description?: string;
  content?: string;
  featuredImage?: string | null;
  categoryId?: string;
}

@Injectable()
export class ArticlesRepository {
  constructor(
    @Inject('DATABASE')
    private readonly db: Database,
  ) {}

  async createArticle(data: CreateArticleData) {
    const [article] = await this.db.insert(articles).values(data).returning();

    return this.findById(article.id);
  }

  async findById(articleId: string) {
    return this.db.query.articles.findFirst({
      where: and(eq(articles.id, articleId), isNull(articles.deletedAt)),
      with: {
        author: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        category: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }) as Promise<ArticleWithRelations | undefined>;
  }

  async findVisibleById(articleId: string, userId: string) {
    const isBlocked = await this.isArticleBlockedByUser(articleId, userId);

    if (isBlocked) {
      return undefined;
    }

    return this.findById(articleId);
  }

  async findOwnedById(articleId: string, authorId: string) {
    return this.db.query.articles.findFirst({
      where: and(
        eq(articles.id, articleId),
        eq(articles.authorId, authorId),
        isNull(articles.deletedAt),
      ),
      with: {
        author: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        category: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }) as Promise<ArticleWithRelations | undefined>;
  }

  async updateArticle(articleId: string, data: UpdateArticleData) {
    await this.db
      .update(articles)
      .set(data)
      .where(and(eq(articles.id, articleId), isNull(articles.deletedAt)));

    return this.findById(articleId);
  }

  async softDeleteArticle(articleId: string) {
    await this.db
      .update(articles)
      .set({ deletedAt: new Date() })
      .where(and(eq(articles.id, articleId), isNull(articles.deletedAt)));
  }

  async listOwnArticles(authorId: string, page: number, limit: number) {
    const whereClause = and(
      eq(articles.authorId, authorId),
      isNull(articles.deletedAt),
    );

    const [items, totalResult] = await Promise.all([
      this.db.query.articles.findMany({
        where: whereClause,
        with: {
          author: {
            columns: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          category: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: [desc(articles.createdAt)],
        limit,
        offset: (page - 1) * limit,
      }) as Promise<ArticleWithRelations[]>,
      this.db.select({ total: count() }).from(articles).where(whereClause),
    ]);

    return {
      items,
      total: totalResult[0]?.total ?? 0,
    };
  }

  async listByUserPreferences(userId: string, page: number, limit: number) {
    const preferences = await this.db
      .select({ categoryId: userPreferences.categoryId })
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    const categoryIds = preferences.map((preference) => preference.categoryId);

    if (categoryIds.length === 0) {
      return {
        items: [],
        total: 0,
      };
    }

    const blockedArticleIds = await this.getBlockedArticleIds(userId);
    const conditions = [
      inArray(articles.categoryId, categoryIds),
      isNull(articles.deletedAt),
      ne(articles.authorId, userId),
    ];

    if (blockedArticleIds.length > 0) {
      conditions.push(notInArray(articles.id, blockedArticleIds));
    }

    const whereClause = and(...conditions);

    const [items, totalResult] = await Promise.all([
      this.db.query.articles.findMany({
        where: whereClause,
        with: {
          author: {
            columns: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          category: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: [desc(articles.createdAt)],
        limit,
        offset: (page - 1) * limit,
      }) as Promise<ArticleWithRelations[]>,
      this.db.select({ total: count() }).from(articles).where(whereClause),
    ]);

    return {
      items,
      total: totalResult[0]?.total ?? 0,
    };
  }

  private async isArticleBlockedByUser(articleId: string, userId: string) {
    const reaction = await this.db.query.articleReactions.findFirst({
      where: and(
        eq(articleReactions.articleId, articleId),
        eq(articleReactions.userId, userId),
        eq(articleReactions.reactionType, 'BLOCKED'),
      ),
    });

    return Boolean(reaction);
  }

  private async getBlockedArticleIds(userId: string) {
    const reactions = await this.db.query.articleReactions.findMany({
      where: and(
        eq(articleReactions.userId, userId),
        eq(articleReactions.reactionType, 'BLOCKED'),
      ),
      columns: {
        articleId: true,
      },
    });

    return reactions
      .map((reaction) => reaction.articleId)
      .filter((articleId): articleId is string => Boolean(articleId));
  }
}
