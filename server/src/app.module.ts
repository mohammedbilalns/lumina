import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PreferencesModule } from './preferences/preferences.module';
import { ArticlesModule } from './articles/articles.module';
import { ReactionsModule } from './reactions/reactions.module';

@Module({
  imports: [AuthModule, UsersModule, CategoriesModule, PreferencesModule, ArticlesModule, ReactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
