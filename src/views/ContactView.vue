<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import MainLayout from "@/shared/MainLayout.vue";
import { track } from "@/plugins/analytics";
import { useRouter } from "vue-router";
import { persist } from "@/lib/store";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
};

const form = reactive<ContactForm>({
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
});

const loading = ref(false);
const errors = reactive<Record<keyof ContactForm, string>>({
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
});

const router = useRouter();

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
  form.website = "";
};

const submit = async () => {
  if (loading.value) return;
  if (!validate()) {
    ElMessage.error("Please fix the highlighted fields.");
    return;
  }

  loading.value = true;

  if (form.website.trim()) {
    track("spam_honeypot_hit", { form: "contact" });
    track("form_submit_success", { type: "contact", via: "honeypot" });
    persist("leads", {
      type: "contact",
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
      source: "honeypot",
    });
    resetForm();
    loading.value = false;
    router.push({ name: "thanks", query: { form: "contact" } });
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
      track("form_submit_success", { type: "contact", mode: "live" });
      persist("leads", {
        type: "contact",
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
      resetForm();
      router.push({ name: "thanks", query: { form: "contact" } });
    } else if (result.mock) {
      track("form_submit_success", { type: "contact", mode: "mock" });
      persist("leads", {
        type: "contact",
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        mode: "mock",
      });
      resetForm();
      router.push({ name: "thanks", query: { form: "contact" } });
    } else {
      throw new Error(result.error || "Unable to send message.");
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    track("form_submit_error", { type: "contact", error: message });
    ElMessage.error(message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <MainLayout>
    <section class="contact-view">
      <div class="container-irr space-y-12">
        <div class="contact-hero" data-animate="fade-up">
          <div>
            <p class="kicker">Contact SWAN</p>
            <h1 class="contact-hero__title">We’re here to help your questions along</h1>
            <p class="contact-hero__body">
              Reach out for partnership inquiries, press questions, or general support. Our team replies within two working days.
            </p>
          </div>
          <ul class="contact-hero__grid">
            <li>
              <p class="label">Email</p>
              <a href="mailto:hello@swan.org">hello@swan.org</a>
            </li>
            <li>
              <p class="label">Hotline</p>
              <a href="tel:+9779802001122">+977 980-200-1122</a>
            </li>
            <li>
              <p class="label">Offices</p>
              <span>Kathmandu • Pokhara • Lamjung</span>
            </li>
          </ul>
        </div>

        <div class="contact-grid">
          <div class="contact-info" data-animate="fade-up">
            <h2>Need something specific?</h2>
            <p>Choose the best inbox so we can respond faster.</p>
            <ul>
              <li>
                <span>Partnerships</span>
                <a href="mailto:partnerships@swan.org">partnerships@swan.org</a>
              </li>
              <li>
                <span>Press & media</span>
                <a href="mailto:press@swan.org">press@swan.org</a>
              </li>
              <li>
                <span>Volunteer desk</span>
                <a href="mailto:volunteers@swan.org">volunteers@swan.org</a>
              </li>
            </ul>
          </div>

          <div class="contact-form card" data-animate="fade-up" :style="`--animate-delay: 0.1s`">
            <el-form :model="form" label-position="top" @submit.prevent="submit" class="space-y-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label for="contact-name" class="block text-sm font-medium text-slate-700">Full name</label>
                  <input
                    id="contact-name"
                    v-model="form.name"
                    class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
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
                    class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
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
                  class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                  placeholder="Partnership, press, support…"
                />
              </div>

              <div>
                <label for="contact-message" class="block text-sm font-medium text-slate-700">How can we help?</label>
                <textarea
                  id="contact-message"
                  v-model="form.message"
                  class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm min-h-[8rem]"
                  placeholder="Add any helpful context, links, or questions."
                  :aria-invalid="!!errors.message"
                  :aria-describedby="errors.message ? 'contact-message-error' : undefined"
                />
                <p v-if="errors.message" id="contact-message-error" class="mt-1 text-xs text-red-500">{{ errors.message }}</p>
              </div>

              <label class="sr-only" for="contact-website">Leave this field blank</label>
              <input
                id="contact-website"
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
                  {{ loading ? "Sending…" : "Send message" }}
                </button>
                <p class="text-xs text-slate-500">We’ll route it to the right teammate and get back shortly.</p>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.contact-view {
  background: radial-gradient(circle at top, rgba(34, 85, 230, 0.06), transparent 70%);
  padding: 4rem 0;
}

.contact-hero {
  border-radius: 2rem;
  padding: 2.5rem;
  background: linear-gradient(135deg, #0f172a, #102a5c 60%, #2255e6);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-hero__title {
  font-family: "Playfair Display", "Times New Roman", serif;
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  line-height: 1.2;
}

.contact-hero__body {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  max-width: 50ch;
}

.contact-hero__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.contact-hero__grid li {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1.25rem;
  padding: 1rem;
}

.contact-hero__grid .label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.7);
}

.contact-hero__grid a,
.contact-hero__grid span {
  display: block;
  margin-top: 0.4rem;
  font-weight: 600;
  color: #fff;
}

.contact-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.contact-info {
  border-radius: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 1.75rem;
  background: #fff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

.contact-info h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
}

.contact-info p {
  color: #475569;
  margin-top: 0.3rem;
}

.contact-info ul {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.contact-info li {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.contact-info span {
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b8;
}

.contact-info a {
  font-weight: 600;
  color: #2255e6;
}

.contact-form {
  border-radius: 1.75rem;
  padding: 2rem;
}
</style>
