<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import MainLayout from "@/shared/MainLayout.vue";
import { track } from "@/plugins/analytics";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
  token: string;
};

const form = reactive<ContactForm>({
  name: "",
  email: "",
  subject: "",
  message: "",
  token: "",
});

const loading = ref(false);
const errors = reactive<Record<keyof ContactForm, string>>({
  name: "",
  email: "",
  subject: "",
  message: "",
  token: "",
});

const validate = () => {
  errors.name = form.name.trim() ? "" : "Name is required.";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errors.email = emailPattern.test(form.email.trim()) ? "" : "Enter a valid email.";
  errors.message = form.message.trim().length >= 10 ? "" : "Message should be at least 10 characters.";
  return !errors.name && !errors.email && !errors.message;
};

const resetForm = () => {
  form.name = "";
  form.email = "";
  form.subject = "";
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

  if (form.token.trim()) {
    track("form_submit", { type: "contact", status: "honeypot" });
    resetForm();
    loading.value = false;
    ElMessage.success("Thanks for reaching out! We’ll respond shortly.");
    return;
  }

  const payload = {
    subject: form.subject ? `Contact: ${form.subject}` : `Contact inquiry from ${form.name}`,
    html: `
      <h2>Contact submission</h2>
      <p><strong>Name:</strong> ${form.name}</p>
      <p><strong>Email:</strong> ${form.email}</p>
      <p><strong>Subject:</strong> ${form.subject || "General inquiry"}</p>
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
      track("form_submit", { type: "contact", status: "success" });
      ElMessage.success("Thanks for reaching out! We’ll respond shortly.");
      resetForm();
    } else if (result.mock) {
      track("form_submit", { type: "contact", status: "mock" });
      ElMessage.success("Thanks for contacting SWAN!");
      resetForm();
    } else {
      throw new Error(result.error || "Unable to send message.");
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    track("form_submit", { type: "contact", status: "error", error: message });
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
          <p class="kicker">Contact SWAN</p>
          <h1 class="font-heading text-3xl sm:text-4xl text-brand-900">We’re here to help your questions along</h1>
          <p class="text-slate-600">
            Reach out for partnership inquiries, press questions, or general support. Our team replies within two working days.
          </p>
        </header>

        <div class="card p-6 sm:p-8 space-y-6">
          <el-form :model="form" label-position="top" @submit.prevent="submit" class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="contact-name" class="block text-sm font-medium text-slate-700">Full name</label>
                <input
                  id="contact-name"
                  v-model="form.name"
                  class="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm"
                  placeholder="Asha Tamang"
                  :aria-invalid="!!errors.name"
                  :aria-describedby="errors.name ? 'contact-name-error' : undefined"
                />
                <p v-if="errors.name" id="contact-name-error" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
              </div>
              <div>
                <label for="contact-email" class="block text-sm font-medium text-slate-700">Email</label>
                <input
                  id="contact-email"
                  v-model="form.email"
                  type="email"
                  class="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm"
                  placeholder="asha@swan.org"
                  :aria-invalid="!!errors.email"
                  :aria-describedby="errors.email ? 'contact-email-error' : undefined"
                />
                <p v-if="errors.email" id="contact-email-error" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
              </div>
            </div>

            <div>
              <label for="contact-subject" class="block text-sm font-medium text-slate-700">Subject (optional)</label>
              <input
                id="contact-subject"
                v-model="form.subject"
                class="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm"
                placeholder="Partnership, press, support…"
              />
            </div>

            <div>
              <label for="contact-message" class="block text-sm font-medium text-slate-700">How can we help?</label>
              <textarea
                id="contact-message"
                v-model="form.message"
                class="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm min-h-[8rem]"
                placeholder="Add any helpful context, links, or questions."
                :aria-invalid="!!errors.message"
                :aria-describedby="errors.message ? 'contact-message-error' : undefined"
              />
              <p v-if="errors.message" id="contact-message-error" class="mt-1 text-xs text-red-500">{{ errors.message }}</p>
            </div>

            <label class="sr-only" for="contact-token">Leave this field blank</label>
            <input id="contact-token" v-model="form.token" type="text" class="hidden" tabindex="-1" autocomplete="off" />

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                class="btn btn-gradient w-full sm:w-auto"
                :disabled="loading"
                :aria-busy="loading"
              >
                {{ loading ? "Sending…" : "Send message" }}
              </button>
              <p class="text-xs text-slate-500">We’ll route it to the right teammate and get back shortly.</p>
            </div>
          </el-form>
        </div>
      </div>
    </section>
  </MainLayout>
</template>
