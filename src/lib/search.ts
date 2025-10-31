import Fuse from "fuse.js";
import { getStories, getCauses } from "@/lib/content";

export type SearchItem = {
  type: "story" | "cause";
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image?: string;
  path: string;
  date?: string;
};

let fuse: Fuse<SearchItem> | null = null;

const buildIndex = () => {
  const stories = getStories().map<SearchItem>((story) => ({
    type: "story",
    slug: story.slug,
    title: story.title,
    excerpt: story.excerpt,
    category: story.tag,
    image: story.image,
    path: `/stories/${story.slug}`,
    date: story.date,
  }));

  const causes = getCauses().map<SearchItem>((cause) => ({
    type: "cause",
    slug: cause.slug,
    title: cause.name,
    excerpt: cause.lede,
    category: cause.code,
    image: cause.cardImage ?? cause.heroImage,
    path: `/causes/${cause.slug}`,
  }));

  const items = [...stories, ...causes];
  fuse = new Fuse(items, {
    keys: ["title", "excerpt", "category"],
    includeScore: true,
    threshold: 0.35,
  });
};

export function searchSite(query: string): SearchItem[] {
  if (!fuse) {
    buildIndex();
  }
  const trimmed = query.trim();
  if (!trimmed) return [];
  return fuse!.search(trimmed).map((result) => result.item);
}
