import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { CreatePresignedUploadUrlDto } from './dtos/create-presigned-upload-url.dto';

@Injectable()
export class UploadsService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.getRequiredConfig('AWS_BUCKET_NAME');
    this.region = this.getRequiredConfig('AWS_REGION');

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.getRequiredConfig('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.getRequiredConfig('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async createPresignedUploadUrl(
    userId: string,
    dto: CreatePresignedUploadUrlDto,
  ) {
    this.validateContentType(dto.contentType);

    const key = this.buildObjectKey(userId, dto.fileName, dto.contentType);
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: dto.contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 5,
    });

    return {
      uploadUrl,
      key,
      expiresIn: 300,
      method: 'PUT',
      contentType: dto.contentType,
    };
  }

  private buildObjectKey(
    userId: string,
    fileName: string | undefined,
    contentType: string,
  ) {
    const extension = this.getExtension(fileName, contentType);

    return `articles/${userId}/${Date.now()}-${randomUUID()}.${extension}`;
  }

  private getExtension(fileName: string | undefined, contentType: string) {
    const sanitizedName = fileName?.trim().toLowerCase();

    if (sanitizedName?.includes('.')) {
      const extension = sanitizedName.split('.').pop();

      if (extension) {
        return extension.replace(/[^a-z0-9]/g, '') || 'bin';
      }
    }

    const mappedExtension = this.mapContentTypeToExtension(contentType);

    return mappedExtension ?? 'bin';
  }

  private mapContentTypeToExtension(contentType: string) {
    const extensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/svg+xml': 'svg',
      'image/avif': 'avif',
    };

    return extensions[contentType];
  }

  private validateContentType(contentType: string) {
    if (!contentType.startsWith('image/')) {
      throw new BadRequestException('Only image uploads are allowed');
    }
  }

  private getRequiredConfig(key: string) {
    const value = this.configService.get<string>(key);

    if (!value) {
      throw new BadRequestException(`${key} is not configured`);
    }

    return value;
  }
}
