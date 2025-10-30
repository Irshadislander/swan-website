import { createRouter, createWebHistory } from "vue-router";

const Home = () => import("@/views/HomeView.vue");
const Donate = () => import("@/views/DonateView.vue");

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/donate", name: "donate", component: Donate }
  ],
  scrollBehavior: () => ({ top: 0 }),
});
