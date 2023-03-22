import { DateTransformer } from '@/common/date.transformer'
import { User } from '@/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm'

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column('text')
  description: string

  @VersionColumn()
  version: number

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'created_by' })
  createdBy: User

  @CreateDateColumn({
    transformer: new DateTransformer({ generated: true }),
  })
  createdAt: number

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User

  @UpdateDateColumn({
    transformer: new DateTransformer({ generated: true }),
  })
  updatedAt: number
}
