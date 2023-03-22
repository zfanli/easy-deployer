import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { LoggerService } from '../logger/logger.service'
// import { UsersService } from './users.service'

@ApiTags('Users')
@ApiBearerAuth()
@Controller()
export class UsersController {
  constructor(private readonly logger: LoggerService) {
    logger.setContext(UsersController.name)
  }

  @Get('/users')
  users(): string {
    this.logger.warn('test')
    return 'test'
  }
}
