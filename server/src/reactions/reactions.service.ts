import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReactionsRepository } from './reactions.repository';
import { ArticlesRepository } from 'src/articles/articles.repository';
import { UsersRepository } from 'src/users/users.repository';
import { UserValidationService } from 'src/users/user-validation.service';
import { ReactToArticleDto } from './dtos/react-to-article.dto';
import { BlockArticleDto } from './dtos/block-article.dto';

@Injectable()
export class ReactionsService {
  constructor(
    private readonly reactionsRepository: ReactionsRepository,
    private readonly articlesRepository: ArticlesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly userValidationService: UserValidationService,
  ) {}

  async reactToArticle(dto: ReactToArticleDto) {
    await this.validateActiveUser(dto.userId);

    const article = await this.articlesRepository.findById(dto.articleId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    await this.reactionsRepository.saveReaction(
      dto.userId,
      dto.articleId,
      dto.reactionType,
    );
  }

  async blockArticle(dto: BlockArticleDto) {
    await this.validateActiveUser(dto.userId);

    const article = await this.articlesRepository.findById(dto.articleId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.author.id === dto.userId) {
      throw new BadRequestException('You cannot block your own article');
    }

    await this.reactionsRepository.saveReaction(dto.userId, dto.articleId, 'BLOCKED');
  }

  private async validateActiveUser(userId: string) {
    const user = await this.usersRepository.findById(userId);
    this.userValidationService.validateActiveUser(user);
  }
}
