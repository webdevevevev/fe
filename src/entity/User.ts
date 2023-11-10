import {
  IsBoolean,
  IsIdentityCard,
  IsInt,
  IsMobilePhone,
  Length,
  Matches,
  Max,
  MaxLength,
  Min, MinLength,
} from 'class-validator'

export const enum IDCardType {
  zhCN,
}

export class User {
  // 用户标识
  readonly id: number

  // 用户名
  @MaxLength(50, {message: '用户名过长'})
  nickname = ''

  // 登录密码
  @Matches(/\d.*\d/, {message: '密码应至少包含两个数字'})
  @Matches(/[a-z]/, {message: '密码应至少包含一个小写字母'})
  @Matches(/[A-Z]/, {message: '密码应包含大写字母'})
  @MinLength(6, {message: '密码应至少六个字符'})
  @MaxLength(50, {message: '密码过长'})
  pwd = ''

  // 用户类型（系统管理员/普通用户）
  @IsBoolean()
  readonly isAdmin = false

  // 用户姓名
  @MaxLength(20, {message: '姓名过长'})
  name = ''

  // 证件类型
  @IsInt()
  @Min(0)
  @Max(0)
  IDCardType = IDCardType.zhCN

  // 证件号码
  @MaxLength(30)
  @IsIdentityCard('zh-CN', {message: '证件号码格式不正确'})
  IDCardNo = ''

  // 手机号码(11 位数字)
  @IsMobilePhone('zh-CN', {}, {message: '手机号码格式不正确'})
    // @IsPhoneNumber('CN')
  phone = ''

  // 用户级别（一般、VIP）
  @IsBoolean()
  readonly isVIP = false

  // 用户简介
  @MaxLength(255, {message: '简介过长'})
  intro = ''

  // 注册省份
  @IsInt()
  provinceId = -1

  // 注册城市
  @IsInt()
  cityId = -1

  // 注册时间
  readonly ctime: Date

  // 修改时间
  mtime: Date
}
