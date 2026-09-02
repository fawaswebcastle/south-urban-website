import { Phone } from "lucide-react";
import { SocialIcon } from "./ui/SocialIcon";
import type { ContactInfo, Social } from "@/lib/content-types";

export function TopBar({
  contact,
  socials = [],
}: {
  contact?: Partial<ContactInfo>;
  socials?: readonly Social[];
} = {}) {
  const phone = contact?.phone;
  const hasSocials = socials && socials.length > 0;

  if (!phone && !hasSocials) return null;

  return (
    <div className="bg-green-deep text-paper/90 border-b border-white/10">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-6 py-1.5 md:px-10">
        {phone ? (
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="-my-1 flex items-center gap-2 py-1.5 text-[12.5px] font-medium text-paper/85 transition-colors hover:text-white"
          >
            <Phone size={13} className="text-gold" />
            <span>{phone}</span>
          </a>
        ) : <div />}

        {hasSocials && (
          <ul className="flex items-center gap-1.5">
            {socials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  aria-label={social.name}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-paper/70 transition-colors hover:bg-white/10 hover:text-white sm:h-6 sm:w-6"
                >
                  <SocialIcon name={social.name} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

