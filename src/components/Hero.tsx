"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export default function Hero() {
    const { personal } = portfolioData;

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                        Disponible pour PFE (Fev 2026)
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Bonjour, je suis <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            {personal.name}
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                        {personal.title}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400 mb-10">
                        <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-blue-400" />
                            <span>{personal.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={18} className="text-blue-400" />
                            <a href={`mailto:${personal.email}`} className="hover:text-white transition-colors">{personal.email}</a>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <a
                            href="#projects"
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transform hover:-translate-y-1"
                        >
                            Voir mes projets
                        </a>
                        <a
                            href="#guestbook"
                            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-medium transition-all backdrop-blur-sm transform hover:-translate-y-1"
                        >
                            Livre d'or
                        </a>
                        <div className="flex gap-4">
                            <a
                                href={personal.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href={personal.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
