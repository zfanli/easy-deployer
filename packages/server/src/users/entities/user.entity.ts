import { DateTransformer } from '../../common/date.transformer'
import {
  Entity,
  Column,
  JoinTable,
  ManyToMany,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Role } from './role.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column()
  realName: string

  @Column({ nullable: true })
  avatar: string

  @Column({ default: true })
  isActive: boolean

  @ManyToMany(() => Role, { createForeignKeyConstraints: false })
  @JoinTable()
  roles: Role[]

  @CreateDateColumn({
    transformer: new DateTransformer({ generated: true }),
  })
  createdAt: number

  @UpdateDateColumn({
    transformer: new DateTransformer({ generated: true }),
  })
  updatedAt: number
}
