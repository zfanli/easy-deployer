import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm'
import { Permission } from './permission.entity'

@Entity()
export class Role {
  @PrimaryColumn()
  code: string

  @Column()
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ default: true })
  isActive: boolean

  @ManyToMany(() => Permission, { createForeignKeyConstraints: false })
  @JoinTable()
  permissions: Permission[]
}
