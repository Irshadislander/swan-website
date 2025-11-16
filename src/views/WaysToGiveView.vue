<script setup lang="ts">
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import { RouterLink } from "vue-router";
import EventsCarousel from "@/components/sections/EventsCarousel.vue";
import { saveLead } from "@/api/leads";

type WayConfig = {
  id: string;
  title: string;
  summary: string;
  subject: string;
  fields?: Array<{ name: string; label: string; placeholder?: string; type?: string }>;
};

const ways: WayConfig[] = [
  {
    id: "corporate",
    title: "Corporate matches",
    summary: "Activate employer matches or sponsor a SWAN program. We provide reporting, impact decks, and field visits.",
    subject: "Corporate match inquiry",
    fields: [{ name: "company", label: "Company", placeholder: "Company or team name" }],
  },
  {
    id: "challenges",
    title: "Adventure challenges",
    summary: "Host treks, marathons, or local challenges to rally donations for urgent field work.",
    subject: "Challenge fundraiser idea",
  },
  {
    id: "vehicles",
    title: "Vehicle donations",
    summary: "Donate a car, bike, or equipment to fund mobile health caravans and logistics.",
    subject: "Vehicle donation inquiry",
    fields: [{ name: "vehicle", label: "Vehicle / item", placeholder: "Model, year, or description" }],
  },
  {
    id: "wills",
    title: "Legacy & wills",
    summary: "Include SWAN in your estate plan or dedicate a gift in memory of a loved one.",
    subject: "Legacy giving question",
  },
  {
    id: "grants",
    title: "Grants & foundations",
    summary: "Partner through foundation grants, CSR budgets, or philanthropic networks.",
    subject: "Grant proposal inquiry",
    fields: [{ name: "organization", label: "Foundation / organization", placeholder: "Organization name" }],
  },
];

type FormState = {
  name: string;
  email: string;
  message: string;
  [key: string]: string;
};

const defaultState = (): FormState => ({
  name: "",
  email: "",
  message: "",
});

const forms = reactive<Record<string, FormState>>(
  ways.reduce<Record<string, FormState>>((acc, way) => {
    acc[way.id] = { ...defaultState() };
    way.fields?.forEach((field) => {
      acc[way.id][field.name] = "";
    });
    return acc;
  }, {})
);

const loading = reactive<Record<string, boolean>>({});

const submit = async (config: WayConfig) => {
  const state = forms[config.id];
  if (!state.name.trim() || !state.email.trim() || !state.message.trim()) {
    ElMessage.error("Name, email, and message are required.");
    return;
  }

  loading[config.id] = true;
  const leadPayload: Record<string, unknown> = {
    name: state.name.trim(),
    email: state.email.trim(),
    message: state.message.trim(),
    channel: config.id,
    source: "ways_to_give",
  };
  config.fields?.forEach((field) => {
    leadPayload[field.name] = state[field.name] ?? "";
  });

  const leadResult = await saveLead({ type: config.id, data: leadPayload });
  if (!leadResult.ok) {
    ElMessage.error(leadResult.error || "Unable to save your request.");
    loading[config.id] = false;
    return;
  }
  const extraFields =
    config.fields?.map((field) => `<p><strong>${field.label}:</strong> ${state[field.name] || "n/a"}</p>`).join("") ?? "";

  const payload = {
    subject: config.subject,
    html: `
      <h2>${config.title} submission</h2>
      <p><strong>Name:</strong> ${state.name}</p>
      <p><strong>Email:</strong> ${state.email}</p>
      ${extraFields}
      <p><strong>Message:</strong></p>
      <p>${state.message.replace(/\n/g, "<br/>")}</p>
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
      ElMessage.success("Thanks! Our team will reply shortly.");
      Object.assign(forms[config.id], defaultState());
      config.fields?.forEach((field) => (forms[config.id][field.name] = ""));
    } else {
      throw new Error(result.error || "Unable to submit form.");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    ElMessage.error(message);
  } finally {
    loading[config.id] = false;
  }
};
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="container-irr space-y-6">
      <header class="text-center space-y-3 max-w-3xl mx-auto">
        <p class="kicker">More ways to give</p>
        <h1 class="font-heading text-4xl text-brand-900">Choose the giving channel that fits your goals</h1>
        <p class="text-slate-600">
          Corporate matches, adventure challenges, vehicle donations, estate gifts, and grants keep SWAN responsive all year.
        </p>
      </header>

      <div class="grid gap-6 md:grid-cols-2">
        <article v-for="way in ways" :key="way.id" :id="way.id" class="card space-y-4">
          <div>
            <p class="text-xs uppercase tracking-[0.35em] text-brand-600">{{ way.title }}</p>
            <p class="text-slate-600 mt-1">{{ way.summary }}</p>
          </div>
          <el-form label-position="top" :disabled="loading[way.id]" class="space-y-3">
            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <label class="text-sm font-medium text-slate-700" :for="`name-${way.id}`">Full name</label>
                <input
                  :id="`name-${way.id}`"
                  v-model="forms[way.id].name"
                  class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                  placeholder="Asha Tamang"
                />
              </div>
              <div>
                <label class="text-sm font-medium text-slate-700" :for="`email-${way.id}`">Email</label>
                <input
                  :id="`email-${way.id}`"
                  v-model="forms[way.id].email"
                  type="email"
                  class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                  placeholder="asha@swan.org"
                />
              </div>
            </div>
            <div v-for="field in way.fields" :key="field.name">
              <label class="text-sm font-medium text-slate-700" :for="`${field.name}-${way.id}`">{{ field.label }}</label>
              <input
                :id="`${field.name}-${way.id}`"
                v-model="forms[way.id][field.name]"
                :type="field.type ?? 'text'"
                class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                :placeholder="field.placeholder"
              />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700" :for="`message-${way.id}`">How can we help?</label>
              <textarea
                :id="`message-${way.id}`"
                v-model="forms[way.id].message"
                class="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm min-h-[6rem]"
                placeholder="Share details, timelines, or specific questions."
              />
            </div>
            <button
              type="button"
              class="btn btn-gradient w-full sm:w-auto"
              :aria-busy="loading[way.id]"
              @click="submit(way)"
            >
              {{ loading[way.id] ? "Sending…" : "Submit" }}
            </button>
          </el-form>
        </article>
      </div>

      <EventsCarousel />

      <div class="text-center space-y-2">
        <p class="text-slate-600">
          Have a different idea? <RouterLink to="/contact" class="text-brand-600 hover:text-brand-800">Contact us</RouterLink> and we’ll
          connect you with the right teammate.
        </p>
      </div>
    </div>
  </section>
</template>
