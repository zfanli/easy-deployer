import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { LoggerService } from '@/logger/logger.service'
import { User } from '@/users/entities/user.entity'
import { UsersService } from '@/users/users.service'
import { AuthService } from './auth.service'
import { UserLoginResultDto } from './dto/user-login-result.dto'
import { UserLoginDto } from './dto/user-login.dto'
import { UserSignUpDto } from './dto/user-sign-up.dto'
import { Public } from './public.decorator'

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(AuthController.name)
  }

  /**
   * 用户认证并签发 Token
   */
  @Public()
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<UserLoginResultDto> {
    const { username, password } = userLoginDto
    const user = await this.authService.validateUser(username, password)
    if (!user) throw new BadRequestException('用户名或密码错误！')

    this.logger.debug('login succeeded, username: ' + username)
    return await this.authService.login(user)
  }

  /**
   * 刷新认证并签发 Token
   */
  @ApiBody({
    schema: {
      type: 'object',
      properties: { refreshToken: { type: 'string' } },
    },
  })
  @Public()
  @Post('refresh')
  async refresh(
    @Body('refreshToken') token: string
  ): Promise<UserLoginResultDto> {
    try {
      const payload = this.authService.verifyRefreshToken(token)
      const result = await this.authService.login(
        {
          username: payload.username,
          id: payload.sub,
        },
        // 不主动更新 refresh token 有效期
        token
      )

      this.logger.debug(
        'token refresh succeeded, username: ' + payload.username
      )
      return result
    } catch (err) {
      throw new BadRequestException('Refresh Token 无效！', { cause: err })
    }
  }

  /**
   * 获取用户信息
   */
  @Get('profile')
  async profile(@Req() req: any): Promise<User> {
    this.logger.debug('get profile succeeded for user: ' + req.user?.username)
    return req.user as User
  }

  /**
   * 注册用户
   * @param userSignUpDto
   */
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() userSignUpDto: UserSignUpDto) {
    const { username } = userSignUpDto

    const count = await this.usersService.countByUsername(username)
    if (count > 0) throw new ConflictException('用户名已被占用！')

    const result = await this.usersService.create(userSignUpDto)
    this.logger.debug(
      'user created: ' + JSON.stringify({ id: result, username })
    )
  }
}
