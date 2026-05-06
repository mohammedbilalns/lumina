import argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  async hash(password: string) {
    return argon2.hash(password);
  }

  async verify(hash: string, password: string) {
    return argon2.verify(hash, password);
  }
}
