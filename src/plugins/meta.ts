import type { RouteLocationNormalized } from "vue-router";

type MetaResolver = string | ((to: RouteLocationNormalized) => string | undefined);
type FlagResolver = boolean | ((to: RouteLocationNormalized) => boolean | undefined) | undefined;

const SITE_URL = "https://swan.org";
const DEFAULT_TITLE = "SWAN — Empowering lives in Nepal";
const DEFAULT_DESCRIPTION =
  "SWAN empowers communities in Nepal through scholarships, health access, and women’s leadership programs.";
const DEFAULT_IMAGE = "/images/placeholder-1200x800.jpg";

const isBrowser = typeof document !== "undefined";

const resolveMeta = (value: MetaResolver | undefined, to: RouteLocationNormalized, fallback: string) => {
  if (!value) return fallback;
  if (typeof value === "function") {
    const result = value(to);
    return result || fallback;
  }
  return value;
};

const toAbsoluteUrl = (value: string) => {
  if (!value) return SITE_URL;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `${SITE_URL}${value}`;
  return `${SITE_URL}/${value}`;
};

const ensureMetaTag = (attr: "name" | "property", key: string, content: string) => {
  if (!isBrowser) return;
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const removeMetaTag = (attr: "name" | "property", key: string) => {
  if (!isBrowser) return;
  const element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  element?.remove();
};

const ensureLinkTag = (rel: string, href: string) => {
  if (!isBrowser) return;
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

export const applyMeta = (to: RouteLocationNormalized) => {
  if (!isBrowser) return;
  const meta = to.meta as {
    title?: MetaResolver;
    description?: MetaResolver;
    image?: MetaResolver;
    noindex?: FlagResolver;
  };

  const title = resolveMeta(meta?.title, to, DEFAULT_TITLE);
  const description = resolveMeta(meta?.description, to, DEFAULT_DESCRIPTION);
  const image = resolveMeta(meta?.image, to, DEFAULT_IMAGE);
  const absoluteImage = toAbsoluteUrl(image);
  const canonicalUrl = toAbsoluteUrl(to.fullPath || "/");
  const noindex = typeof meta?.noindex === "function" ? meta.noindex(to) : Boolean(meta?.noindex);

  document.title = title;

  ensureMetaTag("name", "description", description);
  ensureMetaTag("property", "og:title", title);
  ensureMetaTag("property", "og:description", description);
  ensureMetaTag("property", "og:image", absoluteImage);
  ensureMetaTag("property", "og:url", canonicalUrl);
  ensureMetaTag("name", "twitter:title", title);
  ensureMetaTag("name", "twitter:description", description);
  ensureMetaTag("name", "twitter:image", absoluteImage);
  ensureMetaTag("name", "twitter:url", canonicalUrl);

  ensureLinkTag("canonical", canonicalUrl);

  if (noindex) {
    ensureMetaTag("name", "robots", "noindex,nofollow");
  } else {
    removeMetaTag("name", "robots");
  }
};
