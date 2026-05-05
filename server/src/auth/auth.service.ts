import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { PasswordService } from './password.service';
import { AuthMapper } from './mappers/auth.mapper';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService
  ){}

  async signup(dto: SignupDto){
    const [existingUserWithEmail, existingUserWithPhone] = await Promise.all([
      this.authRepository.findByEmail(dto.email),
      this.authRepository.findByPhone(dto.phone)
    ])

    if(existingUserWithEmail){
      throw new ConflictException("Email already exists")
    }

    if(existingUserWithPhone){
      throw new ConflictException("Phone number already exists")
    }

    const passwordHash = await this.passwordService.hash(dto.password) 


    const user =  await this.authRepository.createUser({
      ...dto,
      dateOfBirth: dto.dateOfBirth,
      passwordHash
    })

    const accessToken = await this.generateAccessToken(
      user.id,
      user.email
    )

    return { message: "Signup successful", ...AuthMapper.toAuthReponse(user,accessToken)}
  }

  async login(dto: LoginDto){

    const user = await this.authRepository.findByCredential(dto.credential)
    if(!user) throw new UnauthorizedException("Invalid credential")

    if(!user.isActive){
      throw new ForbiddenException("Your account has been blocked")
    }

    const isValid = await this.passwordService.verify(user.passwordHash, dto.password)

    if(!isValid) throw new UnauthorizedException("Invalid password")

    const accessToken = await this.generateAccessToken(user.id, user.email)

    return {
      message: "Login successful",
      ...AuthMapper.toAuthReponse(user,accessToken)
    }

  }


  private async generateAccessToken(userId: string, email: string){
    return this.jwtService.signAsync({
      sub: userId,
      email
    })
  }
}
