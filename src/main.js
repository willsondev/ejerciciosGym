import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwindcss.css'
import store from './store'; // Importar el store

createApp(App).use(router).use(store).mount('#app');
