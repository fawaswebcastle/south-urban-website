"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Safe IntersectionObserver with early fallback
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const getAnimationClasses = () => {
    if (isVisible) return "opacity-100 translate-x-0 translate-y-0 scale-100";
    switch (direction) {
      case "up":
        return "opacity-0 translate-y-5 scale-[0.995]";
      case "down":
        return "opacity-0 -translate-y-5 scale-[0.995]";
      case "left":
        return "opacity-0 translate-x-5";
      case "right":
        return "opacity-0 -translate-x-5";
      case "none":
        return "opacity-0 scale-[0.98]";
      default:
        return "opacity-0 translate-y-5";
    }
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${getAnimationClasses()} ${className}`}
    >
      {children}
    </div>
  );
}
