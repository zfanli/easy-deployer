import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { OperationLog } from './entities/operation-log.entity'

@Injectable()
export class OperlogService {
  constructor(
    @InjectRepository(OperationLog)
    private readonly operlogRepo: Repository<OperationLog>
  ) {}

  async insert(operlog: DeepPartial<OperationLog>) {
    const log = this.operlogRepo.create(operlog)
    return await this.operlogRepo.insert(log)
  }
}
