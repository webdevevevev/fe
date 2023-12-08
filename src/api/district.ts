import axios from 'axios'

const baseURL = 'https://restapi.amap.com/v3/config'
const key = '2b82e357b5a95a6358265db9b2049d47'

const instance = axios.create({
  baseURL,
  params: {
    key,
  },
})

instance.interceptors.response.use(({data}) => data.districts[0].districts.map(({adcode, name}) => ({
  id: parseInt(adcode),
  name,
})).sort((a, b) => a.id - b.id))

export function getProvinces() {
  return instance.get<any, { id: number, name: string }[]>('/district', {
    params: {
      keywords: '100000',
    },
  })
}

export function getCities(provinceId: number) {
  return instance.get<any, { id: number, name: string }[]>(`/district`, {
    params: {
      keywords: provinceId,
    },
  })
}

export async function getCityName(provinceId: number, cityId: number) {
  const {data: {districts: [city]}} = await axios.get<any, { city: string, province: string }>(`/district`, {
    baseURL,
    params: {
      key,
      keywords: cityId,
      subdistrict: 0,
    },
  })
  return city?.name
}
