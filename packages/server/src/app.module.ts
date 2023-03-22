import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TracingInterceptor } from './common/tracing.interceptor'
import { ConfigModule } from './common/config.module'
import { DatabaseModule } from './common/database.module'
import { AppService } from './app.service'
import { LoggerModule } from './logger/logger.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { HealthModule } from './health/health.module'
import { OperlogModule } from './operlog/operlog.module'

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    LoggerModule,
    UsersModule,
    AuthModule,
    HealthModule,
    OperlogModule,
  ],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: TracingInterceptor },
  ],
})
export class AppModule {}
