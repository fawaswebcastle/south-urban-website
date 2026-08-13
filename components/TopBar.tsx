import { Phone } from "lucide-react";
import { SocialIcon } from "./ui/SocialIcon";
import { CONTACT as CONTACT_DEFAULT, SOCIALS as SOCIALS_DEFAULT } from "@/data/site";
import type { ContactInfo, Social } from "@/lib/content-types";

export function TopBar({
  contact: CONTACT = CONTACT_DEFAULT,
  socials: SOCIALS = SOCIALS_DEFAULT,
}: {
  contact?: ContactInfo;
  socials?: readonly Social[];
} = {}) {
  return (
    <div className="bg-green-deep text-paper/90 border-b border-white/10">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-6 py-1.5 md:px-10">
        <a
          href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
          className="-my-1 flex items-center gap-2 py-1.5 text-[12.5px] font-medium text-paper/85 transition-colors hover:text-white"
        >
          <Phone size={13} className="text-gold" />
          <span>{CONTACT.phone}</span>
        </a>

        <ul className="flex items-center gap-1.5">
          {SOCIALS.map((social) => (
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
      </div>
    </div>
  );
}

