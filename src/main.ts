import { createApp } from "vue";
import '@/assets/styles/index.scss'
import App from "./App.vue";
import 'virtual:windi.css'
import 'virtual:svg-icons-register'
import { setupRouter } from "@/router";
import { setupPinia } from "@/store/index";
import router from "./router/index"

async function setupApp() {
  const app = createApp(App);

  setupRouter(app);

  setupPinia(app);

   await router.isReady();

  app.mount("#app");
}

setupApp();
