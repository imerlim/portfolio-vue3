import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import msg from './plugins/msg'

createApp(App).use(router).use(msg).mount('#app')
