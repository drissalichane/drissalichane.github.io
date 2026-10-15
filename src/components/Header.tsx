"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navItems = [
    { name: "Expérience", href: "#experience" },
    { name: "Projets", href: "#projects" },
    { name: "Compétences", href: "#skills" },
    { name: "Formation", href: "#education" },
    { name: "Livre d'or", href: "#guestbook" },
];

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

                <nav className="hidden items-center gap-7 md:flex">
                    {navItems.map((item, i) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="group font-mono text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-ink"
                        >
                            <span className="mr-1.5 text-accent/60 transition-colors group-hover:text-accent">0{i + 1}</span>
                            {item.name}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        className="border border-primary px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-accent transition-colors hover:bg-primary hover:text-white"
                    >
                        Contact
                    </a>
                </nav>

                <button
                    className="text-muted transition-colors hover:text-ink md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                    {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {mobileMenuOpen && (
                <motion.nav
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t border-line bg-background/95 px-6 py-4 backdrop-blur-xl md:hidden"
                >
                    {[...navItems, { name: "Contact", href: "#contact" }].map((item, i) => (
                        <a
                            key={item.name}
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
