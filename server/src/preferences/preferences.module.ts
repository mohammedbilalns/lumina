import { Module } from '@nestjs/common';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';
import { PreferencesRepository } from './preferences.repository';
import { SecurityModule } from 'src/security/security.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SecurityModule, UsersModule],
  controllers: [PreferencesController],
  providers: [PreferencesService,PreferencesRepository]
})
export class PreferencesModule {}
