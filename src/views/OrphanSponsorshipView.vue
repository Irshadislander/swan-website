<script setup lang="ts">
import { computed, reactive } from "vue";
import { ElMessage } from "element-plus";
import { getSite } from "@/lib/content";
import { RouterLink } from "vue-router";
import { saveLead } from "@/api/leads";

const orphanContent = getSite().orphans;
const options = orphanContent?.monthlyOptions ?? [];

const form = reactive({
  name: "",
  email: "",
  monthly: options[0]?.amount ?? 50,
  message: "",
});

const loading = reactive({ state: false });

const selectedLabel = computed(
  () => options.find((opt) => opt.amount === form.monthly)?.label ?? "Monthly support"
);

const submit = async () => {
  if (!form.name.trim() || !form.email.trim()) {
    ElMessage.error("Name and email are required.");
    return;
  }
  loading.state = true;
  const leadResult = await saveLead({
    type: "orphan_sponsorship",
    data: {
      name: form.name.trim(),
      email: form.email.trim(),
      monthly: form.monthly,
      label: selectedLabel.value,
      message: form.message.trim(),
    },
  });
  if (!leadResult.ok) {
    ElMessage.error(leadResult.error || "Unable to save your interest.");
    loading.state = false;
    return;
  }
  const payload = {
    subject: "Orphan sponsorship interest",
    html: `
      <h2>Orphan sponsorship inquiry</h2>
      <p><strong>Name:</strong> ${form.name}</p>
      <p><strong>Email:</strong> ${form.email}</p>
      <p><strong>Monthly amount:</strong> ${form.monthly} USD (${selectedLabel.value})</p>
      <p><strong>Message:</strong></p>
      <p>${form.message.replace(/\n/g, "<br/>") || "n/a"}</p>
    `,
  };

  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (result.ok || result.mock) {
      ElMessage.success("Thanks! Our sponsorship team will follow up.");
      form.name = "";
      form.email = "";
      form.message = "";
    } else {
      throw new Error(result.error || "Unable to send.");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    ElMessage.error(message);
  } finally {
    loading.state = false;
  }
};
</script>

<template>
  <section class="py-12 sm:py-16 bg-white" v-if="orphanContent">
    <div class="container-irr space-y-8">
      <header class="space-y-3 text-center max-w-3xl mx-auto">
        <p class="kicker">Orphan sponsorship</p>
        <h1 class="font-heading text-4xl text-brand-900">{{ orphanContent.title }}</h1>
        <p class="text-slate-600">{{ orphanContent.body }}</p>
      </header>

      <div class="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <article class="card space-y-4">
          <p class="text-sm text-slate-600">
            Choose a monthly amount; we’ll connect you with a student profile and send quarterly updates.
          </p>
          <div class="grid gap-3 sm:grid-cols-3">
            <button
              v-for="opt in options"
              :key="opt.amount"
              type="button"
              class="pill flex flex-col text-center"
              :class="form.monthly === opt.amount ? 'bg-brand-600 text-white border-brand-600' : ''"
              @click="form.monthly = opt.amount"
            >
              <span class="font-semibold">${{ opt.amount }}</span>
              <small>{{ opt.label }}</small>
            </button>
          </div>
          <el-form label-position="top" class="space-y-3" :disabled="loading.state">
            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <label class="text-sm font-medium text-slate-700" for="orphan-name">Full name</label>
                <input
                  id="orphan-name"
                  v-model="form.name"
                  class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                  placeholder="Asha Tamang"
                />
              </div>
              <div>
                <label class="text-sm font-medium text-slate-700" for="orphan-email">Email</label>
                <input
                  id="orphan-email"
                  v-model="form.email"
                  type="email"
                  class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                  placeholder="asha@swan.org"
                />
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700" for="orphan-message">Questions or dedication (optional)</label>
              <textarea
                id="orphan-message"
                v-model="form.message"
                class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm min-h-[6rem]"
                placeholder="Share any preferences or dedications."
              />
            </div>
            <button type="button" class="btn btn-gradient" :aria-busy="loading.state" @click="submit">
              {{ loading.state ? "Sending…" : "Submit interest" }}
            </button>
          </el-form>
        </article>

        <aside class="card space-y-3">
          <p class="text-xs uppercase tracking-[0.35em] text-brand-600">Why sponsor?</p>
          <ul class="space-y-2 text-slate-600">
            <li v-for="item in orphanContent.bullets" :key="item">• {{ item }}</li>
          </ul>
          <RouterLink to="/donate?campaign=orphans" class="btn btn-primary w-fit">Give now</RouterLink>
        </aside>
      </div>
    </div>
  </section>
</template>
