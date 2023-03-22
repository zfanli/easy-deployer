import { IsNotEmpty } from 'class-validator'
import { UserLoginDto } from './user-login.dto'

export class UserSignUpDto extends UserLoginDto {
  @IsNotEmpty()
  realName: string
  avatar?: string
}
