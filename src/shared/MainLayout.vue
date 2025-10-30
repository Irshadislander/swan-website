<template>
  <div class="min-h-screen flex flex-col bg-haze">
    <NavBar />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
