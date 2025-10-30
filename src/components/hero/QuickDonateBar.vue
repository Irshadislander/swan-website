<template>
  <div class="card p-4">
    <div class="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-3">
      <el-select v-model="freq" placeholder="One-time" size="large">
        <el-option label="One-time" value="once" />
        <el-option label="Monthly" value="monthly" />
      </el-select>

      <el-select v-model="amount" placeholder="$50" size="large">
        <el-option v-for="n in [25, 50, 100, 250, 500]" :key="n" :label="`$${n}`" :value="n" />
      </el-select>

      <el-select v-model="program" placeholder="Education Access" size="large">
        <el-option label="Education Access" value="education" />
        <el-option label="Community Health" value="health" />
        <el-option label="Women’s Leadership" value="empowerment" />
      </el-select>

      <RouterLink to="/donate" class="btn btn-primary self-stretch flex items-center justify-center">Donate Now</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";

const freq = ref<"once" | "monthly">("once");
const amount = ref<number>(50);
const program = ref("education");
</script>
