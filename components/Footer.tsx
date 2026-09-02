import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Container } from "./ui/Container";
import { Logo } from "./ui/Logo";
import type { CompanyDetails, ContactInfo, FooterContent, NavLink } from "@/lib/content-types";

export function Footer({
  footer,
  navLinks = [],
  contact,
}: {
  footer?: FooterContent;
  navLinks?: readonly NavLink[];
  contact?: Partial<ContactInfo>;
  companyDetails?: CompanyDetails;
} = {}) {
  const description = footer?.description;
  const regText = footer?.regText;
  const areaText = footer?.areaText;
  const quickLinksTitle = footer?.quickLinksTitle;
  const quickLinks = footer?.quickLinks && footer.quickLinks.length > 0 ? footer.quickLinks : navLinks;
  const contactTitle = footer?.contactTitle;
  const phone = footer?.phone || contact?.phone;
  const email = footer?.email || contact?.email;
  const address = footer?.address || contact?.address;
  const copyright = footer?.copyright;
  const actText = footer?.actText;
  const logo = footer?.logo;

  const hasMainContent = Boolean(
    description || regText || areaText || quickLinks.length > 0 || phone || email || address
  );

  return (
    <footer className="bg-green-deep text-white/75 border-t border-white/10">
      {hasMainContent && (
        <Container className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Logo tone="paper" src={logo} />
            {description && (
              <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/60">
                {description}
              </p>
            )}
            {(regText || areaText) && (
              <p className="mt-4 text-[12.5px] leading-relaxed text-white/40 font-mono">
                {regText}
                {regText && areaText && <br />}
                {areaText}
              </p>
            )}
          </div>

          {quickLinks.length > 0 && (
            <div>
              {quickLinksTitle && <p className="label text-gold">{quickLinksTitle}</p>}
              <ul className="mt-4 space-y-2.5 text-[14px]">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/70 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(phone || email || address) && (
            <div>
              {contactTitle && <p className="label text-gold">{contactTitle}</p>}
              <ul className="mt-4 space-y-3 text-[14px] text-white/70">
                {phone && (
                  <li className="flex items-start gap-3">
                    <Phone size={15} className="mt-0.5 shrink-0 text-gold" />
                    <span>{phone}</span>
                  </li>
                )}
                {email && (
                  <li className="flex items-start gap-3">
                    <Mail size={15} className="mt-0.5 shrink-0 text-gold" />
                    <span>{email}</span>
                  </li>
                )}
                {address && (
                  <li className="flex items-start gap-3">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-gold" />
                    <span>{address}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </Container>
      )}

      {(copyright || actText) && (
        <div className="border-t border-white/10 bg-black/20">
          <Container className="flex flex-col items-center justify-between gap-3 py-5 text-[12px] text-white/40 sm:flex-row">
            {copyright && <p>{copyright}</p>}
            {actText && <p>{actText}</p>}
          </Container>
        </div>
      )}
    </footer>
  );
}
