import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserTokenHistory } from './entities/user-token-history.entity'

@Injectable()
export class UserTokenHistoryService {
  constructor(
    @InjectRepository(UserTokenHistory)
    private readonly historyRepo: Repository<UserTokenHistory>
  ) {}

  async insert(userId: string, accessToken: string, refreshToken: string) {
    const history = this.historyRepo.create()
    history.userId = userId
    history.accessToken = accessToken
    history.refreshToken = refreshToken
    return await this.historyRepo.insert(history)
  }
}
