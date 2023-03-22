import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LoggerService } from '../logger/logger.service'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { ACCESS_TOKEN, AUTH_CONFIG, REFRESH_TOKEN } from './constants'
import { UserLoginResultDto } from './dto/user-login-result.dto'
import { UserTokenHistoryService } from './user-token-history.service'

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_CONFIG) private readonly authConfig,
    private readonly usersService: UsersService,
    private readonly historyService: UserTokenHistoryService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(AuthService.name)
  }

  private standardizeUser(user: User) {
    if (!user) return null
    delete user.password
    return user
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByUsername(username)
    if (user?.password !== password) return null
    return this.standardizeUser(user)
  }

  async profile(userId: string): Promise<User> {
    const user = await this.usersService.findOne(userId)
    return this.standardizeUser(user)
  }

  async login(user: any, refreshToken?: string): Promise<UserLoginResultDto> {
    const { refreshTokenExpiresIn } = this.authConfig
    const payload = {
      type: ACCESS_TOKEN,
      username: user.username,
      sub: user.id,
    }

    const accessToken = this.jwtService.sign(payload)
    if (refreshToken === undefined) {
      refreshToken = this.jwtService.sign(
        { ...payload, type: REFRESH_TOKEN },
        { expiresIn: refreshTokenExpiresIn }
      )
    }

    await this.historyService.insert(user.id, accessToken, refreshToken)
    return { accessToken, refreshToken }
  }

  verifyRefreshToken(token: string) {
    const result = this.jwtService.verify(token)
    if (result?.type !== REFRESH_TOKEN)
      throw new Error('token verified but was not a refresh token')
    return result
  }
}
