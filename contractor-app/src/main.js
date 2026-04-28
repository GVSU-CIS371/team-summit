import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { initAuth } from './auth/mockAuth'

initAuth()

createApp(App).use(router).mount('#app')
