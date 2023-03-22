import { LoggerService } from '@/logger/logger.service'
import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'
import { Public } from '../auth/public.decorator'

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly logger: LoggerService,
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  async check() {
    const result = await this.health.check([
      () => this.db.pingCheck('database'),
    ])

    this.logger.debug('health check result: ' + JSON.stringify(result))
    return result
  }
}
