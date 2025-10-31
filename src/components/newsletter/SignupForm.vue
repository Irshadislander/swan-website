<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { subscribe } from "@/api/newsletter";
import { track } from "@/plugins/analytics";

type Props = {
  source?: string;
};

const props = withDefaults(defineProps<Props>(), {
  source: "newsletter",
});

const email = ref("");
const name = ref("");
const loading = ref(false);

const resetForm = () => {
  email.value = "";
  name.value = "";
};

const onSubmit = async () => {
  if (loading.value) return;
  loading.value = true;
  const result = await subscribe({ email: email.value.trim(), name: name.value.trim() || undefined });
  loading.value = false;

  if (result.ok) {
    ElMessage.success("Thanks for subscribing!");
    track("newsletter_subscribe", { source: props.source });
    resetForm();
  } else {
    ElMessage.error(result.error);
  }
};
</script>

<template>
  <div class="card p-5 space-y-3">
    <h3 class="font-heading text-2xl text-brand-900">Get field updates</h3>
    <p class="text-slate-600">Stories and impact delivered monthly.</p>
    <div class="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-start">
      <el-input
        v-model="email"
        placeholder="you@example.com"
        type="email"
        autocomplete="email"
        aria-label="Email"
        class="w-full"
      />
      <el-button :loading="loading" type="primary" class="focus-ring focus:outline-none" @click="onSubmit">
        Subscribe
      </el-button>
    </div>
    <label class="sr-only" for="newsletter-name">Name</label>
    <el-input
      id="newsletter-name"
      v-model="name"
      placeholder="Your name (optional)"
      autocomplete="name"
      class="mt-2"
    />
  </div>
</template>
