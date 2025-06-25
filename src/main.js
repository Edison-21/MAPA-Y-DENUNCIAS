import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { installClickOutside } from './utils/clickOutside'

// Estilos
import './assets/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

// Instalar plugins
app.use(pinia)
app.use(router)
installClickOutside(app)

app.mount('#app')
