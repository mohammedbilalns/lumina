import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type JwtPayload } from 'src/auth/types/jwt-payload.type';
import { JwtGuard } from 'src/security/guards/jwt/jwt.guard';
import { ReactionsService } from './reactions.service';
import { ReactToArticleDto } from './dtos/react-to-article.dto';
import { BlockArticleDto } from './dtos/block-article.dto';
import { ReactionResponseMessages } from './constants/response-messages';

@ApiTags('reactions')
@ApiBearerAuth()
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post('articles/react')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'React to article',
    description:
      'Stores a LIKE or DISLIKE reaction for the authenticated user on an article.',
  })
  @ApiBody({ type: ReactToArticleDto })
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
      message: ReactionResponseMessages.SAVED,
    };
  }

  @Post('articles/block')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Block article',
    description:
      'Blocks an article for the authenticated user so it can be excluded from future feeds.',
  })
  @ApiBody({ type: BlockArticleDto })
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
      message: ReactionResponseMessages.BLOCKED,
    };
  }
}
