import { Injectable, Scope, ConsoleLogger, LogLevel } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  constructor(private readonly config: ConfigService) {
    super()

    // 通过配置设置日志级别
    const logLevel = this.config.get<LogLevel[]>('logLevel')
    if (logLevel) this.setLogLevels(logLevel)
  }
}
