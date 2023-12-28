import axios from 'axios'
import {User} from '../entity/User'
import {validateOrReject} from 'class-validator'
import {Offer} from '../entity/Offer'
import {CancelToken} from 'axios'
import {Answer} from '../entity/Answer'
import {Deal} from '../entity/Deal'

export * from './district'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
})

instance.interceptors.request.use(config => {
  const sign = localStorage.getItem('sign')
  if (sign)
    config.headers.setAuthorization('Bearer ' + sign)
  return config
})

instance.interceptors.response.use(({data}) => data)

export function allUsers() {
  return instance.get<any, User[]>('/admin/user')
}

export async function nickname(id: number) {
  const profile = await instance.get<any, User>(`/user/${id}`)
  return profile.nickname
}

export function profile() {
  return instance.get<any, string>('/user')
}

export function updateProfile(payload: Partial<User>) {
  return instance.put('/user', payload)
}

export function getPublicProfile(id: number) {
  return instance.get<any, User>(`/user/${id}`)
}

export async function signin(name: string, pwd: string) {
  const maxLength = 50
  if (name.length > maxLength) {
    throw `name ${name} can't be longer than ${maxLength} characters`
  }
  if (pwd.length > maxLength) {
    throw `password ${pwd} can't be longer than ${maxLength} characters`
  }

  const obj: { sign: string, nickname: string } | string = await instance.post('/signin', {name, pwd})
  if (typeof obj !== 'object') {
    return obj
  }
  return obj
}

export async function signup(user: User, validate = true) {
  if (validate) {
    await validateOrReject(user)
  }

  const obj: User | string = await instance.post('/signup', user)
  if (typeof obj !== 'object') {
    return obj
  }
  Object.setPrototypeOf(obj, User.prototype)
  return obj
}

export async function findOffers(
  start: number,
  end: number,
  conditions?: { type: number, title: string, local: boolean },
  cancelToken?: CancelToken,
) {
  const params: Record<string, number | string> = {
    start,
    end,
  }
  if (conditions) {
    const {type, title} = conditions
    if (title) {
      params.title = title
    }
    if (type >= 0) {
      params.type = type
    }
    if (conditions.local) {
      params.local = 1
    }
  }
  const data: {
    list: Offer[],
    total: number
  } = await instance.get('/offer', {params, cancelToken})
  for (const offer of data.list) {
    Object.setPrototypeOf(offer, Offer.prototype)
  }
  return data
}

export async function publishOffer(offer: Offer) {
  const fd = new FormData()
  fd.append('type', offer.type.toString())
  fd.append('title', offer.title)
  fd.append('desc', offer.desc)
  fd.append('price', offer.price.toString())
  fd.append('expire', offer.expire.toISOString())
  for (const {raw: file} of offer.files) {
    fd.append('files', file, file.name)
  }
  const obj: { insertId: number } = await instance.post('/offer', fd)
  return obj.insertId
}

export async function updateOffer(offer: Offer) {
  const obj: Record<string, any> = {...offer}
  delete obj.files
  return instance.put(`/offer/${offer.id}`, obj)
}

export function deleteOffer(id: number) {
  return instance.delete(`/offer/${id}`)
}

export function getOffer(id: number) {
  return instance.get<any, Offer>(`/offer/${id}`)
}

export async function getAnswer(id: number) {
  const obj: any = await instance.get(`/answer/${id}`)
  obj.user = new User()
  obj.user.id = obj.userId
  delete obj.userId
  Object.setPrototypeOf(obj, Answer.prototype)
  return obj
}

export async function publishAnswer(answer: Answer) {
  const fd = new FormData()
  fd.append('offerId', answer.offer.id.toString())
  fd.append('desc', answer.desc)
  fd.append('state', answer.state.toString())
  for (const {raw: file} of answer.files) {
    fd.append('files', file, file.name)
  }
  const obj: { insertId: number } = await instance.post('/answer', fd)
  return obj.insertId
}

export function updateAnswer(answer: Answer) {
  const obj: Record<string, any> = {...answer}
  delete obj.files
  return instance.put(`/answer/${answer.id}`, obj)
}

export function accept(id: number) {
  return instance.post(`/accept/${id}`)
}

export function reject(id: number) {
  return instance.post(`/reject/${id}`)
}

export function cancelAnswer(id: number) {
  return instance.post(`/cancel/${id}`)
}

export async function findAnswers(start: number, end: number) {
  const {list, total}: {
    list: Record<string, any>[],
    total: number
  } = await instance.get('/answer', {params: {start, end}})

  for (const answer of list) {
    Object.setPrototypeOf(answer, Answer.prototype)
    answer.user = {id: answer.userId}
    delete answer.userId
    Object.setPrototypeOf(answer, Answer.prototype)
  }

  return {list: list as Answer[], total}
}

export async function getDeals(city: number, start?: number, end?: number) {
  if (end <= 0) {
    end = Date.now()
  }
  if (start <= 0) {
    start = end - 3 * 30 * 24 * 60 * 60 * 1000
  }
  const params: Record<string, any> = {
    start,
    end,
  }
  if (city >= 0) {
    params.c = city
  }
  const deals: Deal[] = await instance.get('/admin/deal', {params})
  for (const deal of deals) {
    Object.setPrototypeOf(deal, Deal.prototype)
  }
  return deals
}

export default instance
