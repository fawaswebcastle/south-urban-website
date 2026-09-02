"use client";

import { useState } from "react";
import { Bell, Download, ChevronRight, X, Calendar, FileText } from "lucide-react";
import { Container } from "./ui/Container";
import { NOTIFICATIONS as NOTIFICATIONS_DEFAULT } from "@/data/site";
import type { Notification } from "@/lib/content-types";

export function NoticeBar({
  notifications: NOTIFICATIONS = NOTIFICATIONS_DEFAULT,
}: {
  notifications?: readonly Notification[];
} = {}) {
  const [selectedNotice, setSelectedNotice] = useState<Notification | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);

  return (
    <>
      {/* Running Text Notification Bar for Warm Paper Space */}
      <section className="relative z-20 border-b border-rule bg-card py-3 text-ink shadow-2xs">
        <Container className="flex items-center gap-3 sm:gap-4 overflow-hidden">
          {/* Static Notification Badge Label */}
          {/* Below `sm` the word alone outruns the ticker it labels, so the
           *  bell carries the meaning and the track keeps the width. */}
          <div className="flex shrink-0 items-center gap-2 rounded-md bg-green px-2 py-1 text-white font-semibold shadow-2xs sm:px-3">
            <Bell size={12} className="text-gold animate-pulse" />
            <span className="label hidden text-[10.5px] font-semibold text-white tracking-wider sm:inline">
              ANNOUNCEMENTS
            </span>
          </div>

          {/* Marquee Ticker Track */}
          <div className="group relative min-w-0 flex-1 overflow-hidden">
            <div className="flex w-max items-center gap-8 animate-[marquee_35s_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap">
              {[...NOTIFICATIONS, ...NOTIFICATIONS].map((item, index) => (
                <button
                  key={`${item.id}-${index}`}
                  onClick={() => setSelectedNotice(item)}
                  className="flex items-center gap-3 text-left transition-colors hover:text-green focus:outline-none"
                >
                  <span className="text-[13.5px] font-medium text-ink hover:underline">
                    {item.title}
                  </span>

                  <span className="flex items-center gap-1.5 rounded-md border border-rule/80 bg-paper px-2.5 py-0.5 text-[11.5px] font-mono text-ink-soft shadow-2xs">
                    <Calendar size={11} className="text-green" />
                    {item.date}
                  </span>

                  {Boolean(item.documentUrl) && (
                    <span className="flex items-center text-green opacity-90" title="Attachment available">
                      <Download size={13} />
                    </span>
                  )}

                  <span aria-hidden className="ml-2 text-green/40 font-bold">
                    &bull;
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowAllModal(true)}
            className="hidden shrink-0 items-center gap-1 rounded-md border border-rule bg-paper px-2.5 py-1 text-[12px] font-medium text-ink-soft transition-colors hover:border-green hover:text-green sm:flex shadow-2xs"
          >
            <span>View All ({NOTIFICATIONS.length})</span>
            <ChevronRight size={12} />
          </button>
        </Container>
      </section>




      {/* Selected Notice Detail Modal */}
      {selectedNotice && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-rule bg-card p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-rule/70 pb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-green/10 px-2.5 py-1 text-[11px] font-semibold text-green uppercase tracking-wider">
                  {selectedNotice.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="rounded-lg border border-rule p-1 text-ink-soft hover:bg-paper-deep hover:text-ink transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="font-display mt-4 text-lg font-semibold tracking-tight text-ink">
              {selectedNotice.title}
            </h3>

            <p className="mt-2 text-[12.5px] font-mono text-ink-soft flex items-center gap-1.5">
              <Calendar size={13} className="text-green" />
              Published: {selectedNotice.date}
            </p>

            <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
              {selectedNotice.summary}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-rule/70 pt-4">
              <button
                onClick={() => setSelectedNotice(null)}
                className="rounded-lg border border-rule px-4 py-2 text-[13px] font-medium text-ink-soft hover:bg-paper-deep transition-colors"
              >
                Close
              </button>
              {Boolean(selectedNotice.documentUrl) && (
                <a
                  href={selectedNotice.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  onClick={() => setSelectedNotice(null)}
                  className="inline-flex items-center gap-2 rounded-lg bg-green px-4 py-2 text-[13px] font-medium text-white hover:bg-green-deep transition-colors shadow-xs"
                >
                  <Download size={14} />
                  Download Circular
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* All Notifications List Modal */}
      {showAllModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setShowAllModal(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-rule bg-card p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-rule/80 pb-4">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-green" />
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                  Latest Notifications & Circulars
                </h3>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="rounded-lg border border-rule p-1.5 text-ink-soft hover:bg-paper-deep hover:text-ink transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {NOTIFICATIONS.map((notif) => (
                <div
                  key={notif.id}
                  className="group rounded-lg border border-rule/80 bg-paper/40 p-4 transition-all hover:border-green/60 hover:bg-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-md bg-green/10 px-2 py-0.5 text-[11px] font-semibold text-green uppercase tracking-wider">
                      {notif.category}
                    </span>
                    <span className="text-[12px] font-mono text-ink-soft flex items-center gap-1">
                      <Calendar size={11} className="text-green" />
                      {notif.date}
                    </span>
                  </div>

                  <h4 className="font-display mt-2 text-[15px] font-semibold text-ink group-hover:text-green transition-colors">
                    {notif.title}
                  </h4>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
                    {notif.summary}
                  </p>

                  {Boolean(notif.documentUrl) && (
                    <div className="mt-3 flex items-center gap-2">
                      <a
                        href={notif.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        onClick={() => setShowAllModal(false)}
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-green hover:underline"
                      >
                        <FileText size={13} />
                        View Document / Circular
                        <Download size={12} className="ml-0.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


