import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OperationLog } from './entities/operation-log.entity'
import { OperlogService } from './operlog.service'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([OperationLog])],
  providers: [OperlogService],
  exports: [OperlogService],
})
export class OperlogModule {}
