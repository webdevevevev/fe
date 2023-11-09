import {User} from './User'
import {ArrayMaxSize, IsDate, IsInt, Max, MaxLength, Min} from 'class-validator'

export const enum Type {
  // 钓鱼
  fishing,
  // 老少皆宜休闲
  relaxing,
  // 农家院
  farm,
  // 温泉度假
  spring,
  // 僻静休闲
  secluded,
  // 游乐场
  park,
  other,
}

export const enum State {
  // 已完成
  fulfilled,
  // 待响应
  pending,
  // 已取消
  canceled,
  // 到期未达成
  expired,
}

// “寻去处”请求信息类
export class Offer {
  // 请求标识
  readonly id: number

  // 发布用户标识
  user: User

  // 去处类型
  @IsInt()
  @Min(0)
  @Max(6)
  type: Type = Type.other

  // 请求主题名称
  @MaxLength(255)
  title: string

  // 请求描述
  @MaxLength(255)
  desc: string = ''

  // 去处类比图片介绍等文件
  @ArrayMaxSize(20)
  @MaxLength(500, {each: true})
  files: string[] = []

  // 最高单价
  price: number

  // 请求结束日期
  @IsDate()
  expire: Date

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
