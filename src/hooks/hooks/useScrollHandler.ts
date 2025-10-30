"use client";

import { useState, useEffect } from "react";
import { NAVIGATION_ITEMS } from "@/constants";

export function useScrollHandler(navRef: React.RefObject<HTMLElement>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [hidden, setHidden] = useState(false);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!navRef.current) return;
      if (isMenuOpen && !navRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isMenuOpen, navRef]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id]")) as HTMLElement[];
    if (sections.length === 0) return;

    const onScroll = () => {
      const y = window.scrollY + 120; // offset for navbar height
      let currentId = "hero";
      for (const s of sections) {
        if (s.offsetTop <= y) currentId = s.id || currentId;
      }
      const mapped = NAVIGATION_ITEMS.find((n) => n.href.replace(/^#/, "") === currentId)?.name;
      setActiveLink(mapped || currentId.charAt(0).toUpperCase() + currentId.slice(1));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      const current = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setElevated(current > 24);
          if (current > 140 && current - lastY > 6) {
            setHidden(true);
          } else if (current < lastY - 6 || current < 140) {
            setHidden(false);
          }
          lastY = current;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, name: string, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const id = href.replace(/^#/, "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveLink(name);
      setIsMenuOpen(false);
      history.replaceState(null, "", `#${id}`);
    }
  };

  return { isMenuOpen, setIsMenuOpen, activeLink, hidden, elevated, handleAnchorClick };
}
