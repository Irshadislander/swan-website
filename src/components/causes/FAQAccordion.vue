<template>
  <div v-if="items.length" class="card p-6">
    <el-collapse accordion>
      <el-collapse-item v-for="(item, index) in items" :key="index" :name="index">
        <template #title>
          <span class="font-semibold text-brand-900">{{ item.q }}</span>
        </template>
        <p class="text-slate-600 leading-relaxed">{{ item.a }}</p>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: Array<{ q: string; a: string }> }>();
</script>
