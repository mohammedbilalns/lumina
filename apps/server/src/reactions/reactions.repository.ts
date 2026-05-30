import { Inject, Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { type Database } from 'src/database/database.types';
import { articleReactions, articles } from 'src/database/schemas';

@Injectable()
export class ReactionsRepository {
  constructor(
    @Inject('DATABASE')
    private readonly db: Database,
  ) {}

  async saveReaction(
    userId: string,
    articleId: string,
    reactionType: 'LIKE' | 'DISLIKE' | 'BLOCKED',
  ) {
    return this.db.transaction(async (tx) => {
      const existingReaction = await tx.query.articleReactions.findFirst({
        where: and(
          eq(articleReactions.userId, userId),
          eq(articleReactions.articleId, articleId),
        ),
      });

      const isToggleOff = existingReaction?.reactionType === reactionType;
      const nextReactionType = isToggleOff ? undefined : reactionType;
      const likesDelta =
        this.getReactionWeight(nextReactionType) -
        this.getReactionWeight(existingReaction?.reactionType);

      if (existingReaction) {
        await tx
          .delete(articleReactions)
          .where(eq(articleReactions.id, existingReaction.id));
      }

      let reaction: {
        id: string;
        createdAt: Date;
        userId: string | null;
        articleId: string | null;
        reactionType: 'LIKE' | 'DISLIKE' | 'BLOCKED';
      } | null = null;

      if (nextReactionType) {
        [reaction] = await tx
          .insert(articleReactions)
          .values({
            userId,
            articleId,
            reactionType: nextReactionType,
          })
          .returning();
      }

      if (likesDelta !== 0) {
        await tx
          .update(articles)
          .set({
            likesCount: sql`GREATEST(0, ${articles.likesCount} + ${likesDelta})`,
          })
          .where(eq(articles.id, articleId));
      }

      return reaction;
    });
  }

  private getReactionWeight(reactionType?: 'LIKE' | 'DISLIKE' | 'BLOCKED') {
    if (reactionType === 'LIKE') {
      return 1;
    }

    if (reactionType === 'DISLIKE') {
      return -1;
    }

    return 0;
  }
}
