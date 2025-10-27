<template>
  <footer class="bg-grayx-50 mt-20">
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <div class="flex items-center gap-2">
          <span class="h-8 w-8 rounded-full bg-brand-600"></span>
          <span class="heading-font font-semibold text-brand-800">SWAN</span>
        </div>
        <p class="mt-3 text-sm text-grayx-600">
          Empowering lives through education and health in Nepal.
        </p>
      </div>
      <div>
        <h4 class="font-semibold text-grayx-800">Explore</h4>
        <ul class="mt-3 space-y-2 text-sm">
          <li><RouterLink to="/about">About</RouterLink></li>
          <li><RouterLink to="/causes">Causes</RouterLink></li>
          <li><RouterLink to="/stories">Stories</RouterLink></li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold text-grayx-800">Get Involved</h4>
        <ul class="mt-3 space-y-2 text-sm">
          <li><RouterLink to="/get-involved">Volunteer</RouterLink></li>
          <li><RouterLink to="/donate">Donate</RouterLink></li>
          <li><RouterLink to="/contact">Contact</RouterLink></li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold text-grayx-800">Newsletter</h4>
        <div class="mt-3 flex gap-2">
          <input class="flex-1 rounded-xl border border-grayx-200 px-3 py-2" placeholder="Email address" />
          <button class="rounded-xl px-4 bg-mint-600 text-white">Join</button>
        </div>
      </div>
    </div>
    <div class="border-t border-grayx-200 text-xs text-grayx-500 py-4 text-center">© 2025 SWAN</div>
  </footer>
</template>