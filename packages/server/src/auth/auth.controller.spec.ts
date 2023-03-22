import { ModuleMocker, MockFunctionMetadata } from 'jest-mock'
import { LoggerService } from '@/logger/logger.service'
import { UsersService } from '@/users/users.service'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { User } from '../users/entities/user.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { BadRequestException, ConflictException } from '@nestjs/common'
import { DEFAULT_JWT_CONFIG } from './auth.module'
import { AUTH_CONFIG } from './constants'
import { UserTokenHistoryService } from './user-token-history.service'

const moduleMocker = new ModuleMocker(global)

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

describe('AuthController', () => {
  let controller: AuthController
  // let authService: AuthService
  let usersService: UsersService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register(DEFAULT_JWT_CONFIG)],
      controllers: [AuthController],
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return {
            findOneByUsername: jest
              .fn()
              .mockResolvedValue({ ...MOCK_USER_DATA }),
            findOne: jest.fn().mockResolvedValue({ ...MOCK_USER_DATA }),
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

        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token
          ) as MockFunctionMetadata<any, any>
          const Mock = moduleMocker.generateFromMetadata(mockMetadata)
          return new Mock()
        }
      })
      .compile()

    // authService = moduleRef.get<AuthService>(AuthService)
    usersService = moduleRef.get<UsersService>(UsersService)
    controller = moduleRef.get<AuthController>(AuthController)
  })

  it('正常登录', async () => {
    const result = await controller.login({
      username: 'admin',
      password: '123456',
    })

    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
  })

  it('异常登录', async () => {
    try {
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(null)

      await controller.login({
        username: 'admin',
        password: '123456',
      })
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException)
    }
  })

  it('正常获取用户信息', async () => {
    const result = await controller.profile({ user: { ...MOCK_USER_DATA } })
    expect(result).toStrictEqual({ ...MOCK_USER_DATA })
  })

  it('正常刷新 token', async () => {
    const { refreshToken } = await controller.login({
      username: 'admin',
      password: '123456',
    })

    const result = await controller.refresh(refreshToken)

    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
  })

  it('异常刷新 token', async () => {
    try {
      await controller.refresh('refreshToken')
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException)
    }
  })

  it('正常注册', async () => {
    const result = await controller.signup({
      username: 'admin',
      password: '123456',
      realName: 'admin',
    })

    expect(result).toBeUndefined()
  })

  it('异常注册：用户名被占用', async () => {
    try {
      jest.spyOn(usersService, 'countByUsername').mockResolvedValue(1)

      await controller.signup({
        username: 'admin',
        password: '123456',
        realName: 'admin',
      })
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictException)
    }
  })
})
