"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Briefcase, Calendar, MapPin } from "lucide-react";

export default function Experience() {
    const { experience } = portfolioData;

    return (
        <section id="experience" className="py-20 bg-black/20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-[1px] bg-purple-500"></div>
                        <h2 className="text-purple-400 font-medium tracking-wide text-sm uppercase">Carrière</h2>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Expériences Professionnelles
                    </h3>
                </motion.div>

                <div className="max-w-4xl mx-auto space-y-12">
                    {experience.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-8 md:pl-0"
                        >
                            {/* Timeline Line */}
                            <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-[1px] bg-white/10 transform -translate-x-1/2" />

                            {/* Timeline Dot */}
                            <div className="hidden md:block absolute left-[50%] top-0 w-4 h-4 rounded-full bg-purple-500 transform -translate-x-1/2 border-4 border-black" />

                            <div className={`md:flex items-start justify-between ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                                <div className="md:w-[45%] mb-4 md:mb-0">
                                    <div className={`p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-purple-500/30 transition-colors ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                                        <div className={`flex flex-col gap-2 mb-4 ${index % 2 === 0 ? "md:items-start" : "md:items-end"}`}>
                                            <h4 className="text-xl font-bold text-white">{exp.role}</h4>
                                            <h5 className="text-lg text-purple-400 font-medium">{exp.company}</h5>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {exp.period}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    {exp.location}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                                            {exp.description}
                                        </p>

                                        <ul className={`mb-6 space-y-2 text-sm text-gray-400 ${index % 2 === 0 ? "" : "md:flex md:flex-col md:items-end"}`}>
                                            {exp.tasks.map((task, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                                                    <span>{task}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "" : "md:justify-end"}`}>
                                            {exp.technologies.slice(0, 6).map((tech) => (
                                                <span key={tech} className="px-2 py-1 text-xs rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-[45%]" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
