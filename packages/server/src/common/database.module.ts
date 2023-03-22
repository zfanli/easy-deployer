import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

// 数据库实体需要在这里注册
const logger = new Logger('DatabaseModule')

export const DatabaseModule = TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => {
    const config = configService.get('db')
    logger.debug('current database config:', config)
    return { ...config }
  },
  inject: [ConfigService],
})
