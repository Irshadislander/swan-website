import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocationNormalized } from "vue-router";
import { applyMeta } from "@/plugins/meta";
import { getStory as fetchStory, getCause as fetchCause } from "@/lib/content";

const DEFAULT_DESCRIPTION =
  "SWAN empowers communities in Nepal through scholarships, health access, and women’s leadership programs.";
const DEFAULT_IMAGE = "/images/placeholder-1200x800.jpg";

const resolveStory = (to: RouteLocationNormalized) => fetchStory(to.params.slug as string);
const resolveCause = (to: RouteLocationNormalized) => fetchCause(to.params.slug as string);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import(/* webpackChunkName: "view-home" */ "@/views/HomeView.vue"),
      meta: {
        title: "SWAN — Empowering lives in Nepal",
        description: DEFAULT_DESCRIPTION,
        image: DEFAULT_IMAGE,
      },
    },
    {
      path: "/donate",
      name: "donate",
      component: () => import(/* webpackChunkName: "view-donate" */ "@/views/DonateView.vue"),
      meta: {
        title: "Donate to SWAN",
        description: "Support community-led education, health, and women’s leadership programs across Nepal.",
        image: DEFAULT_IMAGE,
      },
    },
    {
      path: "/donate/success",
      name: "donate-success",
      component: () => import(/* webpackChunkName: "view-donate-success" */ "@/views/DonateSuccess.vue"),
      meta: {
        title: "Thank you for your donation",
        description: "Confirmation and receipt for your recent SWAN donation.",
        image: DEFAULT_IMAGE,
      },
    },
    {
      path: "/stories",
      name: "stories",
      component: () => import(/* webpackChunkName: "view-stories" */ "@/views/StoriesView.vue"),
      meta: {
        title: "Stories from the field",
        description: "See how SWAN partners are leading change in rural Nepal’s classrooms and clinics.",
        image: DEFAULT_IMAGE,
      },
    },
    {
      path: "/volunteer",
      name: "volunteer",
      component: () => import(/* webpackChunkName: "view-volunteer" */ "@/views/VolunteerView.vue"),
      meta: {
        title: "Volunteer",
        description: "Lend your skills to SWAN’s programs through mentoring, medical camps, storytelling, and local partnerships.",
      },
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import(/* webpackChunkName: "view-contact" */ "@/views/ContactView.vue"),
      meta: {
        title: "Contact",
        description: "Reach SWAN’s team for partnerships, media inquiries, or program support.",
      },
    },
    {
      path: "/thanks",
      name: "thanks",
      component: () => import(/* webpackChunkName: "view-thanks" */ "@/views/ThanksView.vue"),
      meta: {
        title: "Thank you",
        description: "We received your message.",
      },
    },
    {
      path: "/search",
      name: "search",
      component: () => import(/* webpackChunkName: "view-search" */ "@/views/SearchView.vue"),
      meta: {
        title: "Search",
        noindex: true,
      },
    },
    {
      path: "/error",
      name: "error",
      component: () => import(/* webpackChunkName: "view-error" */ "@/views/ErrorView.vue"),
      meta: {
        title: "Error",
        noindex: true,
      },
    },
    {
      path: "/stories/:slug",
      name: "story",
      component: () => import(/* webpackChunkName: "view-story" */ "@/views/StoryDetailView.vue"),
      meta: {
        title: (to: RouteLocationNormalized) => {
          const story = resolveStory(to);
          return story ? `${story.title} — SWAN story` : "SWAN story";
        },
        description: (to: RouteLocationNormalized) => {
          const story = resolveStory(to);
          return story?.excerpt ?? "Stories from SWAN fieldwork in Nepal.";
        },
        image: (to: RouteLocationNormalized) => {
          const story = resolveStory(to);
          return story?.image ?? DEFAULT_IMAGE;
        },
      },
    },
    {
      path: "/causes/:slug",
      name: "cause",
      component: () => import(/* webpackChunkName: "view-cause" */ "@/views/CauseView.vue"),
      meta: {
        title: (to: RouteLocationNormalized) => {
          const cause = resolveCause(to);
          return cause ? `${cause.name} | SWAN programs` : "SWAN programs";
        },
        description: (to: RouteLocationNormalized) => {
          const cause = resolveCause(to);
          return cause?.lede ?? DEFAULT_DESCRIPTION;
        },
        image: (to: RouteLocationNormalized) => {
          const cause = resolveCause(to);
          return cause?.heroImage ?? DEFAULT_IMAGE;
        },
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import(/* webpackChunkName: "view-not-found" */ "@/views/NotFoundView.vue"),
      meta: {
        title: "404 — Page not found",
        noindex: true,
      },
    },
  ],
});

router.afterEach((to) => applyMeta(to));

export default router;
