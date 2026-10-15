"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/SectionHeading";
import { useLang } from "@/i18n";

type Entry = ReturnType<typeof useLang>["data"]["experience"][number];

// Each entry types itself out like an old game's dialogue box when it scrolls into view:
// the title slowly, the details fast. Speeds are characters per second; pauses are in ms.
const TITLE = { cps: 30, pause: 180 };
const BODY = { cps: 240, pause: 70 };

type Segment = { text: string; cps: number; pause: number };

function useTypewriter(segments: Segment[], active: boolean, skipped: boolean) {
    const reduceMotion = useReducedMotion();
    // Start time of each segment: the previous one's start, typing time and pause.
    const plan = useMemo(
        () =>
            segments.reduce<number[]>((starts, s, i) => {
                if (i > 0) {
                    const prev = segments[i - 1];
                    starts.push(starts[i - 1] + (prev.text.length / prev.cps) * 1000 + prev.pause);
                }
                return starts;
            }, [0]),
        [segments]
    );
    const last = segments[segments.length - 1];
    const total = plan[plan.length - 1] + (last.text.length / last.cps) * 1000;

    const [elapsed, setElapsed] = useState(0);
    const instant = !!reduceMotion || skipped;

    useEffect(() => {
        if (!active || instant) return;
        let frame = 0;
        const t0 = performance.now();
        const tick = (now: number) => {
            const e = now - t0;
            setElapsed(e);
            if (e < total) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [active, instant, total]);

    const done = instant || elapsed >= total;
    const shown = segments.map((s, i) =>
        done ? s.text.length : Math.max(0, Math.min(s.text.length, Math.floor(((elapsed - plan[i]) * s.cps) / 1000)))
    );
    // The caret sits in the latest segment that has started, including the pause after it.
    let caret = -1;
    if (active && !done) plan.forEach((start, i) => elapsed >= start && (caret = i));
    return { shown, caret, done };
}

// The full text keeps its place from the start (untyped part invisible), so the layout never shifts;
// screen readers get the whole text at once.
function Typed({ text, shown, caret }: { text: string; shown: number; caret: boolean }) {
    return (
        <>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {text.slice(0, shown)}
                {caret && (
                    <span className="relative">
                        <span className="type-caret absolute left-0.5 top-[0.15em] h-[1.05em] w-[0.5em] bg-accent" />
                    </span>
                )}
                <span className="invisible">{text.slice(shown)}</span>
            </span>
        </>
    );
}

function ExperienceEntry({ exp, first }: { exp: Entry; first: boolean }) {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    const [skipped, setSkipped] = useState(false);

    const segments = useMemo<Segment[]>(
        () => [
            { text: exp.role, ...TITLE },
            { text: exp.company, ...TITLE },
            ...(exp.description ? [{ text: exp.description, ...BODY }] : []),
            ...exp.tasks.map((task) => ({ text: task, ...BODY })),
            { text: exp.technologies.join("  /  "), ...BODY },
        ],
        [exp]
    );
    const { shown, caret, done } = useTypewriter(segments, inView, skipped);
    const at = (i: number) => ({ shown: shown[i], caret: caret === i });

    const descIndex = exp.description ? 2 : -1;
    const firstTask = exp.description ? 3 : 2;
    const techIndex = segments.length - 1;

    return (
        <article
            ref={ref}
            onClick={() => !done && setSkipped(true)}
            className={cn("grid gap-4 md:grid-cols-[220px_1fr] md:gap-12", !done && "cursor-pointer")}
        >
            <div
                className={cn(
                    "font-mono text-xs uppercase tracking-[0.15em] text-muted transition-opacity duration-500 md:pt-1.5 md:text-right",
                    inView ? "opacity-100" : "opacity-0"
                )}
            >
                {exp.period.split(" - ").map((part) => (
                    <p key={part} className="text-accent">{part}</p>
                ))}
                <p className="mt-2">{exp.location}</p>
            </div>

            <div className="relative border-l border-line pb-16 pl-8">
                <span
                    className={cn(
                        "absolute -left-[5px] top-2 h-2.5 w-2.5",
                        first ? "bg-primary shadow-[0_0_0_4px_rgba(47,124,246,0.2)]" : "border border-accent bg-background"
                    )}
                />
                <h3 className="font-display text-2xl font-semibold text-ink">
                    <Typed text={exp.role} {...at(0)} />
                </h3>
                <p className="mt-1 font-medium text-accent">
                    <Typed text={exp.company} {...at(1)} />
                </p>

                {exp.description && (
                    <p className="mt-4 max-w-3xl leading-relaxed text-muted">
                        <Typed text={exp.description} {...at(descIndex)} />
                    </p>
                )}

                <ul className="mt-5 max-w-3xl space-y-2.5">
                    {exp.tasks.map((task, i) => (
                        <li key={task} className="flex gap-3 text-sm leading-relaxed text-ink/85">
                            <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 bg-primary", shown[firstTask + i] === 0 && "invisible")} />
                            <span>
                                <Typed text={task} {...at(firstTask + i)} />
                            </span>
                        </li>
                    ))}
                </ul>

                <p className="mt-6 font-mono text-xs leading-6 text-muted">
                    <Typed text={segments[techIndex].text} {...at(techIndex)} />
                </p>
            </div>
        </article>
    );
}

export default function Experience() {
    const { data, t } = useLang();

    return (
        <section id="experience" className="relative border-t border-line py-28">
            <div className="container mx-auto px-6">
                <SectionHeading index="01" label={t.experience.label} title={t.experience.title} />

                <div>
                    {data.experience.map((exp, index) => (
                        <ExperienceEntry key={exp.company} exp={exp} first={index === 0} />
                    ))}
                </div>
            </div>
        </section>
    );
}
