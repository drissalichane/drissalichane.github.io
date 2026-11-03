"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { play } from "@/lib/sfx";

// Practice targets floating in the hero's empty space. They spawn only where they don't cover
// anything marked data-target-avoid, bob in place, and break apart when shot.

export const HIT_EVENT = "target-hit";

// Never more than 4 on screen: 2 big ones and 2 smaller ones. A shot target is replaced by one of the same size.
const SIZES = [40, 26];
const PER_SIZE = 2;
const COUNT = SIZES.length * PER_SIZE;
const CLEARANCE = 16; // min gap to content, also covers the bobbing
const TOP_CLEAR = 96; // keeps targets out from under the fixed header
const REFILL_MS = 1500;
const SHARD_ANGLES = [0, 60, 120, 180, 240, 300];

type Target = { id: number; x: number; y: number; size: number; phase: number };
type Hit = { id: number; x: number; y: number };

let nextId = 1;

// Random free spot inside the section, or null when the layout leaves no room.
function findSpot(section: HTMLElement, taken: Target[], size: number) {
    const box = section.getBoundingClientRect();
    const avoid = Array.from(section.querySelectorAll("[data-target-avoid]"), (el) => {
        const r = el.getBoundingClientRect();
        return {
            left: r.left - box.left - CLEARANCE,
            top: r.top - box.top - CLEARANCE,
            right: r.right - box.left + CLEARANCE,
            bottom: r.bottom - box.top + CLEARANCE,
        };
    });
    for (let i = 0; i < 40; i++) {
        const x = 16 + Math.random() * (box.width - size - 32);
        const y = TOP_CLEAR + Math.random() * (box.height - size - TOP_CLEAR - 16);
        const coversContent = avoid.some((a) => x < a.right && x + size > a.left && y < a.bottom && y + size > a.top);
        const crowded = taken.some((t) => Math.hypot(t.x - x, t.y - y) < SIZES[0] * 2.5);
        if (!coversContent && !crowded) return { x, y };
    }
    return null;
}

function HitBurst({ x, y }: { x: number; y: number }) {
    return (
        <div className="absolute" style={{ left: x, top: y }}>
            <span className="hit-marker">
                <i />
                <i />
                <i />
                <i />
            </span>
            {SHARD_ANGLES.map((a) => (
                <span
                    key={a}
                    className="hit-shard"
                    style={
                        {
                            "--dx": `${Math.cos((a * Math.PI) / 180) * 36}px`,
                            "--dy": `${Math.sin((a * Math.PI) / 180) * 36}px`,
                        } as React.CSSProperties
                    }
                />
            ))}
            <span className="hit-plus">+1</span>
        </div>
    );
}

export default function HeroTargets() {
    const layerRef = useRef<HTMLDivElement>(null);
    const [targets, setTargets] = useState<Target[]>([]);
    const [hits, setHits] = useState<Hit[]>([]);

    const spawn = useCallback(() => {
        const section = layerRef.current?.parentElement;
        if (!section) return;
        setTargets((prev) => {
            const open = SIZES.filter((s) => prev.filter((t) => t.size === s).length < PER_SIZE);
            if (!open.length) return prev;
            const size = open[Math.floor(Math.random() * open.length)];
            const spot = findSpot(section, prev, size);
            return spot ? [...prev, { id: nextId++, ...spot, size, phase: -Math.random() * 4 }] : prev;
        });
    }, []);

    useEffect(() => {
        // Wait for the hero intro animation, then bring the targets in one after another.
        const timers = Array.from({ length: COUNT }, (_, i) => setTimeout(spawn, 900 + i * 250));
        // Refills after hits, and retries when there was no room.
        const refill = setInterval(spawn, REFILL_MS);
        let resizeTimer: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => setTargets([]), 200);
        };
        window.addEventListener("resize", onResize);
        return () => {
            timers.forEach(clearTimeout);
            clearInterval(refill);
            clearTimeout(resizeTimer);
            window.removeEventListener("resize", onResize);
        };
    }, [spawn]);

    const shoot = (target: Target) => (e: React.PointerEvent) => {
        if (e.button !== 0) return;
        play("targetHit");
        setTargets((prev) => prev.filter((t) => t.id !== target.id));
        const id = nextId++;
        setHits((prev) => [...prev, { id, x: target.x + target.size / 2, y: target.y + target.size / 2 }]);
        setTimeout(() => setHits((prev) => prev.filter((h) => h.id !== id)), 700);
        window.dispatchEvent(new Event(HIT_EVENT));
    };

    return (
        <div ref={layerRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
            {targets.map((t) => (
                <button
                    key={t.id}
                    type="button"
                    tabIndex={-1}
                    data-cursor-target=""
                    onPointerDown={shoot(t)}
                    className="hero-target pointer-events-auto absolute"
                    style={{ left: t.x, top: t.y, width: t.size, height: t.size, "--phase": `${t.phase}s` } as React.CSSProperties}
                >
                    <svg viewBox="0 0 40 40" className="h-full w-full">
                        <circle cx="20" cy="20" r="18" className="fill-surface/70 stroke-primary" strokeWidth="1.5" />
                        <circle cx="20" cy="20" r="11.5" className="fill-none stroke-accent" strokeWidth="1.5" />
                        <circle cx="20" cy="20" r="4.5" className="fill-primary" />
                        <path d="M20 0v5M20 35v5M0 20h5M35 20h5" className="stroke-primary" strokeWidth="1.5" />
                    </svg>
                </button>
            ))}
            {hits.map((h) => (
                <HitBurst key={h.id} x={h.x} y={h.y} />
            ))}
        </div>
    );
}
