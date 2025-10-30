import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElIcons from "@element-plus/icons-vue";
import App from "./App.vue";
import router from "@/router";
import "@/assets/main.css";

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
Object.entries(ElIcons).forEach(([name, comp]) => app.component(name, comp));
app.mount("#app");
