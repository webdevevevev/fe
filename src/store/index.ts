import {createStore} from 'vuex'
import {User} from '../entity/User'
import * as api from '../api'

export default createStore<{
  nickname?: string
  provinces: { id: number, name: string, cities: { id: number, name: string }[] }[]
}>({
  state() {
    return {
      nickname: undefined,
      provinces: [],
    }
  },
  mutations: {
    signin(state, nickname: string) {
      state.nickname = nickname
    },
    getProvinces(state, provinces: { id: number, name: string, cities: { id: number, name: string }[] }[]) {
      state.provinces = provinces
    },
    getCities(state, {provinceId, cities}) {
      const province = state.provinces.find(({id}) => id === provinceId)
      province!.cities = cities
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
  },
})
