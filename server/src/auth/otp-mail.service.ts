import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class OtpMailService {
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('RESEND_API_KEY');

    this.resend = new Resend(apiKey);
    this.from = this.configService.getOrThrow<string>('MAIL_FROM');
  }

  async sendSignupOtp(email: string, firstName: string, otp: string) {
    try {
      await this.resend.emails.send({
        from: this.from,
        to: email,
        subject: 'Verify your signup OTP',
        text: `Hi ${firstName}, your OTP is ${otp}. It expires in 10 minutes.`,
        html: `<p>Hi ${firstName},</p><p>Your OTP is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
      });
    } catch {
      throw new InternalServerErrorException('Unable to send OTP email');
    }
  }

  async sendPasswordResetOtp(email: string, firstName: string, otp: string) {
    try {
      await this.resend.emails.send({
        from: this.from,
        to: email,
        subject: 'Reset your password OTP',
        text: `Hi ${firstName}, your password reset OTP is ${otp}. It expires in 10 minutes.`,
        html: `<p>Hi ${firstName},</p><p>Your password reset OTP is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
      });
    } catch {
      throw new InternalServerErrorException('Unable to send OTP email');
    }
  }
}
