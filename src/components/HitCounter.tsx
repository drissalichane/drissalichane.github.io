"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { HIT_EVENT } from "@/components/HeroTargets";
import SoundToggle from "@/components/SoundToggle";
import { useLang } from "@/i18n";
import { hasPlayed, subscribe } from "@/lib/sfx";

// Bottom-right HUD: a round hit counter (hidden until the first target is hit, resets on reload)
// and the mute button (shown once a game sound has played). Both fade out once the visitor has
// scrolled past the hero, where the game is, and come back when they return.
export default function HitCounter() {
    const { t } = useLang();
    const [hits, setHits] = useState(0);
    const [inHero, setInHero] = useState(true);
    const soundUsed = useSyncExternalStore(subscribe, hasPlayed, () => false);

    useEffect(() => {
        const onHit = () => setHits((h) => h + 1);
        window.addEventListener(HIT_EVENT, onHit);
        return () => window.removeEventListener(HIT_EVENT, onHit);
    }, []);

    useEffect(() => {
        const hero = document.getElementById("hero");
        if (!hero) return;
        // "In the hero" while it still fills at least half of the screen.
        const check = () => setInHero(hero.getBoundingClientRect().bottom > window.innerHeight / 2);
        check();
        window.addEventListener("scroll", check, { passive: true });
        window.addEventListener("resize", check);
        return () => {
            window.removeEventListener("scroll", check);
            window.removeEventListener("resize", check);
        };
    }, []);

    if (!hits && !soundUsed) return null;

    return (
        <div
            inert={!inHero}
            className={`fixed bottom-4 right-4 z-40 flex items-center gap-2 transition duration-300 ${
                inHero ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
            }`}
        >
            {hits > 0 && (
                <div className="hit-counter flex h-14 w-14 flex-col items-center justify-center rounded-full border border-primary/60 bg-surface/80 font-mono backdrop-blur-sm">
                    <span key={hits} className="hit-count text-base leading-none text-ink">
                        {hits}
                    </span>
                    <span className="mt-1 text-[8px] uppercase leading-none tracking-[0.15em] text-muted">{t.hero.hits}</span>
                </div>
            )}
            {soundUsed && <SoundToggle />}
        </div>
    );
}
