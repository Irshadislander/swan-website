<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import MainLayout from "@/shared/MainLayout.vue";
import { track } from "@/plugins/analytics";

type VolunteerForm = {
  name: string;
  email: string;
  phone: string;
  interests: string;
  message: string;
  token: string;
};

const form = reactive<VolunteerForm>({
  name: "",
  email: "",
  phone: "",
  interests: "",
  message: "",
  token: "",
});

const loading = ref(false);
const errors = reactive<Record<keyof VolunteerForm, string>>({
  name: "",
  email: "",
  phone: "",
  interests: "",
  message: "",
  token: "",
});

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
  form.token = "";
};

const submit = async () => {
  if (loading.value) return;
  if (!validate()) {
    ElMessage.error("Please fix the highlighted fields.");
    return;
  }

  loading.value = true;

  // honeypot guard
  if (form.token.trim()) {
    track("form_submit", { type: "volunteer", status: "honeypot" });
    resetForm();
    loading.value = false;
    ElMessage.success("Thanks! We'll be in touch soon.");
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
      track("form_submit", { type: "volunteer", status: "success" });
      ElMessage.success("Thanks! We'll be in touch soon.");
      resetForm();
    } else if (result.mock) {
      track("form_submit", { type: "volunteer", status: "mock" });
      ElMessage.success("Thanks! We'll reach out shortly.");
      resetForm();
    } else {
      throw new Error(result.error || "Unable to send email.");
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    track("form_submit", { type: "volunteer", status: "error", error: message });
    ElMessage.error(message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <MainLayout>
    <section class="py-12 sm:py-16">
      <div class="container-irr max-w-3xl space-y-8">
        <header class="space-y-3 text-center sm:text-left">
          <p class="kicker">Volunteer with SWAN</p>
          <h1 class="font-heading text-3xl sm:text-4xl text-brand-900">Share your skills with our teams and partners</h1>
          <p class="text-slate-600">
            We’re looking for mentors, medical professionals, storytellers, and community builders. Tell us how you’d like to help and our
            team will follow up within two business days.
          </p>
        </header>

        <div class="card p-6 sm:p-8 space-y-6">
          <el-form :model="form" label-position="top" @submit.prevent="submit" class="space-y-4">
            <div>
              <label for="vol-name" class="block text-sm font-medium text-slate-700">Full name</label>
              <input
                id="vol-name"
                v-model="form.name"
                class="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm"
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
                  class="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm"
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
                  class="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm"
                  placeholder="+977-1-555-0101"
                />
              </div>
            </div>

            <div>
              <label for="vol-interests" class="block text-sm font-medium text-slate-700">Skills or interests</label>
              <input
                id="vol-interests"
                v-model="form.interests"
                class="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm"
                placeholder="Health camps, youth mentorship…"
              />
            </div>

            <div>
              <label for="vol-message" class="block text-sm font-medium text-slate-700">How would you like to help?</label>
              <textarea
                id="vol-message"
                v-model="form.message"
                class="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm min-h-[8rem]"
                placeholder="Tell us about your background, availability, and what excites you about SWAN."
                :aria-invalid="!!errors.message"
                :aria-describedby="errors.message ? 'vol-message-error' : undefined"
              />
              <p v-if="errors.message" id="vol-message-error" class="mt-1 text-xs text-red-500">{{ errors.message }}</p>
            </div>

            <label class="sr-only" for="vol-token">Leave this field blank</label>
            <input id="vol-token" v-model="form.token" type="text" class="hidden" tabindex="-1" autocomplete="off" />

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
    </section>
  </MainLayout>
</template>
