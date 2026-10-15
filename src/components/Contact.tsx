"use client";

import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useLang } from "@/i18n";

export default function Contact() {
    const { data, t } = useLang();
    const { personal } = data;

    const links = [
        { label: "LinkedIn", value: "driss-alichane", href: personal.linkedin },
        { label: "GitHub", value: "drissalichane", href: personal.github },
        { label: t.contact.phone, value: personal.phone, href: `tel:${personal.phone.replace(/[^+\d]/g, "")}` },
    ];

    return (
        <section id="contact" className="relative overflow-hidden border-t border-line pb-10 pt-28">
            <div className="blueprint absolute inset-0 [mask-image:linear-gradient(to_top,black,transparent_70%)]" />

            <div className="container relative mx-auto px-6">
                <SectionHeading index="06" label={t.contact.label} title={t.contact.title} />

                <p className="max-w-xl text-lg leading-relaxed text-muted">{t.contact.text}</p>

                <a
                    href={`mailto:${personal.email}`}
                    className="group mt-10 inline-flex max-w-full items-center gap-3 font-display text-xl font-semibold text-ink sm:text-3xl md:text-5xl"
                >
                    <span className="break-all border-b-2 border-primary pb-1 transition-colors group-hover:text-accent">
                        {personal.email}
                    </span>
                    <ArrowUpRight className="h-6 w-6 shrink-0 text-accent transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 md:h-10 md:w-10" />
                </a>

                <div className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-3">
                    {links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between bg-background p-6 transition-colors hover:bg-surface"
                        >
                            <span>
                                <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{link.label}</span>
                                <span className="mt-1 block text-ink">{link.value}</span>
                            </span>
                            <ArrowUpRight size={18} className="text-muted transition-colors group-hover:text-accent" />
                        </a>
                    ))}
                </div>

                <footer className="mt-24 flex flex-col gap-2 border-t border-line pt-8 font-mono text-xs text-muted sm:flex-row sm:justify-between">
                    <span>© {new Date().getFullYear()} {personal.name}</span>
                    <span>{personal.location}</span>
                </footer>
            </div>
        </section>
    );
}
