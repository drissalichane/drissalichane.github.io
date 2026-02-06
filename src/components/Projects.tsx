"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { ExternalLink, Github, Layers } from "lucide-react";

export default function Projects() {
    const { projects } = portfolioData;

    return (
        <section id="projects" className="py-20 relative">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-[1px] bg-blue-500"></div>
                        <h2 className="text-blue-400 font-medium tracking-wide text-sm uppercase">Portfolio</h2>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Projets Académiques & Personnels
                    </h3>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:border-blue-500/30"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Layers className="text-blue-500/20 w-24 h-24 rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <h4 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                                    {project.title}
                                </h4>
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    {project.description}
                                </p>

                                <ul className="space-y-2 mb-8 text-gray-400 text-sm">
                                    {project.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {project.technologies.slice(0, 8).map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 8 && (
                                        <span className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                                            +{project.technologies.length - 8}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
