import {User} from './User'
import {Offer} from './Offer'

// “寻去处”成功明细表
export class Deal {
  readonly id: number

  // 请求标识
  readonly offer: Offer

  // 发布用户标识
  readonly offerUser: User

  // 响应用户标识
  readonly answerUser: User

  // 达成日期
  readonly time: Date

  // 发布者支付中介费（2 元）
  readonly offerPrice: number

  // 响应者支付中介费（2 元）
  readonly answerPrice: number
}
