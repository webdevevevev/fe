import {User} from './User'
import {Offer} from './Offer'
import {ArrayMaxSize, IsInt, Max, MaxLength, Min} from 'class-validator'

export const enum State {
  // 待接受
  pending,
  // 同意
  accepted,
  // 拒绝
  rejected,
  // 取消
  canceled
}

// “欢迎来”类
export class Answer {
  // 响应标识
  readonly id: number

  // 请求标识
  offer: Offer

  // 响应用户标识
  user = new User()

  // 响应描述
  @MaxLength(255)
  desc: string

  // 响应介绍图片等文件
  @ArrayMaxSize(20)
  @MaxLength(500, {each: true})
  files: string[] = []

  // 创建时间
  readonly ctime: Date

  // 修改时间
  mtime: Date

  // 状态
  @IsInt()
  @Min(0)
  @Max(3)
  state = State.pending
}
