import axios from 'axios'
import {User} from '../entity/User'
import {validateOrReject} from 'class-validator'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
})

instance.interceptors.response.use(({data}) => data)

export function allUsers() {
  return instance.get<any, User[]>('/user')
}

export async function signin(name: string, pwd: string) {
  const maxLength = 50
  if (name.length > maxLength) {
    throw `name ${name} can't be longer than ${maxLength} characters`
  }
  if (pwd.length > maxLength) {
    throw `password ${pwd} can't be longer than ${maxLength} characters`
  }

  const obj: User | string = await instance.post('/signin', {name, pwd})
  if (typeof obj !== 'object') {
    return obj
  }
  Object.setPrototypeOf(obj, User.prototype)
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

export default instance
