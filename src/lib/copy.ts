export const copy = {
  brand: {
    name: "SWAN",
    tagline: "Students Working Against Neglect",
  },
  navTop: {
    phoneLabel: "Call",
    phone: "(+977) 01-555-1234",
    emailLabel: "Email",
    email: "hello@swan.org",
    links: [
      { label: "News", to: "/stories" },
      { label: "Volunteer", to: "/get-involved" },
    ],
  },
  nav: {
    primary: [
      { label: "About", to: "/about" },
      {
        label: "Causes",
        to: "/causes",
        mega: {
          columns: [
            {
              title: "Education",
              items: [
                { label: "Scholarships", to: "/causes/education#scholarships" },
                { label: "Safe Classrooms", to: "/causes/education#classrooms" },
              ],
            },
            {
              title: "Health",
              items: [
                { label: "Mobile Camps", to: "/causes/health#camps" },
                { label: "Women’s Wellness", to: "/causes/health#women" },
              ],
            },
            {
              title: "Women’s Leadership",
              items: [
                { label: "Co-ops", to: "/causes/empowerment#coops" },
                { label: "Training", to: "/causes/empowerment#training" },
              ],
            },
          ],
          cta: { label: "Why SWAN?", to: "/why" },
        },
      },
      { label: "Stories", to: "/stories" },
      { label: "Contact", to: "/contact" },
    ],
  },
  focusAreas: [
    {
      key: "education",
      badge: "ED",
      title: "Education Access",
      blurb: "Scholarships, safe classrooms, and mentorship for rural students to stay in school.",
      stat: "92% of SWAN scholars graduated secondary school last year.",
      to: "/causes/education",
    },
    {
      key: "health",
      badge: "HE",
      title: "Community Health",
      blurb: "Mobile health camps and women’s wellness programs with trusted local nurses.",
      stat: "9,500+ medical consultations provided in remote districts.",
      to: "/causes/health",
    },
    {
      key: "empowerment",
      badge: "EM",
      title: "Women’s Leadership",
      blurb: "Micro-grants and trainings for women-led cooperatives focused on livelihoods.",
      stat: "71 new women-led enterprises incubated since 2021.",
      to: "/causes/empowerment",
    },
  ],
  donateCta: { label: "Donate", to: "/donate" },
  hero: {
    eyebrow: "Grassroots impact in Nepal",
    title: "Because a student’s dream should never be out of reach.",
    body: "SWAN teams travel deep into rural Nepal to deliver scholarships, women-led cooperatives, and mobile health camps — all in partnership with the communities we serve.",
    primaryCta: { label: "Donate now", to: "/donate" },
    secondaryCta: { label: "Why SWAN?", to: "/about" },
    slides: [
      {
        id: "education",
        headline: "Serve students in rural hills",
        subtext: "Scholarships, tutoring, and safe classrooms keep young minds in school.",
        image: "/images/hero-education.jpg",
        cta: { label: "Support students", to: "/donate" },
      },
      {
        id: "health",
        headline: "Deliver mobile health camps",
        subtext: "Volunteer nurses hike for hours so families can see a doctor close to home.",
        image: "/images/hero-health.jpg",
        cta: { label: "Fund a health camp", to: "/donate" },
      },
      {
        id: "women",
        headline: "Invest in women-led cooperatives",
        subtext: "Micro-grants power women entrepreneurs to launch sustainable livelihoods.",
        image: "/images/hero-women.jpg",
        cta: { label: "Back women leaders", to: "/donate" },
      },
    ],
    stats: [
      { value: 5200, suffix: "+", label: "Students reached" },
      { value: 26, suffix: "", label: "Health camps delivered" },
      { value: 180, suffix: "+", label: "Active volunteers" },
    ],
    highlights: ["Scholarships", "Health access", "Women’s leadership"],
    imageAlt: "Community members participating in a SWAN workshop",
  },
  about: {
    title: "Rooted in local leadership.",
    body: "Founded by Nepali students, SWAN invests directly in community-led ideas—from school rebuilding to maternal health clinics—so villages can thrive on their own terms.",
    bullets: [
      "Transparent reporting for every donor",
      "Local coordinators in all seven program districts",
      "Focus on education, health, and youth empowerment",
    ],
    cta: { label: "Meet the team", to: "/about" },
  },
  causes: [
    {
      id: "education",
      title: "Education Access",
      description: "Scholarships, safe classrooms, and mentorship for rural students to stay in school.",
      impact: "92% of SWAN scholars graduated secondary school last year.",
    },
    {
      id: "health",
      title: "Community Health",
      description: "Mobile health camps and women’s wellness programs with trusted local nurses.",
      impact: "9,500+ medical consultations provided in remote districts.",
    },
    {
      id: "empowerment",
      title: "Women’s Leadership",
      description: "Micro-grants and trainings for women-led cooperatives focused on livelihoods.",
      impact: "71 new women-led enterprises incubated since 2021.",
    },
  ],
  impact: {
    title: "Why your donation matters",
    headline: "Every rupee stays accountable.",
    items: [
      {
        title: "Community owned",
        description: "Programs are designed and audited with village committees so funding answers real priorities.",
      },
      {
        title: "Data informed",
        description: "We track attendance, graduation, and health outcomes to learn fast and adapt faster.",
      },
      {
        title: "Lean operations",
        description: "90% of gifts go directly into programs thanks to a mostly volunteer leadership team.",
      },
    ],
  },
  cta: {
    title: "Join the SWAN collective",
    body: "Monthly donors fund emergency scholarships and keep health camps on the road year-round.",
    primaryCta: { label: "Give monthly", to: "/donate" },
    secondaryCta: { label: "Volunteer", to: "/get-involved" },
  },
  stories: {
    title: "Stories from the field",
    body: "See how communities are steering projects and changing what’s possible for the next generation.",
    items: [
      {
        title: "A library rises in Lamjung",
        excerpt: "Students and parents rebuilt their library after the 2015 quake—with SWAN covering materials and training.",
        to: "/stories/library-in-lamjung",
      },
      {
        title: "Health on wheels",
        excerpt: "Nurses and volunteers travel by jeep and foot to reach families who’ve never seen a doctor before.",
        to: "/stories/health-on-wheels",
      },
      {
        title: "Girls who code, girls who lead",
        excerpt: "Meet the first cohort of SWAN digital literacy graduates now mentoring girls in their villages.",
        to: "/stories/girls-who-lead",
      },
    ],
  },
  partners: {
    title: "Trusted by local governments & global allies",
    logos: ["Global Youth Fund", "Rural Nepal Collective", "UN SDG Action", "Kathmandu Health Board"],
  },
  footer: {
    blurb: "SWAN is a registered nonprofit advancing education, health, and youth leadership across rural Nepal.",
    columns: [
      {
        heading: "Programs",
        links: [
          { label: "Education access", to: "/causes/education" },
          { label: "Community health", to: "/causes/health" },
          { label: "Women’s leadership", to: "/causes/empowerment" },
        ],
      },
      {
        heading: "Get involved",
        links: [
          { label: "Volunteer", to: "/get-involved" },
          { label: "Donate", to: "/donate" },
          { label: "Partnerships", to: "/contact" },
        ],
      },
      {
        heading: "Organization",
        links: [
          { label: "About SWAN", to: "/about" },
          { label: "Stories", to: "/stories" },
          { label: "Contact", to: "/contact" },
        ],
      },
    ],
    legal: [
      { label: "Privacy Policy", to: "/legal/privacy" },
      { label: "Terms of Use", to: "/legal/terms" },
    ],
    contact: {
      email: "hello@swan.org",
      location: "Kathmandu • Pokhara • Lamjung",
    },
  },
};

export type HeroStat = (typeof copy.hero.stats)[number];
