/**
 * Centralised copy for the SWAN landing experience to simplify future i18n swaps.
 */
export const landingCopy = {
  brand: 'SWAN',
  nav: {
    links: [
      { label: 'About', to: '/about' },
      { label: 'Causes', to: '/causes' },
      { label: 'Stories', to: '/stories' },
      { label: 'Contact', to: '/contact' },
    ],
    donateLabel: 'Donate',
  },
  hero: {
    title: 'Empowering lives through education and health.',
    tagline: 'Join us to uplift communities in Nepal with scholarships, health camps, and youth empowerment.',
    primaryCta: { label: 'Donate Now', to: '/donate' },
    secondaryCta: { label: 'Join Us', to: '/get-involved' },
    imageAlt: 'SWAN community members smiling together.',
  },
  aboutStrip: {
    eyebrow: 'Who we are',
    title: 'Grassroots support for rural Nepal.',
    description:
      'Founded by students, SWAN partners with local leaders to deliver scholarships, women’s empowerment, and rural health camps with full transparency.',
    cta: { label: 'Learn more', to: '/about' },
    imageAlt: 'Students in Nepal participating in a SWAN program.',
  },
  causes: {
    title: 'Our Causes',
    description: 'We invest in long-term programs that create lasting change for families across Nepal.',
    items: [
      {
        title: 'Scholarships & Mentorship',
        description: 'Supporting first-generation students with tuition, mentoring, and career guidance.',
      },
      {
        title: 'Community Health Outreach',
        description: 'Running mobile clinics, maternal health workshops, and access to essential care.',
      },
      {
        title: 'Women & Youth Leadership',
        description: 'Equipping young leaders with the tools to advocate for their communities.',
      },
    ],
  },
  impact: {
    stats: [
      { value: 5200, label: 'Students Reached' },
      { value: 24, label: 'Health Camps' },
      { value: 180, label: 'Active Volunteers' },
    ],
  },
  ctaBanner: {
    title: 'Your support transforms lives — Join our mission.',
    primaryCta: { label: 'Donate Now', to: '/donate' },
    secondaryCta: { label: 'Become a Volunteer', to: '/get-involved' },
  },
  stories: {
    title: 'Stories from the field',
    readMoreLabel: 'Read more',
    fallbackExcerpt: 'Hear directly from the students and families whose lives are changing.',
    items: [
      {
        title: 'Mira’s journey to medical school',
        excerpt: 'A scholarship and mentor pairing helped Mira continue her studies after a crisis.',
      },
      {
        title: 'Health camps reach remote villages',
        excerpt: 'Volunteer doctors and nurses hiked for hours to treat 400 patients in a weekend.',
      },
      {
        title: 'Youth leaders launch recycling drive',
        excerpt: 'A leadership cohort turned a community clean-up into a circular economy pilot.',
      },
    ],
  },
  partners: {
    tagline: 'Trusted by partners and community coalitions across Nepal.',
    placeholders: 4,
  },
  footer: {
    mission: 'Empowering lives through education and health in Nepal.',
    explore: 'Explore',
    involved: 'Get Involved',
    newsletter: 'Newsletter',
    newsletterPlaceholder: 'Email address',
    newsletterCta: 'Join',
    copyright: '© 2025 SWAN',
  },
} as const

export type LandingCopy = typeof landingCopy
