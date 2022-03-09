import { createPinia } from "pinia";
import type { App } from "vue";

const store = createPinia();
export function setupPinia(app: App) {
  app.use(store);
}
export { store };