import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { LoggerService } from '../logger/logger.service'
import { AuthService } from './auth.service'
import { ACCESS_TOKEN, AUTH_CONFIG } from './constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AUTH_CONFIG) authConfig,
    private readonly authService: AuthService,
    private readonly logger: LoggerService
  ) {
    const { secret } = authConfig

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    })

    this.logger.setContext(JwtStrategy.name)
  }

  async validate(payload: any) {
    if (!payload.sub || payload.type !== ACCESS_TOKEN) {
      this.logger.debug(
        'invalid access token payload: ' + JSON.stringify(payload)
      )
      return null
    }
    return await this.authService.profile(payload.sub)
  }
}
