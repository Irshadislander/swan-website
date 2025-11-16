<template>
  <footer class="site-footer mt-16" role="contentinfo" data-animate="fade-up">
    <div class="site-footer__top container-irr">
      <div class="site-footer__brand">
        <RouterLink to="/" class="site-footer__logo" aria-label="SWAN home">
          <span>{{ site.brand.name }}</span>
          <small>{{ site.brand.tagline }}</small>
        </RouterLink>
        <p class="site-footer__blurb">{{ footer.blurb }}</p>
        <div class="site-footer__contact">
          <p>{{ footer.contact.email }}</p>
          <p>{{ footer.contact.location }}</p>
        </div>
        <ul class="site-footer__social">
          <li v-for="link in socialLinks" :key="link.label">
            <a :href="link.href" target="_blank" rel="noopener" :aria-label="link.label">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path :d="link.icon" fill="currentColor" />
              </svg>
            </a>
          </li>
        </ul>
        <NewsletterSignup source="footer" />
      </div>

      <nav class="site-footer__nav">
        <div v-for="column in footer.columns" :key="column.heading" class="site-footer__nav-column">
          <h3>{{ column.heading }}</h3>
          <ul>
            <li v-for="link in column.links" :key="link.to">
              <RouterLink :to="link.to">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="site-footer__cta">
        <p class="text-xs uppercase tracking-[0.35em] text-white/70">Keep programs running</p>
        <RouterLink :to="donateHref" class="btn btn-gradient w-full" aria-label="Donate to SWAN">{{ donateLabel }}</RouterLink>
        <p class="site-footer__cta-note">90% of every gift funds programs across Nepal.</p>
      </div>
    </div>

    <div class="site-footer__bottom container-irr">
      <p class="text-sm text-white/70">© {{ currentYear }} {{ site.brand.name }}. All rights reserved.</p>
      <ul class="site-footer__legal">
        <li v-for="link in footer.legal" :key="link.to">
          <RouterLink :to="link.to">{{ link.label }}</RouterLink>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { getSite } from "@/lib/content";
import NewsletterSignup from "@/components/newsletter/SignupForm.vue";

const site = getSite();
const footer = site.footer;
const donate = site.nav.cta;
const donateHref = donate?.href ?? "/donate";
const donateLabel = donate?.label ?? "Donate";
const currentYear = new Date().getFullYear();

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/swanimpact",
    icon:
      "M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm0 2h10c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3zm9 1a1 1 0 100 2 1 1 0 000-2zm-4 2a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/swanimpact",
    icon:
      "M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4zM9.5 8h3.8v2.16h.05c.53-1 1.82-2.16 3.75-2.16 4.01 0 4.75 2.64 4.75 6.07V24h-4v-7.73c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.07V24h-4z",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/swanimpact",
    icon: "M13 9h2V7h-2c-1.1 0-2 .9-2 2v2H9v2h2v6h2v-6h2l.5-2H13z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@swanimpact",
    icon:
      "M10 15l5.19-3L10 9zm11.5-6.5s-.2-1.43-.82-2.06c-.79-.82-1.67-.82-2.07-.87C16.4 5.5 12 5.5 12 5.5h-.01s-4.4 0-6.61.07c-.4.05-1.28.05-2.07.87C2.2 7.07 2 8.5 2 8.5s-.2 1.43-.2 2.86v1.28c0 1.43.2 2.86.2 2.86s.2 1.43.82 2.06c.79.82 1.83.8 2.29.89 1.66.16 6.89.17 6.89.17s4.4 0 6.61-.07c.4-.05 1.28-.05 2.07-.87.62-.63.82-2.06.82-2.06s.2-1.43.2-2.86v-1.28c0-1.43-.2-2.86-.2-2.86z",
  },
];
</script>

<style scoped>
.site-footer {
  background: radial-gradient(circle at top, rgba(34, 85, 230, 0.8), rgba(5, 27, 59, 0.95));
  color: #fff;
  padding: 4rem 0 2rem;
}

.site-footer__top {
  display: grid;
  gap: 2.5rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: flex-start;
}

.site-footer__logo {
  display: inline-flex;
  flex-direction: column;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
}

.site-footer__logo small {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}

.site-footer__blurb {
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.site-footer__contact p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.75);
}

.site-footer__social {
  display: flex;
  gap: 0.75rem;
  margin: 1rem 0;
}

.site-footer__social a {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.site-footer__social svg {
  width: 1.1rem;
  height: 1.1rem;
}

.site-footer__social a:hover {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.site-footer__nav {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.site-footer__nav-column h3 {
  font-size: 0.8rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}

.site-footer__nav-column ul {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.site-footer__nav-column a {
  color: rgba(255, 255, 255, 0.9);
  transition: color 0.2s ease;
}

.site-footer__nav-column a:hover {
  color: #fff;
}

.site-footer__cta {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.site-footer__cta-note {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
}

.site-footer__bottom {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}

.site-footer__legal {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
}

.site-footer__legal a {
  color: rgba(255, 255, 255, 0.85);
}
</style>
