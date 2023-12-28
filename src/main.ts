import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus, {ElMessage} from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store'
import router from './router'
import './style.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.errorHandler = err => {
  if (err instanceof TypeError) {
    return
  }
  console.error(err)
  const message = ['ERR_NETWORK', 'ECONNABORTED'].includes(err.code)
    ? '网络错误'
    : err?.message ?? err
  ElMessage.error({
    showClose: true,
    message,
  })
}

app
  .use(router)
  .use(store)
  .use(ElementPlus, {locale: zhCn})
  .mount('#app')
