import site from "@/content/site.json";
import causes from "@/content/causes.json";
import stories from "@/content/stories.json";

export type SiteContent = typeof site;
export type Cause = (typeof causes)[number];
export type Story = (typeof stories)[number];
export type NavContent = SiteContent["nav"];

export const getSite = (): SiteContent => site;

export const getNav = (): NavContent => site.nav;

export const getCauses = (): Cause[] => causes;

export const getCause = (slug: string): Cause | undefined =>
  causes.find((cause) => cause.slug === slug);

export const getStories = (): Story[] => stories;

export const getStory = (slug: string): Story | undefined =>
  stories.find((story) => story.slug === slug);
