"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { HIT_EVENT } from "@/components/HeroTargets";
import SoundToggle from "@/components/SoundToggle";
import { useLang } from "@/i18n";
import { hasPlayed, subscribe } from "@/lib/sfx";

// Bottom-left HUD: a round hit counter (hidden until the first target is hit, resets on reload)
// and the mute button (shown once a game sound has played).
export default function HitCounter() {
    const { t } = useLang();
    const [hits, setHits] = useState(0);
    const soundUsed = useSyncExternalStore(subscribe, hasPlayed, () => false);

    useEffect(() => {
        const onHit = () => setHits((h) => h + 1);
        window.addEventListener(HIT_EVENT, onHit);
        return () => window.removeEventListener(HIT_EVENT, onHit);
    }, []);

    if (!hits && !soundUsed) return null;

    return (
        <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2">
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
