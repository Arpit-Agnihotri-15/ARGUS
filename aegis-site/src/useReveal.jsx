import { useEffect, useRef, useState } from "react";

/**
 * Tiny scroll-reveal helper. Adds `animate-fade-up` once an element enters
 * the viewport, and never re-hides it (so scrolling back up doesn't replay
 * the animation and feel jittery). Respects prefers-reduced-motion via the
 * animation itself being near-instant under that media query (see index.css).
 */
export function useReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px", ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

/** Wraps children in a div that fades/slides up the first time it's scrolled into view. */
export function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`${className} ${visible ? "animate-fade-up" : "opacity-0"}`}
      style={{ animationDelay: visible ? `${delay}ms` : undefined }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
