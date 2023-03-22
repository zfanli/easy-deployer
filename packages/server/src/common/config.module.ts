import { readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import { join } from 'path'
import { Logger } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'

const logger = new Logger('ConfigModule')
const YAML_CONFIG_FILENAME = '../config.yaml'

function config(): Record<string, any> {
  const config = yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf-8')
  )

  logger.debug('config loaded:', config)
  return config
}

export const ConfigModule = NestConfigModule.forRoot({
  isGlobal: true,
  load: [config],
})
