/**
 * Page behaviours: current-section marker in the nav, the mobile
 * "Book a demo" dock, copy-email, and the correction ruler draw-in.
 */
import { prefersReducedMotion } from "./motion.js";

export function initNavSpy() {
  const links = [...document.querySelectorAll(".nav-links a[href^='#']")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (!sections.length) return;

  const mark = (id) => {
    links.forEach((a) => {
      if (a.getAttribute("href") === `#${id}`) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  };

  // A section is "current" when it crosses the middle band of the viewport
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) mark(e.target.id); });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));
}

export function initDock() {
  const dock = document.getElementById("dock");
  const heroActions = document.getElementById("heroActions");
  const contact = document.getElementById("contact");
  if (!dock || !heroActions || !contact) return;

  let heroVisible = true;
  let contactVisible = false;
  const update = () => {
    if (!heroVisible && !contactVisible) dock.dataset.show = "";
    else delete dock.dataset.show;
  };

  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; update(); }).observe(heroActions);
  new IntersectionObserver(([e]) => { contactVisible = e.isIntersecting; update(); }).observe(contact);
}

export function initCopyEmail() {
  const btn = document.getElementById("copyEmail");
  const status = document.getElementById("copyStatus");
  if (!btn) return;

  const done = (ok) => {
    btn.textContent = ok ? "Copied" : "Press Ctrl+C to copy";
    if (ok) btn.dataset.done = "";
    if (status) status.textContent = ok ? "Email address copied" : "";
    setTimeout(() => {
      btn.textContent = "Copy email";
      delete btn.dataset.done;
    }, 2200);
  };

  btn.addEventListener("click", async () => {
    const email = btn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      done(true);
    } catch {
      // Fallback: select the visible address so the visitor can copy it
      const link = document.querySelector(".contact-email");
      if (link) {
        const range = document.createRange();
        range.selectNodeContents(link);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      done(false);
    }
  });
}

export function initRuler() {
  const scale = document.getElementById("degScale");
  if (!scale || prefersReducedMotion()) return;

  // Markers fade in once if the ruler starts below the fold
  const below = scale.getBoundingClientRect().top >= window.innerHeight;
  if (below) scale.setAttribute("data-pending", "");

  // The lens symbols loop only while the ruler is on screen
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      scale.removeAttribute("data-pending");
      scale.setAttribute("data-live", "");
      scale.removeAttribute("data-paused");
    } else if (scale.hasAttribute("data-live")) {
      scale.setAttribute("data-paused", "");
    }
  }, { threshold: 0.3 }).observe(scale);
}

export function initMobileNav() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!nav || !toggle || !links) return;

  const isOpen = () => nav.hasAttribute("data-open");
  const setOpen = (open) => {
    if (open) nav.setAttribute("data-open", "");
    else nav.removeAttribute("data-open");
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(!isOpen()));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (isOpen() && !nav.contains(e.target)) setOpen(false);
  });
  // Must match the mobile breakpoint in css/styles.css (max-width: 760px)
  window.matchMedia("(min-width: 761px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
}
