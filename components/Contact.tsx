"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Check } from "lucide-react";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";
import { CONTACT as CONTACT_DEFAULT } from "@/data/site";
import type { ContactInfo } from "@/lib/content-types";

export function Contact({
  contact: CONTACT = CONTACT_DEFAULT,
}: {
  contact?: ContactInfo;
} = {}) {
  const [sent, setSent] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Derived from props rather than module scope, so admin edits apply.
  const DETAILS = [
    { icon: Phone, label: "Phone", value: CONTACT.phone },
    { icon: Mail, label: "Email", value: CONTACT.email },
    { icon: MapPin, label: "Address", value: CONTACT.address },
  ];

  return (
    <section id="contact" className="scroll-mt-28 bg-paper py-16 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <span className="label text-green">Contact us</span>
            <h2 className="font-display mt-3 text-2xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Have a question, enquiry, or partnership proposal?
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              We&rsquo;d love to hear from you.
            </p>

            <dl className="mt-8 space-y-5">
              {DETAILS.map((d) => (
                <div key={d.label} className="flex items-start gap-4 border-t border-rule/70 pt-4">
                  <d.icon size={16} className="mt-0.5 shrink-0 text-green" />
                  <div>
                    <dt className="label text-ink-soft/70">{d.label}</dt>
                    <dd className="mt-0.5 text-[14.5px] font-medium text-ink">{d.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl border border-rule/80 bg-card p-6 sm:p-8 shadow-xs">
            {sent ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green/10 text-green">
                  <Check size={24} />
                </span>
                <p className="font-display text-xl font-semibold tracking-tight text-ink">
                  Message received
                </p>
                <p className="max-w-xs text-[14px] text-ink-soft">
                  A member of our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Your name" name="name" required />
                  <Field label="Email address" name="email" type="email" required />
                </div>
                <Field label="Subject" name="subject" />
                <div>
                  <label
                    htmlFor="message"
                    className="label mb-1.5 block text-ink-soft/80"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full resize-none rounded-lg border border-rule bg-paper/50 px-3.5 py-2.5 text-base text-ink outline-none transition-colors focus:border-green focus:bg-card sm:text-[14.5px]"
                  />
                </div>
                <Button type="submit" variant="solid" className="w-full justify-center">
                  Send message
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-green bg-green-deep p-6 sm:p-8 text-white shadow-xs">
          <div>
            <h3 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Stay in the loop
            </h3>
            <p className="mt-1 text-[14px] text-white/80">
              Subscribe for news, updates, and offers from South Urban.
            </p>
          </div>
          {subscribed ? (
            <p className="flex items-center gap-2 text-[14px] font-medium text-gold">
              <Check size={16} /> You&rsquo;re on the list.
            </p>
          ) : (
            <form
              className="flex w-full max-w-md gap-2.5"
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
            >
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter"
                type="email"
                required
                placeholder="Email address"
                className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-base text-white outline-none transition-colors placeholder:text-white/50 focus:border-white focus:bg-white/15 sm:text-[14px]"
              />
              <Button type="submit" variant="onDark">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="label mb-1.5 block text-ink-soft/80">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-rule bg-paper/50 px-3.5 py-2.5 text-base text-ink outline-none transition-colors focus:border-green focus:bg-card sm:text-[14.5px]"
      />
    </div>
  );
}

