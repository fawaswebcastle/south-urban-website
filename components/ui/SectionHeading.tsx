import clsx from "clsx";

/** Editorial section opener: a ruled small-caps label above a display heading. */
export function SectionHeading({
  label,
  title,
  intro,
  tone = "ink",
  className,
}: {
  label: string;
  title: string;
  intro?: string;
  tone?: "ink" | "paper";
  className?: string;
}) {
  const onPaper = tone === "paper";
  return (
    <div className={clsx("max-w-2xl", className)}>
      <div
        className={clsx(
          "flex items-center gap-3 border-t pt-3.5",
          onPaper ? "border-paper/20" : "border-ink/15"
        )}
      >
        <span className={clsx("label", onPaper ? "text-gold" : "text-green")}>
          {label}
        </span>
      </div>
      <h2
        className={clsx(
          "font-display mt-3 text-2xl font-semibold leading-[1.15] tracking-tight text-balance sm:text-3xl lg:text-4xl",
          onPaper ? "text-paper" : "text-ink"
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={clsx(
            "mt-3 text-[15px] sm:text-[16px] leading-relaxed",
            onPaper ? "text-paper/75" : "text-ink-soft"
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

