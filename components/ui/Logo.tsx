import Image from "next/image";

export function Logo({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  return (
    <div className="flex items-center">
      <Image
        src="/logo_official.png"
        alt="South Urban Agro Multi State Co-operative Society Ltd."
        width={360}
        height={95}
        priority
        className="h-9 sm:h-10 md:h-[42px] w-auto object-contain rounded-md"
      />
    </div>
  );
}



