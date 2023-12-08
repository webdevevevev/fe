import {createStore} from 'vuex'
import * as api from '../api'
import {useLocalStorage} from '@vueuse/core/index'

export default createStore<{
  nickname?: string
  provinces: { id: number, name: string, cities: { id: number, name: string }[] }[]
  sign: string | null
}>({
  state() {
    return {
      nickname: undefined,
      provinces: [],
      sign: useLocalStorage('sign', '') as any,
    }
  },
  mutations: {
    signin(state, {nickname, sign}: { nickname: string, sign: string }) {
      state.nickname = nickname
      state.sign = sign
    },
    getProvinces(state, provinces: { id: number, name: string, cities: { id: number, name: string }[] }[]) {
      state.provinces = provinces
    },
    getCities(state, {provinceId, cities}) {
      const province = state.provinces.find(({id}) => id === provinceId)
      province!.cities = cities
    },
    getNickname(state, nickname: string) {
      state.nickname = nickname
    },
    removeSign(state) {
      state.sign = null
    },
  },
  actions: {
    async getProvinces({commit}) {
      const provinces = await api.getProvinces()
      commit('getProvinces', provinces.map(({id, name}) => ({id, name, cities: []})))
    },
    async getCities({commit}, provinceId) {
      const cities = await api.getCities(provinceId)
      commit('getCities', {
        provinceId,
        cities,
      })
    },
    async getNickname({commit}) {
      commit('getNickname', await api.nickname())
    },
  },
})
