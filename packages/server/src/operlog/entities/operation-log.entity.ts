import { DateTransformer } from '@/common/date.transformer'
import { User } from '@/users/entities/user.entity'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm'
import { v1 as uuid } from 'uuid'
import { OperationTarget } from '../enums/operation-target'
import { OperationType } from '../enums/operation-type'

@Entity()
@Index(['operationBy', 'operationType', 'targetId'])
export class OperationLog {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'operation_by' })
  operationBy: User

  @Column()
  operationType: OperationType

  @Column({ nullable: true })
  targetParentId?: string

  @Column()
  targetId: string

  @Column()
  targetType: OperationTarget

  @Column({ nullable: true })
  targetDescription?: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  operationAt: number

  @CreateDateColumn({
    transformer: new DateTransformer({ generated: true }),
  })
  createdAt: number

  @BeforeInsert()
  setId() {
    // 基于时序的 uuid
    this.id = uuid({ msecs: new Date().getTime() })
  }
}
