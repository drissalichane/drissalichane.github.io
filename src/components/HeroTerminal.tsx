"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useLang } from "@/i18n";

type Scene = { cmd: string; out: string[] };

// Tool output stays in English whatever the site language, as the real tools print it.
const STACKS: Scene[] = [
    { cmd: "mvn spring-boot:run", out: ["Started Application in 2.1 seconds"] },
    { cmd: "php artisan test", out: ["Tests: 24 passed"] },
    { cmd: "npm run build", out: ["✓ Compiled successfully"] },
    { cmd: "python train.py --model lstm", out: ["RUL model saved"] },
    { cmd: "dotnet build", out: ["0 Warning(s), 0 Error(s)", "Build succeeded."] },
];

const TYPE_MS = 55;
const OUTPUT_DELAY_MS = 350;
const LINE_MS = 220;
const HOLD_INTRO_MS = 3500;
const HOLD_MS = 2600;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Hero terminal: cycles `whoami`, then one command per stack, forever.
export default function HeroTerminal() {
    const { t } = useLang();
    const reduceMotion = useReducedMotion();
    const intro = useMemo<Scene>(() => ({ cmd: "whoami", out: [t.hero.whoami, t.hero.statusValue.toLowerCase()] }), [t]);
    const [view, setView] = useState<{ cmd: string; out: string[] }>({ cmd: "", out: [] });

    useEffect(() => {
        if (reduceMotion) return;
        let cancelled = false;
        (async () => {
            for (let i = 0; !cancelled; i++) {
                const step = i % (STACKS.length + 1);
                const scene = step === 0 ? intro : STACKS[step - 1];
                for (let c = 0; c <= scene.cmd.length && !cancelled; c++) {
                    setView({ cmd: scene.cmd.slice(0, c), out: [] });
                    await wait(TYPE_MS);
                }
                await wait(OUTPUT_DELAY_MS);
                for (let l = 1; l <= scene.out.length && !cancelled; l++) {
                    setView({ cmd: scene.cmd, out: scene.out.slice(0, l) });
                    await wait(LINE_MS);
                }
                await wait(step === 0 ? HOLD_INTRO_MS : HOLD_MS);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [reduceMotion, intro]);

    const shown = reduceMotion ? intro : view;
    const caret = <span className="type-caret ml-1 inline-block h-3.5 w-2 translate-y-0.5 bg-accent" />;

    return (
        <div className="border-t border-line bg-background/60 px-5 py-4 font-mono text-xs leading-6" aria-label={`whoami: ${intro.out.join(", ")}`}>
            {/* Fixed at three lines (command + two output lines) so the hero never changes height. */}
            <div className="h-[4.5rem]" aria-hidden="true">
                <p className="text-muted">
                    <span className="text-accent">$</span> {shown.cmd}
                    {shown.out.length === 0 && caret}
                </p>
                {shown.out.map((line, i) => (
                    <p key={line} className={i === shown.out.length - 1 ? "pl-4 text-accent" : "pl-4 text-muted"}>
                        {line}
                        {i === shown.out.length - 1 && caret}
                    </p>
                ))}
            </div>
        </div>
    );
}
