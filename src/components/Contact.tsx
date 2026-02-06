"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Github, Linkedin, Mail, Send } from "lucide-react";

export default function Contact() {
    const { personal } = portfolioData;

    return (
        <section id="contact" className="py-24 relative overflow-hidden bg-black">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-12 rounded-3xl"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                        Prêt à collaborer ?
                    </h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                        Je suis actuellement à la recherche d’un stage de fin d’études (PFE) à partir de février 2026. Discutons de vos projets !
                    </p>

                    <a
                        href={`mailto:${personal.email}`}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors mb-12"
                    >
                        <Mail size={20} />
                        Me Contacter
                    </a>

                    <div className="flex justify-center gap-8">
                        <a
                            href={personal.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors flex flex-col items-center gap-2 group"
                        >
                            <div className="p-3 rounded-full bg-white/5 group-hover:bg-blue-600 transition-colors">
                                <Linkedin size={24} />
                            </div>
                            <span className="text-sm">LinkedIn</span>
                        </a>
                        <a
                            href={personal.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors flex flex-col items-center gap-2 group"
                        >
                            <div className="p-3 rounded-full bg-white/5 group-hover:bg-gray-600 transition-colors">
                                <Github size={24} />
                            </div>
                            <span className="text-sm">GitHub</span>
                        </a>
                    </div>
                </motion.div>

                <div className="mt-20 text-gray-600 text-sm">
                    <p>© {new Date().getFullYear()} {personal.name}. Tous droits réservés.</p>
                </div>
            </div>
        </section>
    );
}
