import { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

type Variant = "solid" | "outline" | "onDark" | "outlineOnDark";

const styles: Record<Variant, string> = {
  solid:
    "bg-green text-white hover:bg-green-deep active:scale-[0.99] border border-green",
  outline:
    "border border-ink/20 bg-card text-ink hover:border-green hover:text-green hover:bg-paper-deep/50 active:scale-[0.99]",
  onDark:
    "bg-white text-green-deep hover:bg-paper active:scale-[0.99] border border-white/40",
  outlineOnDark:
    "border border-white/25 text-white hover:border-white hover:bg-white/10 active:scale-[0.99]",
};

export function Button({
  children,
  href,
  onClick,
  variant = "solid",
  className,
  type = "button",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
}) {
  const classes = clsx(
    "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13.5px] font-medium tracking-tight transition-all duration-200 shadow-xs",
    styles[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

