import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { LoggerService } from './logger/logger.service'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  // 创建 app 实例
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  })

  // 挂载 logger 根据配置指定的日志级别输出日志
  app.useLogger(await app.resolve(LoggerService))
  // 启用校验 pipes
  app.useGlobalPipes(new ValidationPipe())

  // 获取配置服务
  const config = app.get(ConfigService)

  // 设置 Swagger 文档
  const docsConfig = new DocumentBuilder()
    .setTitle(config.get<string>('docs.title') ?? 'API Docs')
    .setDescription(config.get<string>('docs.description') ?? 'API Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const docs = SwaggerModule.createDocument(app, docsConfig)
  SwaggerModule.setup('docs', app, docs)

  // 从配置中读取端口号监听
  await app.listen(config.get<number>('port') ?? 3000)
}

bootstrap()
