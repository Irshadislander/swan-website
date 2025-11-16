<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import MainLayout from "@/shared/MainLayout.vue";
import { track } from "@/plugins/analytics";
import { persist } from "@/lib/store";
import { useRouter } from "vue-router";

type VolunteerForm = {
  name: string;
  email: string;
  phone: string;
  interests: string;
  message: string;
  website: string;
};

const form = reactive<VolunteerForm>({
  name: "",
  email: "",
  phone: "",
  interests: "",
  message: "",
  website: "",
});

const loading = ref(false);
const errors = reactive<Record<keyof VolunteerForm, string>>({
  name: "",
  email: "",
  phone: "",
  interests: "",
  message: "",
  website: "",
});

const router = useRouter();

const impactStats = [
  { label: "Active volunteers", value: "180+" },
  { label: "District partners", value: "12" },
  { label: "Programs supported", value: "26" },
];

const opportunities = [
  {
    title: "Remote mentoring",
    description: "Coach students on scholarship essays, interview skills, or English conversation from anywhere.",
  },
  {
    title: "Field deployments",
    description: "Join mobile health caravans or distributions for 5–10 day trips with local partners.",
  },
  {
    title: "Story & media crew",
    description: "Help capture impact stories, photography, or short social edits alongside our team.",
  },
];

const steps = [
  { title: "Tell us your skills", body: "Share how you’d like to help and when you’re available." },
  { title: "Match with a lead", body: "Our team pairs you with the right district partner and timeline." },
  { title: "Onboard & activate", body: "Receive toolkits, briefings, and WhatsApp access before you begin." },
];

const validate = () => {
  errors.name = form.name.trim() ? "" : "Name is required.";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errors.email = emailPattern.test(form.email.trim()) ? "" : "Enter a valid email.";
  errors.message = form.message.trim().length >= 15 ? "" : "Tell us a bit more (15+ characters).";
  return !errors.name && !errors.email && !errors.message;
};

const resetForm = () => {
  form.name = "";
  form.email = "";
  form.phone = "";
  form.interests = "";
  form.message = "";
  form.website = "";
};

const submit = async () => {
  if (loading.value) return;
  if (!validate()) {
    ElMessage.error("Please fix the highlighted fields.");
    return;
  }

  loading.value = true;

  // honeypot guard
  if (form.website.trim()) {
    track("spam_honeypot_hit", { form: "volunteer" });
    track("form_submit_success", { type: "volunteer", via: "honeypot" });
    persist("leads", {
      type: "volunteer",
      name: form.name,
      email: form.email,
      phone: form.phone,
      interests: form.interests,
      message: form.message,
      source: "honeypot",
    });
    resetForm();
    loading.value = false;
    router.push({ name: "thanks", query: { form: "volunteer" } });
    return;
  }

  const payload = {
    subject: `New volunteer interest from ${form.name}`,
    html: `
      <h2>Volunteer submission</h2>
      <p><strong>Name:</strong> ${form.name}</p>
      <p><strong>Email:</strong> ${form.email}</p>
      <p><strong>Phone:</strong> ${form.phone || "n/a"}</p>
      <p><strong>Interests:</strong> ${form.interests || "n/a"}</p>
      <p><strong>Message:</strong></p>
      <p>${form.message.replace(/\n/g, "<br/>")}</p>
    `,
  };

  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (result.ok) {
      track("form_submit_success", { type: "volunteer", mode: "live" });
      persist("leads", {
        type: "volunteer",
        name: form.name,
        email: form.email,
        phone: form.phone,
        interests: form.interests,
        message: form.message,
      });
      resetForm();
      router.push({ name: "thanks", query: { form: "volunteer" } });
    } else if (result.mock) {
      track("form_submit_success", { type: "volunteer", mode: "mock" });
      persist("leads", {
        type: "volunteer",
        name: form.name,
        email: form.email,
        phone: form.phone,
        interests: form.interests,
        message: form.message,
        mode: "mock",
      });
      resetForm();
      router.push({ name: "thanks", query: { form: "volunteer" } });
    } else {
      throw new Error(result.error || "Unable to send email.");
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    track("form_submit_error", { type: "volunteer", error: message });
    ElMessage.error(message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <MainLayout>
    <section class="py-12 sm:py-16" data-animate="fade-up">
      <div class="container-irr space-y-10">
        <header class="space-y-4 text-center">
          <p class="kicker">Volunteer with SWAN</p>
          <h1 class="font-heading text-4xl text-brand-900">Share your skills with grassroots teams across Nepal</h1>
          <p class="text-slate-600 max-w-2xl mx-auto">
            We’re looking for mentors, medical professionals, storytellers, and community builders. Tell us how you’d like to help and our
            team will follow up within two business days.
          </p>
          <ul class="flex flex-wrap justify-center gap-4">
            <li v-for="stat in impactStats" :key="stat.label" class="rounded-2xl bg-white shadow-card border border-white/70 px-5 py-3">
              <p class="text-2xl font-semibold text-brand-900">{{ stat.value }}</p>
              <p class="text-xs uppercase tracking-[0.3em] text-brand-600">{{ stat.label }}</p>
            </li>
          </ul>
        </header>

        <div class="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div class="space-y-6">
            <div class="card p-6 sm:p-8 space-y-6">
              <h2 class="text-xl font-semibold text-brand-900">Where you can plug in</h2>
              <div class="grid gap-4 sm:grid-cols-2">
                <article v-for="item in opportunities" :key="item.title" class="rounded-2xl border border-brand-50 bg-brand-50/40 p-4">
                  <h3 class="font-semibold text-brand-900">{{ item.title }}</h3>
                  <p class="text-sm text-slate-600 mt-2">{{ item.description }}</p>
                </article>
              </div>
              <div class="rounded-2xl border border-slate-200 p-5 space-y-3 bg-white">
                <p class="text-xs uppercase tracking-[0.3em] text-brand-600">How it works</p>
                <ol class="space-y-2 text-sm text-slate-700">
                  <li v-for="(step, index) in steps" :key="step.title" class="flex gap-3">
                    <span class="pill bg-brand-50 border-brand-100 text-brand-700">{{ index + 1 }}</span>
                    <div>
                      <p class="font-semibold text-brand-900">{{ step.title }}</p>
                      <p>{{ step.body }}</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div class="card p-6 sm:p-8 space-y-6">
          <el-form :model="form" label-position="top" @submit.prevent="submit" class="space-y-4">
            <div>
              <label for="vol-name" class="block text-sm font-medium text-slate-700">Full name</label>
              <input
                id="vol-name"
                v-model="form.name"
                class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                placeholder="Asha Tamang"
                :aria-invalid="!!errors.name"
                :aria-describedby="errors.name ? 'vol-name-error' : undefined"
              />
              <p v-if="errors.name" id="vol-name-error" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="vol-email" class="block text-sm font-medium text-slate-700">Email</label>
                <input
                  id="vol-email"
                  v-model="form.email"
                  type="email"
                  class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                  placeholder="asha@swan.org"
                  :aria-invalid="!!errors.email"
                  :aria-describedby="errors.email ? 'vol-email-error' : undefined"
                />
                <p v-if="errors.email" id="vol-email-error" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
              </div>
              <div>
                <label for="vol-phone" class="block text-sm font-medium text-slate-700">Phone (optional)</label>
                <input
                  id="vol-phone"
                  v-model="form.phone"
                  type="tel"
                  class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                  placeholder="+977-1-555-0101"
                />
              </div>
            </div>

            <div>
              <label for="vol-interests" class="block text-sm font-medium text-slate-700">Skills or interests</label>
              <input
                id="vol-interests"
                v-model="form.interests"
                class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                placeholder="Health camps, youth mentorship…"
              />
            </div>

            <div>
              <label for="vol-message" class="block text-sm font-medium text-slate-700">How would you like to help?</label>
              <textarea
                id="vol-message"
                v-model="form.message"
                class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm min-h-[8rem]"
                placeholder="Tell us about your background, availability, and what excites you about SWAN."
                :aria-invalid="!!errors.message"
                :aria-describedby="errors.message ? 'vol-message-error' : undefined"
              />
              <p v-if="errors.message" id="vol-message-error" class="mt-1 text-xs text-red-500">{{ errors.message }}</p>
            </div>

            <label class="sr-only" for="vol-website">Leave this field blank</label>
            <input
              id="vol-website"
              v-model="form.website"
              name="website"
              type="text"
              class="hidden"
              tabindex="-1"
              autocomplete="off"
            />

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                class="btn btn-gradient w-full sm:w-auto"
                :disabled="loading"
                :aria-busy="loading"
              >
                {{ loading ? "Sending…" : "Submit volunteer form" }}
              </button>
              <p class="text-xs text-slate-500">We respect your privacy and never share your contact details.</p>
            </div>
          </el-form>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>
