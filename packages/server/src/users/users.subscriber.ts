import { OperationTarget } from '@/operlog/enums/operation-target'
import { OperationType } from '@/operlog/enums/operation-type'
import { OperlogService } from '@/operlog/operlog.service'
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm'
import { User } from './entities/user.entity'

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    dataSource: DataSource,
    private readonly operlogService: OperlogService
  ) {
    dataSource.subscribers.push(this)
  }

  listenTo() {
    return User
  }

  /**
   * Called after entity is inserted to the database.
   */
  afterInsert?(event: InsertEvent<User>) {
    const user = event.entity
    this.operlogService.insert({
      operationBy: user,
      operationType: OperationType.CREATED,
      targetId: user.id,
      targetType: OperationTarget.USER,
      operationAt: user.createdAt,
    })
  }
}
