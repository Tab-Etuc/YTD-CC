import { createApp } from 'vue'
import Notifications from '@kyvg/vue3-notification'
import App from './App.vue'
import { vfmPlugin } from 'vue-final-modal'
import VDynamicModal from './components/VDynamicModal.vue'

import './assets/tailwind.css'

const app = createApp(App)
app.use(Notifications).use(vfmPlugin).component('VDynamicModal', VDynamicModal)

app.mount('#app')
