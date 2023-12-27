import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import { createPinia } from 'pinia'
import directives from '@/directive'
const pinia = createPinia()
import NaiveUI from "naive-ui";
import { DatePicker, Popup } from "vant"

import "@/styles/index.scss";
import 'vant/lib/index.css';
const app = createApp(App);
  app.use(pinia)
  .use(router)
  .use(NaiveUI)
  .use(DatePicker)
  .use(Popup)
  .use(directives)
  .mount("#app");



