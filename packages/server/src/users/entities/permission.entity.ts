import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class Permission {
  @PrimaryColumn()
  code: string

  @Column()
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ default: true })
  isActive: boolean
}
