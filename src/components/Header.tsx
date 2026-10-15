"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useLang } from "@/i18n";
import { LanguageToggle, ThemeToggle } from "@/components/Toggles";

export default function Header() {
    const { t } = useLang();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { name: t.nav.experience, href: "#experience" },
        { name: t.nav.projects, href: "#projects" },
        { name: t.nav.skills, href: "#skills" },
        { name: t.nav.education, href: "#education" },
        { name: t.nav.guestbook, href: "#guestbook" },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
                scrolled || mobileMenuOpen ? "border-line bg-background/85 backdrop-blur-md" : "border-transparent"
            )}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-6">
                <a href="#hero" className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.2em] text-ink">
                    <span className="h-2.5 w-2.5 bg-primary" />
                    Alichane<span className="-mx-2 text-primary">/</span>Driss
                </a>

                <nav className="hidden items-center gap-6 lg:flex">
                    {navItems.map((item, i) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="group font-mono text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-ink"
                        >
                            <span className="mr-1.5 text-accent/60 transition-colors group-hover:text-accent">0{i + 1}</span>
                            {item.name}
                        </a>
                    ))}
                    <LanguageToggle className="ml-2" />
                    <ThemeToggle />
                    <a
                        href="#contact"
                        className="border border-primary px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-accent transition-colors hover:bg-primary hover:text-white"
                    >
                        {t.nav.contact}
                    </a>
                </nav>

                <div className="flex items-center gap-4 lg:hidden">
                    <LanguageToggle />
                    <ThemeToggle />
                    <button
                        className="text-muted transition-colors hover:text-ink"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? t.a11y.closeMenu : t.a11y.openMenu}
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <motion.nav
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t border-line bg-background/95 px-6 py-4 backdrop-blur-xl lg:hidden"
                >
                    {[...navItems, { name: t.nav.contact, href: "#contact" }].map((item, i) => (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-4 border-b border-line py-4 font-mono text-sm uppercase tracking-[0.15em] text-muted last:border-b-0 hover:text-ink"
                        >
                            <span className="text-accent">0{i + 1}</span>
                            {item.name}
                        </a>
                    ))}
                </motion.nav>
            )}
        </header>
    );
}
