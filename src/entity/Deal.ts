import {User} from './User'
import {Offer} from './Offer'

// “寻去处”成功明细表
export class Deal {
  id: number

  // 请求标识
  Offer: Offer

  // 发布用户标识
  offerUser: User

  // 响应用户标识
  answerUser: User

  // 达成日期
  readonly time: Date

  // 发布者支付中介费（2 元）
  offerPrice: number

  // 响应者支付中介费（2 元）
  answerPrice: number
}
