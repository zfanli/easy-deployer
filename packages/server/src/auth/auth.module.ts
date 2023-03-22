import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '../users/users.module'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtAuthGuard } from './jwt-auth.guard'
import { APP_GUARD } from '@nestjs/core'
import { JwtStrategy } from './jwt.strategy'
import { AUTH_CONFIG } from './constants'
import { ConfigService } from '@nestjs/config'
import { LoggerService } from '@/logger/logger.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserTokenHistory } from './entities/user-token-history.entity'
import { UserTokenHistoryService } from './user-token-history.service'

export const DEFAULT_JWT_CONFIG = {
  secret: 'secretKey',
  expiresIn: '1d',
  refreshTokenExpiresIn: '7d',
}

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config) => {
        const { secret, expiresIn } = config
        return {
          secret: secret,
          signOptions: { expiresIn: expiresIn },
        }
      },
      inject: [AUTH_CONFIG],
      imports: [AuthModule],
    }),
    TypeOrmModule.forFeature([UserTokenHistory]),
  ],
  providers: [
    AuthService,
    UserTokenHistoryService,
    JwtStrategy,
    {
      provide: AUTH_CONFIG,
      useFactory: (configService: ConfigService, logger: LoggerService) => {
        const config = configService.get('jwt') ?? {}
        if (!config.secret)
          logger.warn('jwt secret was not set, default one used', AUTH_CONFIG)
        return { ...DEFAULT_JWT_CONFIG, ...config }
      },
      inject: [ConfigService, LoggerService],
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AUTH_CONFIG],
})
export class AuthModule {}
