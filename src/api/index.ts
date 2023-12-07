import axios from 'axios'
import {User} from '../entity/User'
import {validateOrReject} from 'class-validator'
import {Offer} from '../entity/Offer'

export * from './district'

const instance = axios.create({
  // baseURL: 'http://localhost:3000',
})

instance.interceptors.request.use(config => {
  const sign = localStorage.getItem('sign')
  if (sign)
    config.headers.setAuthorization('Bearer ' + sign)
  return config
})

instance.interceptors.response.use(({data}) => data)

export function allUsers() {
  return instance.get<any, User[]>('/user')
}

export async function nickname() {
  if (import.meta.env.DEV) {
    return instance.get<any, User>(`/user/1`).then(u => u.nickname)
  }
  const sign = localStorage.getItem('sign')!
  const start = sign.indexOf('.') + 1
  const base64 = sign.substring(start, sign.indexOf('.', start))
  const payload = JSON.parse(atob(base64))
  const profile = await instance.get<any, User>(`/user/${payload.id}`)
  return profile.nickname
}

export function profile() {
  return instance.get<any, string>('/user')
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

export async function findOffers(start: number, end: number, conditions?: { type: number, title: string }) {
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
  }
  const data: { list: Offer[], total: number } = await instance.get('/offer', {params})
  for (const offer of data.list) {
    Object.setPrototypeOf(offer, Offer.prototype)
  }
  return data
}

export async function publishOffer(offer: Offer) {
  const obj: { insertId: number } = await instance.post('/offer', offer)
  return obj.insertId
}

export function deleteOffer(id: number) {
  return instance.delete(`/offer/${id}`)
}

export default instance
