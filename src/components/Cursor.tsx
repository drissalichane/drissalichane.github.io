"use client";

import { useEffect, useRef } from "react";

// Crosshair cursor with a choppy ghost trail and corner brackets that lock onto links and buttons.
// Everything moves through refs in one animation loop, so React never re-renders while the mouse moves.

// Short on purpose: a longer, slower trail feels disorienting.
const GHOSTS = 2;
const GHOST_FPS = 20; // the trail samples the mouse this often, so it jumps in steps like a low-fps capture
const GHOST_OPACITY = [0.45, 0.2];
const IDLE_HALF = 13; // half the size of the bracket box around the crosshair when nothing is targeted
const LOCK_PAD = 6; // gap between a locked element and its brackets
const TICK = 8; // size of one corner tick, matches .cursor-tick in globals.css

const LOCKABLE = 'a, button, [role="button"], select, summary, label, [data-cursor-lock]';
// Fields where the custom cursor steps aside and the system text caret shows instead.
const TEXT_FIELD =
    'input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"], [type="range"], [type="color"]), textarea, [contenteditable="true"]';

const DIRS = ["n", "s", "w", "e"] as const;
const CORNERS = ["tl", "tr", "bl", "br"] as const;

function Arms() {
    return (
        <>
            {DIRS.map((d) => (
                <span key={d} className="cursor-arm" data-dir={d} />
            ))}
        </>
    );
}

export default function Cursor() {
    const layerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const layer = layerRef.current;
        // Touch screens and pens without hover keep their normal behaviour.
        if (!layer || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const cross = layer.querySelector<HTMLElement>(".cursor-cross")!;
        const ghosts = Array.from(layer.querySelectorAll<HTMLElement>(".cursor-ghost"));
        const ticks = Array.from(layer.querySelectorAll<HTMLElement>(".cursor-tick"));
        const root = document.documentElement;
        root.classList.add("custom-cursor");

        let x = 0;
        let y = 0;
        let seen = false; // stay hidden until the first move, so nothing sits at the top-left corner
        let target: Element | null = null;
        let samples: { x: number; y: number }[] = [];
        let lastSample = 0;
        const box = { x1: 0, y1: 0, x2: 0, y2: 0 };
        let boxReady = false;
        let last = performance.now();
        let raf = 0;

        const aim = (el: Element | null) => {
            const inText = !!el?.closest(TEXT_FIELD);
            target = inText ? null : (el?.closest(LOCKABLE) ?? null);
            layer.toggleAttribute("data-hidden", inText);
            layer.toggleAttribute("data-locked", !!target);
        };

        const onMove = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            x = e.clientX;
            y = e.clientY;
            if (!seen) {
                seen = true;
                samples = Array.from({ length: GHOSTS }, () => ({ x, y }));
            }
            aim(e.target as Element);
        };
        // Scrolling changes what is under a still mouse.
        const onScroll = () => seen && aim(document.elementFromPoint(x, y));
        const onLeave = () => layer.setAttribute("data-hidden", "");
        const onDown = () => layer.setAttribute("data-firing", "");
        const onUp = () => layer.removeAttribute("data-firing");

        const frame = (now: number) => {
            const dt = Math.min(now - last, 100);
            last = now;

            cross.style.transform = `translate3d(${x}px, ${y}px, 0)`;

            if (!reduced) {
                if (now - lastSample >= 1000 / GHOST_FPS) {
                    lastSample = now;
                    samples.unshift({ x, y });
                    samples.length = GHOSTS;
                }
                // No trail while aiming at a practice target.
                const aiming = !!target?.isConnected && target.hasAttribute("data-cursor-target");
                ghosts.forEach((g, i) => {
                    const s = samples[i];
                    // A ghost sitting on the crosshair would only thicken it, so it vanishes once caught up.
                    const away = s && Math.abs(s.x - x) + Math.abs(s.y - y) > 2;
                    g.style.opacity = away && !aiming ? String(GHOST_OPACITY[i]) : "0";
                    if (s) g.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
                });
            }

            let x1 = x - IDLE_HALF;
            let y1 = y - IDLE_HALF;
            let x2 = x + IDLE_HALF;
            let y2 = y + IDLE_HALF;
            if (target?.isConnected) {
                const r = target.getBoundingClientRect();
                x1 = r.left - LOCK_PAD;
                y1 = r.top - LOCK_PAD;
                x2 = r.right + LOCK_PAD;
                y2 = r.bottom + LOCK_PAD;
            }
            // Brackets ease toward their goal, which gives the snap-on and a slight drag while idle.
            const k = reduced || !boxReady ? 1 : 1 - Math.exp(-dt / 45);
            box.x1 += (x1 - box.x1) * k;
            box.y1 += (y1 - box.y1) * k;
            box.x2 += (x2 - box.x2) * k;
            box.y2 += (y2 - box.y2) * k;
            boxReady = seen;

            const spots = [
                [box.x1, box.y1],
                [box.x2 - TICK, box.y1],
                [box.x1, box.y2 - TICK],
                [box.x2 - TICK, box.y2 - TICK],
            ];
            ticks.forEach((t, i) => {
                t.style.transform = `translate3d(${spots[i][0]}px, ${spots[i][1]}px, 0)`;
            });

            raf = requestAnimationFrame(frame);
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onDown);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("blur", onUp);
        window.addEventListener("scroll", onScroll, { passive: true });
        root.addEventListener("mouseleave", onLeave);
        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("blur", onUp);
            window.removeEventListener("scroll", onScroll);
            root.removeEventListener("mouseleave", onLeave);
            root.classList.remove("custom-cursor");
        };
    }, []);

    return (
        <div ref={layerRef} className="cursor-layer" data-hidden="" aria-hidden="true">
            {Array.from({ length: GHOSTS }, (_, i) => (
                <div key={i} className="cursor-ghost">
                    <Arms />
                    {CORNERS.map((c) => (
                        <span key={c} className="cursor-ghost-tick" data-corner={c} />
                    ))}
                </div>
            ))}
            {CORNERS.map((c) => (
                <span key={c} className="cursor-tick" data-corner={c} />
            ))}
            <div className="cursor-cross">
                <Arms />
                <span className="cursor-dot" />
            </div>
        </div>
    );
}
