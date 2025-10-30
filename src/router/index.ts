import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: () => import("@/views/HomeView.vue") },
    { path: "/donate", name: "donate", component: () => import("@/views/DonateView.vue") },
    { path: "/stories", name: "stories", component: () => import("@/views/StoriesView.vue") },
    { path: "/stories/:slug", name: "story", component: () => import("@/views/StoryDetailView.vue") },
    { path: "/causes/:slug", name: "cause", component: () => import("@/views/CauseView.vue") },
  ],
});

export default router;
