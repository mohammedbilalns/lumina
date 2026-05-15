import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type JwtPayload } from 'src/auth/types/jwt-payload.type';
import { JwtGuard } from 'src/security/guards/jwt/jwt.guard';
import { ReactionsService } from './reactions.service';
import { ReactToArticleDto } from './dtos/react-to-article.dto';
import { BlockArticleDto } from './dtos/block-article.dto';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post('articles/react')
  @UseGuards(JwtGuard)
  async reactToArticle(
    @CurrentUser()
    user: JwtPayload,

    @Body()
    data: Omit<ReactToArticleDto, 'userId'>,
  ) {
    await this.reactionsService.reactToArticle({
      userId: user.sub,
      ...data,
    });

    return {
      message: 'Article reaction saved successfully',
    };
  }

  @Post('articles/block')
  @UseGuards(JwtGuard)
  async blockArticle(
    @CurrentUser()
    user: JwtPayload,

    @Body()
    data: Omit<BlockArticleDto, 'userId'>,
  ) {
    await this.reactionsService.blockArticle({
      userId: user.sub,
      ...data,
    });

    return {
      message: 'Article blocked successfully',
    };
  }
}
