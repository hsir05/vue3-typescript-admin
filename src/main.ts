import { createApp } from "vue";
import App from "./App.vue";
import 'virtual:windi.css'
import { setupRouter } from "@/router/router";
import { setupPinia } from "@/store/index";

async function setupApp() {
  const app = createApp(App);

  setupRouter(app);

  setupPinia(app);

  app.mount("#app");
}

setupApp();
