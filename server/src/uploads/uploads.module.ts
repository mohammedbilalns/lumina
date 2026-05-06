import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { SecurityModule } from 'src/security/security.module';

@Module({
  imports: [SecurityModule],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
