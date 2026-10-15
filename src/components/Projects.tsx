"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { ArrowUpRight, Github } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

export default function Projects() {
    const { projects } = portfolioData;
    const featured = projects.filter((p) => p.featured);
    const others = projects.filter((p) => !p.featured);

    return (
        <section id="projects" className="relative border-t border-line bg-surface/40 py-28">
            <div className="container mx-auto px-6">
                <SectionHeading index="02" label="Réalisations" title="Projets" />

                <div className="border-t border-line">
                    {featured.map((project, index) => (
                        <motion.article
                            key={project.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5 }}
                            className="group relative grid gap-8 border-b border-line py-12 transition-colors hover:bg-background/40 md:grid-cols-12"
                        >
                            <span className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-primary transition-transform duration-500 group-hover:scale-y-100" />

                            <div className="pl-5 font-mono text-sm text-accent md:col-span-1">
                                {String(index + 1).padStart(2, "0")}
                            </div>

                            <div className="pl-5 md:col-span-6 md:pl-0">
                                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{project.category}</p>
                                <h3 className="font-display text-2xl font-semibold leading-snug text-ink transition-colors group-hover:text-accent md:text-3xl">
                                    {project.title}
                                </h3>
                                <p className="mt-3 leading-relaxed text-muted">{project.description}</p>
                                <ul className="mt-5 space-y-2.5">
                                    {project.features.map((feature) => (
                                        <li key={feature} className="flex gap-3 text-sm leading-relaxed text-ink/85">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col justify-between gap-6 pl-5 md:col-span-5 md:border-l md:border-line md:pl-8">
                                <div>
                                    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Stack</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech) => (
                                            <span
                                                key={tech}
                                                className="border border-line px-2.5 py-1 font-mono text-xs text-ink/85 transition-colors group-hover:border-primary/40"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {project.repo && (
                                    <a
                                        href={project.repo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex w-fit items-center gap-2 border border-line px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:border-primary hover:text-accent"
                                    >
                                        <Github size={14} />
                                        Code source
                                        <ArrowUpRight size={14} />
                                    </a>
                                )}
                            </div>
                        </motion.article>
                    ))}
                </div>

                <p className="mb-6 mt-16 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Autres projets</p>
                <div className="grid gap-px border border-line bg-line md:grid-cols-2">
                    {others.map((project) => (
                        <motion.article
                            key={project.title}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="group flex flex-col bg-background p-8 transition-colors hover:bg-surface"
                        >
                            <div className="mb-3 flex items-start justify-between gap-4">
                                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{project.category}</p>
                                {project.repo && (
                                    <a
                                        href={project.repo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Code source : ${project.title}`}
                                        className="text-muted transition-colors hover:text-accent"
                                    >
                                        <ArrowUpRight size={18} />
                                    </a>
                                )}
                            </div>
                            <h3 className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-accent">
                                {project.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
                            <ul className="mt-4 space-y-2">
                                {project.features.map((feature) => (
                                    <li key={feature} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                                        <span className="mt-2 h-1 w-1 shrink-0 bg-primary" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-auto pt-6 font-mono text-xs leading-6 text-muted">
                                {project.technologies.join("  /  ")}
                            </p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
