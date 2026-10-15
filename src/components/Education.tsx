"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import SectionHeading from "@/components/SectionHeading";

export default function Education() {
    const { education, certifications } = portfolioData;

    return (
        <section id="education" className="relative border-t border-line bg-surface/40 py-28">
            <div className="container mx-auto px-6">
                <SectionHeading index="04" label="Parcours" title="Formation" />

                <div className="border-t border-line">
                    {education.map((edu) => (
                        <motion.div
                            key={edu.degree}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="grid gap-2 border-b border-line py-7 md:grid-cols-12 md:items-baseline md:gap-8"
                        >
                            <span className="font-mono text-sm text-accent md:col-span-2">{edu.period}</span>
                            <h3 className="font-display text-lg font-semibold text-ink md:col-span-6">{edu.degree}</h3>
                            <p className="text-sm text-muted md:col-span-4 md:text-right">{edu.institution}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12">
                    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                        {certifications.map((cert) => (
                            <span key={cert} className="border border-line px-3 py-1.5 text-sm text-ink/85">
                                {cert}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
