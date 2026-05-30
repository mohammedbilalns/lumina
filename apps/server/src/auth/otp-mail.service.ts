import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';

@Injectable()
export class OtpMailService {
  private readonly brevoClient: BrevoClient;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('BREVO_API_KEY');

    this.brevoClient = new BrevoClient({ apiKey });
    this.from = this.configService.getOrThrow<string>('MAIL_FROM');
  }

  async sendSignupOtp(email: string, firstName: string, otp: string) {
    try {
      await this.brevoClient.transactionalEmails.sendTransacEmail({
        subject: 'Verify your signup OTP',
        htmlContent: `<p>Hi ${firstName},</p><p>Your OTP is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
        textContent: `Hi ${firstName}, your OTP is ${otp}. It expires in 10 minutes.`,
        sender: { name: 'Lumina', email: this.from },
        to: [{ email: email, name: firstName }],
      });
    } catch (err) {
      console.error('Error sending mail via Brevo:', err);
      throw new InternalServerErrorException('Unable to send OTP email');
    }
  }

  async sendPasswordResetOtp(email: string, firstName: string, otp: string) {
    try {
      await this.brevoClient.transactionalEmails.sendTransacEmail({
        subject: 'Reset your password OTP',
        htmlContent: `<p>Hi ${firstName},</p><p>Your password reset OTP is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
        textContent: `Hi ${firstName}, your password reset OTP is ${otp}. It expires in 10 minutes.`,
        sender: { name: 'Lumina', email: this.from },
        to: [{ email: email, name: firstName }],
      });
    } catch (err) {
      console.error('Error sending password reset mail via Brevo:', err);
      throw new InternalServerErrorException('Unable to send OTP email');
    }
  }
}
