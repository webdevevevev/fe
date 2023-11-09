import {
  IsBoolean,
  IsIdentityCard,
  IsInt,
  IsMobilePhone,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator'

export const enum IDCardType {
  zhCN,
}

export class User {
  // 用户标识
  readonly id: number

  // 用户名
  @MaxLength(50)
  nickname: string

  // 登录密码
  @Matches(/\d.*\d/)
  @Matches(/[a-z]/)
  @Matches(/[A-Z]/)
  @Length(6, 50)
  pwd: string

  // 用户类型（系统管理员/普通用户）
  @IsBoolean()
  isAdmin: boolean = false

  // 用户姓名
  @MaxLength(20)
  name: string

  // 证件类型
  @IsInt()
  @Min(0)
  @Max(0)
  IDCardType = IDCardType.zhCN

  // 证件号码
  @MaxLength(30)
  @IsIdentityCard('zh-CN')
  IDCardNo: string

  // 手机号码(11 位数字)
  @IsMobilePhone('zh-CN')
    // @IsPhoneNumber('CN')
  phone: string

  // 用户级别（一般、VIP）
  @IsBoolean()
  isVIP: boolean = false

  // 用户简介
  @MaxLength(255)
  intro: string = ''

  // 注册城市
  @MaxLength(255)
  city: string

  // 注册时间
  readonly ctime: Date

  // 修改时间
  mtime: Date
}
