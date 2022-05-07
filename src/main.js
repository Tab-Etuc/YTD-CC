import { createApp } from 'vue'
import Notifications from '@kyvg/vue3-notification'
import App from './App.vue'
import './assets/tailwind.css'

const app = createApp(App)
app.use(Notifications)

app.mount('#app')
