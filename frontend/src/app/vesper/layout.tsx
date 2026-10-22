/**
 * @fileoverview ASHENRITUAL Architecture
 * @module layout.tsx
 */
"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  Scan,
  Eye,
  Ruler,
  ChevronDown,
  History,
  Plus,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useVesperStore, formatSessionTime } from "@/store/vesper.store";

const navItems = [
  { name: "Chat", href: "/vesper", icon: MessageSquare },
  { name: "Size", href: "/vesper/size", icon: Scan },
  { name: "Preview", href: "/vesper/preview", icon: Eye },
  { name: "Fit", href: "/vesper/measurements", icon: Ruler },
];

export default function VesperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isChatsOpen, setIsChatsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navDropdownRef = useRef<HTMLDivElement>(null);
  const chatsDropdownRef = useRef<HTMLDivElement>(null);

  const {
    sessions,
    currentSessionId,
    createNewSession,
    selectSession,
    deleteSession,
    clearAllSessions,
  } = useVesperStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        navDropdownRef.current &&
        !navDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNavOpen(false);
      }
      if (
        chatsDropdownRef.current &&
        !chatsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsChatsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNewChat = () => {
    createNewSession();
    setIsChatsOpen(false);
    if (pathname !== "/vesper") {
      router.push("/vesper");
    }
  };

  const handleSelectSession = (sessionId: string) => {
    selectSession(sessionId);
    setIsChatsOpen(false);
    if (pathname !== "/vesper") {
      router.push("/vesper");
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearAllSessions();
  };

  const activeItem =
    navItems.find((item) => item.href === pathname) || navItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <div className="flex h-[100dvh] bg-[#050505] text-[#E8E8E8] font-sans overflow-hidden relative pt-[72px] md:pt-[100px]">
      {/* Top Left Floating Vesper Navigation Bubble */}
      <div
        className="fixed top-[72px] md:top-[116px] left-4 md:left-8 z-50 flex flex-col"
        ref={navDropdownRef}
      >
        <button
          onClick={() => {
            setIsNavOpen(!isNavOpen);
            if (!isNavOpen) setIsChatsOpen(false);
          }}
          className="group inline-flex h-11 items-center gap-5 border border-white/10 bg-black/50 backdrop-blur-xl px-5 md:px-7 rounded-full font-heading text-[10px] font-medium uppercase tracking-[0.25em] text-[#FDFCFB] transition-all duration-500 hover:border-white hover:bg-white hover:text-black shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
        >
          <span className="flex items-center gap-2">
            <ActiveIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Vesper — </span>
            {activeItem.name}
          </span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-500",
              isNavOpen ? "rotate-180" : ""
            )}
            strokeWidth={1.5}
          />
        </button>

        <AnimatePresence>
          {isNavOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
                filter: "blur(10px)",
                scale: 0.95,
              }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)", scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-[calc(100%+12px)] left-0 w-full min-w-[220px] flex flex-col border border-white/10 rounded-[20px] bg-[#0A0A0A]/70 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] p-2"
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsNavOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3.5 text-[10px] uppercase tracking-[0.25em] transition-all duration-300 font-heading rounded-xl relative overflow-hidden",
                      isActive
                        ? "bg-white/15 text-white"
                        : "text-[#888] hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-1/2 bg-white rounded-r-full"
                      />
                    )}
                    <Icon className="h-3.5 w-3.5 relative z-10" />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Right Floating All Chats Bubble */}
      <div
        className="fixed top-[72px] md:top-[116px] right-4 md:right-8 z-50 flex flex-col items-end"
        ref={chatsDropdownRef}
      >
        <button
          onClick={() => {
            setIsChatsOpen(!isChatsOpen);
            if (!isChatsOpen) setIsNavOpen(false);
          }}
          className="group inline-flex h-11 items-center gap-3 md:gap-4 border border-white/10 bg-black/50 backdrop-blur-xl px-4 md:px-7 rounded-full font-heading text-[10px] font-medium uppercase tracking-[0.25em] text-[#FDFCFB] transition-all duration-500 hover:border-white hover:bg-white hover:text-black shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          aria-expanded={isChatsOpen}
          aria-label="All Chats Menu"
        >
          <span className="flex items-center gap-2">
            <History className="h-3.5 w-3.5" />
            <span>All Chats</span>
            {mounted && sessions.length > 0 && (
              <span className="ml-1 rounded-full bg-white/15 px-1.5 py-0.5 text-[8px] tracking-normal text-white group-hover:bg-black/20 group-hover:text-black transition-colors">
                {sessions.length}
              </span>
            )}
          </span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-500",
              isChatsOpen ? "rotate-180" : ""
            )}
            strokeWidth={1.5}
          />
        </button>

        <AnimatePresence>
          {isChatsOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
                filter: "blur(10px)",
                scale: 0.95,
              }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)", scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-[calc(100%+12px)] right-0 w-[350px] sm:w-[420px] md:w-[450px] max-w-[calc(100vw-2rem)] flex flex-col border border-white/10 rounded-[28px] bg-[#0A0A0A]/95 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.9)] p-3.5 z-50 overflow-hidden"
            >
              {/* New Chat Action Item with Curved Edges */}
              <button
                onClick={handleNewChat}
                className="group/new flex items-center justify-between w-full px-5 py-3.5 rounded-full bg-white/[0.08] hover:bg-white text-white hover:text-black font-heading text-[10px] font-medium uppercase tracking-[0.22em] transition-all duration-300 shadow-sm border border-white/10 hover:border-white"
              >
                <span className="flex items-center gap-2.5">
                  <Plus className="h-3.5 w-3.5 transition-transform duration-300 group-hover/new:rotate-90" />
                  <span>New Chat</span>
                </span>
                <span className="text-[9px] opacity-60 tracking-widest lowercase group-hover:text-black transition-colors">
                  start fresh
                </span>
              </button>

              {/* History Section Header */}
              <div className="flex items-center justify-between px-3.5 pt-3.5 pb-2 text-[9px] uppercase tracking-[0.25em] text-[#777] font-heading border-b border-white/5 mb-1.5">
                <span>History ({mounted ? sessions.length : 0})</span>
                {mounted && sessions.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-[8px] uppercase tracking-widest text-[#777] hover:text-red-400 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* History List */}
              <div className="max-h-[320px] overflow-y-auto space-y-1.5 hide-scrollbar pr-0.5">
                {!mounted || sessions.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <MessageSquare className="h-4 w-4 mx-auto mb-2 text-[#444]" />
                    <p className="text-[11px] text-[#777]">
                      No saved conversations yet.
                    </p>
                    <p className="text-[9px] text-[#444] mt-1 tracking-wider uppercase font-heading">
                      Consultations appear here
                    </p>
                  </div>
                ) : (
                  sessions.map((session) => {
                    const isCurrent = session.id === currentSessionId;
                    return (
                      <div
                        key={session.id}
                        onClick={() => handleSelectSession(session.id)}
                        className={cn(
                          "group/item flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all duration-300 cursor-pointer relative",
                          isCurrent
                            ? "bg-white/15 text-white border border-white/20 shadow-sm"
                            : "text-[#888] hover:bg-white/5 hover:text-white border border-transparent"
                        )}
                      >
                        {isCurrent && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-1/2 bg-white rounded-r-full" />
                        )}
                        <div className="flex-1 min-w-0 pr-1">
                          <p
                            className="text-[11px] font-sans font-medium text-foreground truncate group-hover/item:text-white"
                            title={session.title}
                          >
                            {session.title || "Consultation"}
                          </p>
                          <p className="text-[9px] text-[#666] tracking-wider uppercase font-heading mt-0.5">
                            {formatSessionTime(session.updatedAt)} •{" "}
                            {session.messages.length} msg
                            {session.messages.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(session.id);
                          }}
                          className="opacity-0 group-hover/item:opacity-100 p-1.5 hover:text-red-400 text-[#666] hover:bg-white/5 rounded-full transition-all shrink-0"
                          title="Delete conversation"
                          aria-label="Delete conversation"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Chat Content — Full Width */}
      <div className="flex-1 overflow-hidden min-w-0">{children}</div>
    </div>
  );
}
