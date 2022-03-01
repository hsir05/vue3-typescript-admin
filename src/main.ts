import { createApp } from "vue";
import App from "./App.vue";
import 'virtual:windi.css'
import 'virtual:svg-icons-register'
import { setupRouter } from "@/router";
import { setupPinia } from "@/store/index";

async function setupApp() {
  const app = createApp(App);

  setupRouter(app);

  setupPinia(app);

  app.mount("#app");
}

setupApp();
