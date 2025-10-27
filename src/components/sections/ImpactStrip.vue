<template>
  <section class="bg-brand-50">
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-12 grid sm:grid-cols-3 gap-6">
      <Stat :value="5000" label="Students Reached"/>
      <Stat :value="20"   label="Health Camps"/>
      <Stat :value="150"  label="Active Volunteers"/>
    </div>
  </section>
</template>

<script setup>
import Stat from './Stat.vue'
</script>