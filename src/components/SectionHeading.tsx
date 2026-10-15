"use client";

import { motion } from "framer-motion";

type Props = {
    index: string;
    label: string;
    title: string;
};

export default function SectionHeading({ index, label, title }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-14"
        >
            <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em]">
                <span className="text-accent">{index}</span>
                <span className="h-px flex-1 bg-line" />
                <span className="text-muted">{label}</span>
            </div>
            <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">{title}</h2>
        </motion.div>
    );
}
