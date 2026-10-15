"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/SectionHeading";

export default function Experience() {
    const { experience } = portfolioData;

    return (
        <section id="experience" className="relative border-t border-line py-28">
            <div className="container mx-auto px-6">
                <SectionHeading index="01" label="Carrière" title="Expériences professionnelles" />

                <div>
                    {experience.map((exp, index) => (
                        <motion.article
                            key={exp.company}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5 }}
                            className="grid gap-4 md:grid-cols-[220px_1fr] md:gap-12"
                        >
                            <div className="font-mono text-xs uppercase tracking-[0.15em] text-muted md:pt-1.5 md:text-right">
                                {exp.period.split(" - ").map((part) => (
                                    <p key={part} className="text-accent">{part}</p>
                                ))}
                                <p className="mt-2">{exp.location}</p>
                            </div>

                            <div className="relative border-l border-line pb-16 pl-8">
                                <span
                                    className={cn(
                                        "absolute -left-[5px] top-2 h-2.5 w-2.5",
                                        index === 0
                                            ? "bg-primary shadow-[0_0_0_4px_rgba(47,124,246,0.2)]"
                                            : "border border-accent bg-background"
                                    )}
                                />
                                <h3 className="font-display text-2xl font-semibold text-ink">{exp.role}</h3>
                                <p className="mt-1 font-medium text-accent">{exp.company}</p>

                                {exp.description && (
                                    <p className="mt-4 max-w-3xl leading-relaxed text-muted">{exp.description}</p>
                                )}

                                <ul className="mt-5 max-w-3xl space-y-2.5">
                                    {exp.tasks.map((task) => (
                                        <li key={task} className="flex gap-3 text-sm leading-relaxed text-ink/85">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                                            <span>{task}</span>
                                        </li>
                                    ))}
                                </ul>

                                <p className="mt-6 font-mono text-xs leading-6 text-muted">
                                    {exp.technologies.join("  /  ")}
                                </p>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
