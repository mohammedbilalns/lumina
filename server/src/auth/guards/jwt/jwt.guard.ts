import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest } from 'src/auth/types/auth-requst.type';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { Request } from 'express';


@Injectable()
export class JwtGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService
  ){}

  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest<AuthRequest>()

    const token = this.extractTokenFromHeader(request) 

    if(!token){
      throw new UnauthorizedException("Missing token")
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token)
      request.user = payload
      return true 

    }catch(err){
      throw new UnauthorizedException("Invalid token")

    }
  }

  private extractTokenFromHeader(
    request: Request
  ){
    const [type , token] = request.headers.authorization?.split(" ") ?? []

    return type === "Bearer" ? token : undefined
  }
}
