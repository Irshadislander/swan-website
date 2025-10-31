type ConsentState = "granted" | "denied" | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GTAG_ID = import.meta.env.VITE_GA_ID ?? "";
const CONSENT_KEY = "swan.consent";
const hasTrackingId = typeof GTAG_ID === "string" && GTAG_ID.length > 0;

const getConsent = (): ConsentState => {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
};

const setConsent = (value: "granted" | "denied") => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, value);
};

export const recordConsent = setConsent;

const injectScript = () => {
  if (typeof document === "undefined" || !hasTrackingId) return;
  if (document.getElementById("swan-gtag")) return;
  const script = document.createElement("script");
  script.id = "swan-gtag";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
  document.head.appendChild(script);
};

export function initAnalytics(force = false) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

  const consent = getConsent();
  if ((consent === "granted" || force) && hasTrackingId) {
    injectScript();
    window.gtag?.("js", new Date());
    window.gtag?.("config", GTAG_ID, { anonymize_ip: true });
  }
}

export function track(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push(["event", event, payload]);
}

export function hasConsent() {
  return getConsent();
}
