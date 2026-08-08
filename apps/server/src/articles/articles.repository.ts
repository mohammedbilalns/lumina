import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  isNull,
  ne,
  notInArray,
  or,
  SQL,
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
    const blockedArticleIdsSubquery = this.db
      .select({ articleId: articleReactions.articleId })
      .from(articleReactions)
      .where(
        and(
          eq(articleReactions.userId, userId),
          eq(articleReactions.reactionType, 'BLOCKED'),
          eq(articleReactions.articleId, articleId),
        ),
      );

    return this.db.query.articles.findFirst({
      where: and(
        eq(articles.id, articleId),
        isNull(articles.deletedAt),
        notInArray(articles.id, blockedArticleIdsSubquery),
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

  async listOwnArticles(
    authorId: string,
    page: number,
    limit: number,
  ) {
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

  async listByUserPreferences(
    userId: string,
    page: number,
    limit: number,
    search?: string,
    categoryId?: string,
  ) {
    const blockedArticleIdsSubquery = this.db
      .select({ articleId: articleReactions.articleId })
      .from(articleReactions)
      .where(
        and(
          eq(articleReactions.userId, userId),
          eq(articleReactions.reactionType, 'BLOCKED'),
        ),
      );

    let whereClause: SQL;

    if (categoryId) {
      const conditions: SQL[] = [
        eq(articles.categoryId, categoryId),
        isNull(articles.deletedAt),
        ne(articles.authorId, userId),
        notInArray(articles.id, blockedArticleIdsSubquery),
      ];

      if (search) {
        const searchCondition = or(
          ilike(articles.title, `%${search}%`),
          ilike(articles.description, `%${search}%`),
        );
        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }

      whereClause = and(...conditions) as SQL;
    } else {
      const categoryIdsSubquery = this.db
        .select({ categoryId: userPreferences.categoryId })
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId));

      const conditions: SQL[] = [
        inArray(articles.categoryId, categoryIdsSubquery),
        isNull(articles.deletedAt),
        ne(articles.authorId, userId),
        notInArray(articles.id, blockedArticleIdsSubquery),
      ];

      if (search) {
        const searchCondition = or(
          ilike(articles.title, `%${search}%`),
          ilike(articles.description, `%${search}%`),
        );
        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }

      whereClause = and(...conditions) as SQL;
    }

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

  async listPublicArticles(page: number, limit: number, search?: string) {
    const conditions: SQL[] = [isNull(articles.deletedAt)];

    if (search) {
      const searchCondition = or(
        ilike(articles.title, `%${search}%`),
        ilike(articles.description, `%${search}%`),
      );

      if (searchCondition) {
        conditions.push(searchCondition);
      }
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

  async findReactionType(userId: string, articleId: string) {
    const reaction = await this.db.query.articleReactions.findFirst({
      where: and(
        eq(articleReactions.userId, userId),
        eq(articleReactions.articleId, articleId),
      ),
      columns: {
        reactionType: true,
      },
    });

    return reaction?.reactionType ?? null;
  }

  async findReactionTypes(userId: string, articleIds: string[]) {
    if (articleIds.length === 0) {
      return new Map<string, 'LIKE' | 'DISLIKE' | 'BLOCKED'>();
    }

    const reactions = await this.db.query.articleReactions.findMany({
      where: and(
        eq(articleReactions.userId, userId),
        inArray(articleReactions.articleId, articleIds),
      ),
      columns: {
        articleId: true,
        reactionType: true,
      },
    });

    return new Map(
      reactions.map((reaction) => [reaction.articleId, reaction.reactionType]),
    );
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
