<template>
  <section class="pt-10 pb-16 sm:pt-14 sm:pb-24">
    <div class="container-irr grid md:grid-cols-2 gap-10 items-center">
      <div>
        <p class="kicker mb-4">Grassroots impact in Nepal</p>
        <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight text-brand-900">
          Because a student’s dream should never be out of reach.
        </h1>
        <p class="mt-5 text-slate-700 max-w-prose">
          SWAN teams travel deep into rural Nepal to deliver scholarships, women-led cooperatives,
          and mobile health camps—in partnership with the communities we serve.
        </p>
        <div class="mt-6 flex gap-3">
          <RouterLink to="/donate" class="btn btn-gradient">Donate now</RouterLink>
          <RouterLink to="/about" class="pill border-brand-300 text-brand-900">Why SWAN?</RouterLink>
        </div>
        <div class="mt-8">
          <QuickDonateBar />
        </div>
      </div>

      <div class="card p-6 min-h-[260px]">
        <div class="h-56 rounded-xl bg-gradient-to-br from-brand-100 to-white"></div>
      </div>
    </div>
  </section>

  <section class="pb-12">
    <div class="container-irr">
      <ul class="stat-row">
        <li><span class="font-medium">Students reached</span><span>5,200+</span></li>
        <li><span class="font-medium">Health camps delivered</span><span>26</span></li>
        <li><span class="font-medium">Active volunteers</span><span>180+</span></li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import QuickDonateBar from "@components/hero/QuickDonateBar.vue";
</script>
