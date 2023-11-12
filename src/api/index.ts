import axios from 'axios'
import {User} from '../entity/User'
import {validateOrReject} from 'class-validator'
import {Offer} from '../entity/Offer'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
})

instance.interceptors.request.use(config => {
  config.headers.setAuthorization('Bearer ' + localStorage.getItem('sign'))
  return config
})

instance.interceptors.response.use(({data}) => data)

export function allUsers() {
  return instance.get<any, User[]>('/user')
}

export function nickname() {
  return instance.get<any, string>('/nickname')
}

export function profile() {
  return instance.get<any, string>('/profile')
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

export function getProvinces() {
  return instance.get<any, { id: number, name: string }[]>('/province')
}

export function getCities(provinceId: number) {
  return instance.get<any, { id: number, name: string }[]>(`/province/${provinceId}`)
}

export function getCityName(provinceId: number, cityId: number) {
  return instance.get<any, { city: string, province: string }>(`/province/${provinceId}/city/${cityId}`)
}

export async function findOffers(start: number, end: number) {
  const data: { list: Offer[], total: number } = await instance.get('/offer', {
    params: {
      type: '',
      title: '',
      start,
      end,
    },
  })
  for (const offer of data.list) {
    Object.setPrototypeOf(offer, Offer.prototype)
  }
  return data
}

export async function publishOffer(offer: Offer) {
  const obj: { insertId: number } = await instance.post('/offer', offer)
  return obj.insertId
}

export default instance
