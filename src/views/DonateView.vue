<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";

const frequencies: Array<{ label: string; value: "once" | "monthly" }> = [
  { label: "One-time", value: "once" },
  { label: "Monthly", value: "monthly" },
];

const amounts = [25, 50, 100, 250, 500];

const programs = [
  { label: "Education", value: "education" },
  { label: "Community Health", value: "health" },
  { label: "Women’s Leadership", value: "empowerment" },
];

const form = reactive({
  frequency: "once" as "once" | "monthly",
  amount: 50,
  program: "education",
  name: "",
  email: "",
});

const selectedAmount = ref(form.amount);
const nameError = ref("");
const emailError = ref("");

const whyPoints = [
  "Transparent reporting with open program budgets.",
  "Local coordinators in every program district.",
  "Programs co-designed with community leaders.",
];

function setAmount(value: number) {
  selectedAmount.value = value;
  form.amount = value;
}

function validate() {
  nameError.value = form.name.trim() ? "" : "Name is required";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailError.value = emailPattern.test(form.email.trim()) ? "" : "Enter a valid email";
  return !nameError.value && !emailError.value;
}

function submit() {
  if (!validate()) {
    ElMessage.error("Please fix the highlighted fields.");
    return;
  }
  ElMessage.success("Thank you! We received your pledge.");
}
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="container-irr grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <el-form label-position="top" class="card p-6 space-y-5" @submit.prevent="submit">
        <div>
          <p class="kicker mb-3">Choose frequency</p>
          <el-radio-group v-model="form.frequency" size="large" class="flex flex-wrap gap-2">
            <el-radio-button v-for="freq in frequencies" :key="freq.value" :label="freq.value">
              {{ freq.label }}
            </el-radio-button>
          </el-radio-group>
        </div>

        <div>
          <p class="kicker mb-3">Select an amount</p>
          <el-button-group>
            <el-button
              v-for="amount in amounts"
              :key="amount"
              size="large"
              :class="[selectedAmount === amount ? 'btn btn-gradient' : 'btn']"
              @click="setAmount(amount)"
              type="button"
            >
              ${{ amount }}
            </el-button>
          </el-button-group>
        </div>

        <div>
          <p class="kicker mb-3">Program designation</p>
          <el-select v-model="form.program" placeholder="Choose a program" size="large" class="w-full">
            <el-option v-for="program in programs" :key="program.value" :label="program.label" :value="program.value" />
          </el-select>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-slate-700">Full name</label>
            <input v-model="form.name" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm" placeholder="Asha Tamang" />
            <p v-if="nameError" class="text-xs text-red-500 mt-1">{{ nameError }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Email</label>
            <input v-model="form.email" type="email" class="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm" placeholder="asha@swan.org" />
            <p v-if="emailError" class="text-xs text-red-500 mt-1">{{ emailError }}</p>
          </div>
        </div>

        <button type="submit" class="btn btn-gradient w-full">Submit donation</button>
        <p class="text-xs text-slate-500">
          Online card processing launches soon. Bank transfers in Nepal are available today—our team will follow up within one business day.
        </p>
      </el-form>

      <aside class="card p-6 space-y-4 self-start">
        <h2 class="font-heading text-xl text-brand-900">Why SWAN?</h2>
        <p class="text-slate-600">
          Every program is community-led and audited with full transparency. Your gift keeps nurses, teachers, and women leaders in the field.
        </p>
        <ul class="space-y-2 text-sm text-slate-700">
          <li v-for="point in whyPoints" :key="point" class="flex gap-3">
            <span class="pill bg-accent-100 border-accent-200">✔</span>
            <span>{{ point }}</span>
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>
