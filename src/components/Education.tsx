"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { GraduationCap } from "lucide-react";

export default function Education() {
    const { education } = portfolioData;

    return (
        <section id="education" className="py-20 bg-zinc-900/30">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-[1px] bg-green-500"></div>
                        <h2 className="text-green-400 font-medium tracking-wide text-sm uppercase">Parcours</h2>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Formation Académique
                    </h3>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {education.map((edu, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-black border border-zinc-800 rounded-2xl p-8 hover:border-green-500/30 transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="icon mb-6 p-3 w-fit rounded-lg bg-zinc-900 border border-zinc-800 text-green-400 group-hover:bg-green-500/10 transition-colors">
                                <GraduationCap size={24} />
                            </div>

                            <span className="block text-sm text-green-400 font-mono mb-2">{edu.period}</span>
                            <h4 className="text-lg font-bold text-white mb-2">{edu.degree}</h4>
                            <p className="text-gray-400 text-sm">{edu.institution}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
