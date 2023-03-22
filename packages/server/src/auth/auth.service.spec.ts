import { LoggerService } from '@/logger/logger.service'
import { User } from '@/users/entities/user.entity'
import { UsersService } from '@/users/users.service'
import { JwtModule } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { DEFAULT_JWT_CONFIG } from './auth.module'
import { AuthService } from './auth.service'
import { AUTH_CONFIG } from './constants'
import { UserTokenHistoryService } from './user-token-history.service'

const MOCK_USER_DATA: User = {
  id: '3e570e4e-1f9b-4392-99c2-684c0768aeff',
  username: 'admin',
  password: '123456',
  realName: '管理员',
  avatar: null,
  isActive: true,
  createdAt: 1674863387207,
  updatedAt: 1674863387207,
  roles: [
    {
      code: 'ADMIN',
      name: '管理员',
      description: '管理员角色',
      isActive: true,
      permissions: [
        {
          code: 'ADMIN',
          name: '管理员',
          description: '管理员权限',
          isActive: true,
        },
      ],
    },
  ],
}

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register(DEFAULT_JWT_CONFIG)],
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return {
            findOneByUsername: jest.fn().mockResolvedValue(MOCK_USER_DATA),
            findOne: jest.fn().mockResolvedValue(MOCK_USER_DATA),
            countByUsername: jest.fn().mockResolvedValue(0),
            create: jest.fn().mockResolvedValue('generated-uuid-mock'),
          }
        }

        if (token === AUTH_CONFIG) {
          return DEFAULT_JWT_CONFIG
        }

        if (token === LoggerService) {
          return { ...console, setContext: () => null }
        }

        if (token === UserTokenHistoryService) {
          return { insert: jest.fn().mockResolvedValue(null) }
        }
      })
      .compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
