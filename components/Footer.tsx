import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Container } from "./ui/Container";
import { Logo } from "./ui/Logo";
import {
  NAV_LINKS as NAV_LINKS_DEFAULT,
  CONTACT as CONTACT_DEFAULT,
  COMPANY_DETAILS as COMPANY_DETAILS_DEFAULT,
} from "@/data/site";
import type { CompanyDetails, ContactInfo, FooterContent, NavLink } from "@/lib/content-types";

export function Footer({
  footer,
  navLinks: NAV_LINKS = NAV_LINKS_DEFAULT,
  contact: CONTACT = CONTACT_DEFAULT,
  companyDetails: COMPANY_DETAILS = COMPANY_DETAILS_DEFAULT,
}: {
  footer?: FooterContent;
  navLinks?: readonly NavLink[];
  contact?: ContactInfo;
  companyDetails?: CompanyDetails;
} = {}) {
  const description = footer?.description || "Empowering agricultural communities through cooperative principles, sustainable practices, and market-driven solutions since 2009.";
  const regText = footer?.regText || `Reg. ${COMPANY_DETAILS.rows[1].value}`;
  const areaText = footer?.areaText || `Area of operation: ${COMPANY_DETAILS.rows[3].value}`;
  const quickLinksTitle = footer?.quickLinksTitle || "Quick links";
  const quickLinks = footer?.quickLinks || NAV_LINKS;
  const contactTitle = footer?.contactTitle || "Get in touch";
  const phone = footer?.phone || CONTACT.phone;
  const email = footer?.email || CONTACT.email;
  const address = footer?.address || COMPANY_DETAILS.rows[2].value;
  const copyright = footer?.copyright || `Copyright © ${new Date().getFullYear()} South Urban. All rights reserved.`;
  const actText = footer?.actText || "Registered under the Multi State Cooperative Societies Act, 2002";

  return (
    <footer className="bg-green-deep text-white/75 border-t border-white/10">
      <Container className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Logo tone="paper" />
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/60">
            {description}
          </p>
          <p className="mt-4 text-[12.5px] leading-relaxed text-white/40 font-mono">
            {regText}
            <br />
            {areaText}
          </p>
        </div>

        <div>
          <p className="label text-gold">{quickLinksTitle}</p>
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

        <div>
          <p className="label text-gold">{contactTitle}</p>
          <ul className="mt-4 space-y-3 text-[14px] text-white/70">
            <li className="flex items-start gap-3">
              <Phone size={15} className="mt-0.5 shrink-0 text-gold" />
              <span>{phone}</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={15} className="mt-0.5 shrink-0 text-gold" />
              <span>{email}</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={15} className="mt-0.5 shrink-0 text-gold" />
              <span>{address}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 bg-black/20">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-[12px] text-white/40 sm:flex-row">
          <p>{copyright}</p>
          <p>{actText}</p>
        </Container>
      </div>
    </footer>
  );
}
