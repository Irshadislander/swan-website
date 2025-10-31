/**
 * Run a callback once the provided element enters the viewport.
 * Uses IntersectionObserver and disconnects after the first trigger.
 */
export function whenVisible(el: Element, cb: () => void) {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    cb();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    const entry = entries.find((item) => item.isIntersecting) ?? entries[0];
    if (entry && entry.isIntersecting) {
      cb();
      observer.disconnect();
    }
  });

  observer.observe(el);
}
