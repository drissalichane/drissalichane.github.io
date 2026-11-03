"use client";

import { useEffect, useRef, useState } from "react";
import Corners from "@/components/Corners";
import { play } from "@/lib/sfx";

// Enemy-style HUD tag above the name. Shooting the name (clicking it) knocks off one HP segment;
// at zero a medkit kicks in and refills the bar. The tag itself only shows on hover (group-hover).

const MAX_HP = 10;
const MEDKIT_MS = 600; // how long the medkit shows before the refill starts
const REFILL_STEP_MS = 100; // one segment back per step

type Marker = { id: number; x: number; y: number };

// Restarts a one-shot CSS animation, even when it is still running from the previous shot.
function replay(el: HTMLElement | null, cls: string) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
}

let nextMarker = 1;

export default function NamePlate({
    name,
    tag,
    medkit,
    children,
}: {
    name: string;
    tag: string;
    medkit: string;
    children: React.ReactNode;
}) {
    const [hp, setHp] = useState(MAX_HP);
    const [healing, setHealing] = useState(false);
    const [markers, setMarkers] = useState<Marker[]>([]);
    const nameRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        const pending = timers.current;
        return () => pending.forEach(clearTimeout);
    }, []);

    const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

    const heal = () => {
        setHealing(true);
        later(() => play("medkit"), 150);
        later(() => {
            for (let i = 1; i <= MAX_HP; i++)
                later(() => {
                    setHp(i);
                    play("refill", i);
                }, i * REFILL_STEP_MS);
            later(() => setHealing(false), MAX_HP * REFILL_STEP_MS);
        }, MEDKIT_MS);
    };

    const shoot = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.button !== 0 || healing) return;
        play("nameHit");
        const box = e.currentTarget.getBoundingClientRect();
        const id = nextMarker++;
        setMarkers((m) => [...m, { id, x: e.clientX - box.left, y: e.clientY - box.top }]);
        later(() => setMarkers((m) => m.filter((k) => k.id !== id)), 350);
        replay(nameRef.current, "name-flinch");
        replay(barRef.current, "hp-flash");
        const left = hp - 1;
        setHp(left);
        if (left === 0) heal();
    };

    return (
        <div className="group relative inline-block select-none" data-cursor-lock="" data-target-avoid="" onPointerDown={shoot}>
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-full left-0 mb-4 min-w-full translate-y-1 border border-line bg-surface/90 px-3 py-2 font-mono opacity-0 backdrop-blur-sm transition duration-200 group-hover:translate-y-0 group-hover:opacity-100"
            >
                <Corners />
                <div className="flex items-center gap-2 whitespace-nowrap text-[11px] uppercase tracking-[0.2em]">
                    <span className="h-1.5 w-1.5 bg-primary" />
                    <span className="text-ink">{name}</span>
                    {healing ? (
                        <span className="medkit-in text-emerald-500">{medkit}</span>
                    ) : (
                        <span className="text-muted">· {tag}</span>
                    )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] tracking-[0.2em] text-muted">HP</span>
                    <div ref={barRef} className="flex h-1.5 flex-1 gap-0.5">
                        {Array.from({ length: MAX_HP }, (_, i) => (
                            <span
                                key={i}
                                className={`flex-1 transition-colors duration-150 ${
                                    i < hp ? (healing ? "bg-emerald-500" : "bg-primary") : "bg-line"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div ref={nameRef}>{children}</div>
            {markers.map((m) => (
                <span key={m.id} aria-hidden="true" className="pointer-events-none absolute" style={{ left: m.x, top: m.y }}>
                    <span className="hit-marker">
                        <i />
                        <i />
                        <i />
                        <i />
                    </span>
                </span>
            ))}
        </div>
    );
}
