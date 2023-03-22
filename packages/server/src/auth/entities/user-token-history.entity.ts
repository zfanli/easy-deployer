import { DateTransformer } from '@/common/date.transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class UserTokenHistory {
  @PrimaryGeneratedColumn()
  seq: number

  @Index()
  @Column({ type: 'varchar', length: 36 })
  userId: string

  @Column({ type: 'text' })
  accessToken: string

  @Column({ type: 'text' })
  refreshToken: string

  @Column({ default: false })
  isRevoked: boolean

  @CreateDateColumn({
    transformer: new DateTransformer({ generated: true }),
  })
  createdAt: number

  @UpdateDateColumn({
    transformer: new DateTransformer({ generated: true }),
  })
  updatedAt: number
}
