"use client";
import { Flame, Heart, MapPin, Mail } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[rgba(255,255,255,0.05)]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4A7CFF]/3 to-[#FF6B6B]/5 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#4A7CFF] to-[#7C6BFF] shadow-lg shadow-[#4A7CFF]/20">
                <Flame size={16} className="text-white" />
              </div>
              <span className="text-base font-semibold text-[#FAFAFA]">Brightburn</span>
            </div>
            <p className="text-sm text-[#737380] leading-relaxed max-w-xs">
              A modern dance and fitness studio built for students who want confidence, energy, and growth.
            </p>
            <div className="flex items-center gap-4 text-[#737380]">
              <a href="#" className="hover:text-[#FAFAFA] transition-colors text-xs">Instagram</a>
              <span className="text-[#3a3a45]">&middot;</span>
              <a href="#" className="hover:text-[#FAFAFA] transition-colors text-xs">WhatsApp</a>
              <span className="text-[#3a3a45]">&middot;</span>
              <a href="#" className="hover:text-[#FAFAFA] transition-colors text-xs">Email</a>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FAFAFA]">Programs</p>
            <ul className="space-y-2">
              {["Kids Dance", "Hip Hop Teens", "Fitness & Zumba", "Advanced Crew", "Personal Training"].map((p) => (
                <li key={p}>
                  <a href="#classes" className="text-sm text-[#737380] hover:text-[#4A7CFF] transition-colors">{p}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FAFAFA]">Quick Links</p>
            <ul className="space-y-2">
              {[
                { label: "Features", href: "#features" },
                { label: "Schedule", href: "#schedule" },
                { label: "Contact", href: "#contact" },
                { label: "Open App", href: "/" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-[#737380] hover:text-[#4A7CFF] transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FAFAFA]">Contact</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-[#737380]">
                <MapPin size={12} className="text-[#4A7CFF] shrink-0" />
                Brightburn Studio
              </li>
              <li className="flex items-center gap-2 text-sm text-[#737380]">
                <Mail size={12} className="text-[#4A7CFF] shrink-0" />
                hello@brightburn.studio
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#737380]">
            &copy; {new Date().getFullYear()} Brightburn Dance & Fitness Studio
          </p>
          <p className="text-xs text-[#737380] flex items-center gap-1.5">
            Built with <Heart size={10} className="text-[#FF6B6B]" /> for dancers
          </p>
        </div>
      </div>
    </footer>
  );
}