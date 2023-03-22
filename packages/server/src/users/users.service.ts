import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepo.find()
  }

  findOne(id: string): Promise<User> {
    return this.userRepo.findOne({
      where: { id },
      relations: { roles: { permissions: true } },
    })
  }

  async create(params: DeepPartial<User>) {
    const user = this.userRepo.create(params)
    const result = await this.userRepo.insert(user)
    return result.identifiers?.[0]?.id
  }

  findOneByUsername(username: string): Promise<User> {
    return this.userRepo.findOneBy({ username })
  }

  countByUsername(username: string): Promise<number> {
    return this.userRepo.countBy({ username })
  }

  async remove(id: string): Promise<void> {
    await this.userRepo.delete(id)
  }
}
