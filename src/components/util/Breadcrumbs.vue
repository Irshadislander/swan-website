<template>
  <nav v-if="trail.length > 1" class="bg-white/70 border-b border-slate-200" aria-label="Breadcrumb">
    <ol class="container-irr flex flex-wrap items-center gap-2 py-3 text-sm text-slate-600">
      <li v-for="(crumb, index) in trail" :key="crumb.label" class="flex items-center gap-2">
        <RouterLink v-if="crumb.to" :to="crumb.to" class="hover:text-brand-700">{{ crumb.label }}</RouterLink>
        <span v-else class="text-brand-900 font-medium" aria-current="page">{{ crumb.label }}</span>
        <span v-if="index < trail.length - 1" class="text-slate-400" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import type { RouteLocationMatched, RouteLocationNormalizedLoaded, RouteLocationRaw, RouteParamsRaw } from "vue-router";

type Breadcrumb = {
  label: string;
  to?: RouteLocationRaw;
};

const route = useRoute();

const resolveMeta = (
  value: unknown,
  current: RouteLocationNormalizedLoaded
): string | undefined => {
  if (typeof value === "function") {
    try {
      return value(current);
    } catch (error) {
      return undefined;
    }
  }
  return typeof value === "string" ? value : undefined;
};

const labelForRecord = (record: RouteLocationMatched, current: RouteLocationNormalizedLoaded): string | undefined => {
  return (
    resolveMeta(record.meta?.breadcrumb, current) ||
    resolveMeta(record.meta?.title, current) ||
    (typeof record.name === "string" ? record.name : undefined) ||
    (record.path ? record.path.split("/").filter(Boolean).pop() : undefined)
  );
};

const trail = computed<Breadcrumb[]>(() => {
  const crumbs: Breadcrumb[] = [{ label: "Home", to: { name: "home" } }];
  const matches = route.matched.filter((record) => record.path && record.path !== "");

  matches.forEach((record, index) => {
    if (record.path === "/") return;
    const label = labelForRecord(record, route);
    if (!label) return;
    const isLast = index === matches.length - 1;
    const params = { ...route.params } as RouteParamsRaw;
    crumbs.push({
      label,
      to: isLast
        ? undefined
        : {
            name: typeof record.name === "string" || typeof record.name === "symbol" ? record.name : undefined,
            path: typeof record.name === "string" || typeof record.name === "symbol" ? undefined : record.path,
            params,
            query: route.query,
          },
    });
  });

  return crumbs;
});
</script>
