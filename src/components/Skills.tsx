"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Code2, Database, Layout, Server, Brain, Settings } from "lucide-react";

const icons = {
    languages: Code2,
    frameworks: Layout,
    ai_data: Brain,
    devops: Settings,
    databases: Database,
    conception: Server,
    soft: Code2, // Fallback
    languages_spoken: Code2, // Fallback
};

const labels = {
    languages: "Langages",
    frameworks: "Frameworks & Tools",
    ai_data: "IA & Data",
    devops: "DevOps",
    databases: "Bases de données",
    conception: "Conception",
};

export default function Skills() {
    const { skills } = portfolioData;

    // Filter only the categories we want to show in the grid
    const skillCategories = Object.keys(labels) as Array<keyof typeof labels>;

    return (
        <section id="skills" className="py-20 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-blue-400 font-medium tracking-wide text-sm uppercase mb-4">Expertise</h2>
                    <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Compétences Techniques
                    </h3>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skillCategories.map((category, index) => {
                        const Icon = icons[category];
                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:bg-zinc-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                                        <Icon size={24} />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-200">{labels[category]}</h4>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {skills[category].map((skill: string) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1.5 text-sm rounded-md bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 transition-colors cursor-default"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
