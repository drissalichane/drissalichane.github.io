"use client";

import { motion } from "framer-motion";
import { Code2, Database, Layout, Server, Brain, Settings } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useLang } from "@/i18n";

const icons = {
    languages: Code2,
    frameworks: Layout,
    ai_data: Brain,
    devops: Settings,
    databases: Database,
    conception: Server,
};

export default function Skills() {
    const { data, t } = useLang();
    const { skills } = data;
    const labels = t.skills.categories;
    const skillCategories = Object.keys(labels) as Array<keyof typeof labels>;

    return (
        <section id="skills" className="relative border-t border-line py-28">
            <div className="container mx-auto px-6">
                <SectionHeading index="03" label={t.skills.label} title={t.skills.title} />

                <div className="grid border-l border-t border-line md:grid-cols-2 lg:grid-cols-3">
                    {skillCategories.map((category, index) => {
                        const Icon = icons[category];
                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="group border-b border-r border-line p-8 transition-colors hover:bg-surface/60"
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="font-display text-lg font-semibold text-ink">{labels[category]}</h3>
                                    <Icon size={18} className="text-muted transition-colors group-hover:text-accent" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {skills[category].map((skill: string) => (
                                        <span
                                            key={skill}
                                            className="border border-line px-2.5 py-1 font-mono text-xs text-ink/85 transition-colors hover:border-primary hover:text-accent"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-10 grid gap-6 font-mono text-xs uppercase tracking-[0.15em] text-muted md:grid-cols-2">
                    <p>
                        <span className="text-accent">{t.skills.soft}</span>
                        <span className="mx-3 text-line">/</span>
                        <span className="normal-case tracking-normal text-ink/85">{skills.soft.join(", ")}</span>
                    </p>
                    <p>
                        <span className="text-accent">{t.skills.spoken}</span>
                        <span className="mx-3 text-line">/</span>
                        <span className="normal-case tracking-normal text-ink/85">{skills.languages_spoken.join(", ")}</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
