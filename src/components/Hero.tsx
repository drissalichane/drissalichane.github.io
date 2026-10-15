"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import Corners from "@/components/Corners";

export default function Hero() {
    const { personal, experience } = portfolioData;
    const [lastName, firstName] = personal.name.split(" ");
    const current = experience[0];

    const spec = [
        { key: "Rôle", value: personal.title },
        { key: "Poste", value: `${current.company}, ${current.location}` },
        { key: "Base", value: personal.location },
        { key: "Stack", value: personal.stack.join(" / ") },
    ];

    return (
        <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pb-24 pt-28">
            <div className="blueprint absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_35%_45%,black,transparent)]" />
            <div className="absolute -top-48 left-1/4 h-[520px] w-[520px] bg-primary/15 blur-[150px]" />

            <div className="container relative mx-auto grid gap-16 px-6 lg:grid-cols-12 lg:items-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="lg:col-span-7"
                >
                    <p className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-accent">
                        <span className="h-2 w-2 animate-pulse bg-primary" />
                        {personal.status}
                    </p>

                    <h1 className="font-display text-6xl font-bold leading-[0.9] tracking-tight sm:text-7xl xl:text-8xl">
                        <span className="block text-ink">{firstName}</span>
                        <span className="block text-transparent [-webkit-text-stroke:1.5px_var(--color-accent)]">{lastName}</span>
                    </h1>

                    <p className="mt-8 font-display text-xl text-ink sm:text-2xl">{personal.title}</p>
                    <p className="mt-4 max-w-xl leading-relaxed text-muted">{personal.bio}</p>

                    <div className="mt-10 flex flex-wrap items-center gap-3">
                        <a
                            href="#experience"
                            className="group inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent hover:text-background"
                        >
                            Voir mon parcours
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </a>
                        <a
                            href="#contact"
                            className="inline-flex items-center border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-primary hover:text-accent"
                        >
                            Me contacter
                        </a>
                        <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
                        <a
                            href={personal.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="flex h-11 w-11 items-center justify-center border border-line text-muted transition-colors hover:border-primary hover:text-accent"
                        >
                            <Github size={18} />
                        </a>
                        <a
                            href={personal.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="flex h-11 w-11 items-center justify-center border border-line text-muted transition-colors hover:border-primary hover:text-accent"
                        >
                            <Linkedin size={18} />
                        </a>
                    </div>
                </motion.div>

                <motion.aside
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="relative border border-line bg-surface/70 backdrop-blur-sm lg:col-span-5"
                >
                    <Corners />
                    <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                        <span>profil.spec</span>
                        <span className="text-accent">FR / EN</span>
                    </div>

                    <dl className="divide-y divide-line">
                        {spec.map((row) => (
                            <div key={row.key} className="grid grid-cols-[88px_1fr] gap-4 px-5 py-4">
                                <dt className="pt-0.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">{row.key}</dt>
                                <dd className="text-sm text-ink">{row.value}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="border-t border-line bg-background/60 px-5 py-4 font-mono text-xs leading-6">
                        <p className="text-muted">
                            <span className="text-accent">$</span> dotnet build
                        </p>
                        <p className="pl-4 text-muted">0 erreur(s), 0 avertissement(s)</p>
                        <p className="pl-4 text-accent">
                            BUILD_SUCCESS
                            <span className="ml-1 inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-accent" />
                        </p>
                    </div>
                </motion.aside>
            </div>

            <a
                href="#experience"
                className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted transition-colors hover:text-accent lg:flex"
            >
                Défiler
                <span className="h-10 w-px bg-gradient-to-b from-accent to-transparent" />
            </a>
        </section>
    );
}
