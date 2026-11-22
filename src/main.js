import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import msg from './plugins/msg'
import reveal from './directives/reveal'

createApp(App).use(router).use(msg).directive('reveal', reveal).mount('#app')
