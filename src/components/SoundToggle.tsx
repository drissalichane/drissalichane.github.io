"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLang } from "@/i18n";
import { isMuted, setMuted, subscribe } from "@/lib/sfx";

// Speaker button that mutes the game sounds; the choice is remembered in the browser.
export default function SoundToggle() {
    const { t } = useLang();
    const muted = useSyncExternalStore(subscribe, isMuted, () => false);

    return (
        <button
            type="button"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? t.a11y.soundOn : t.a11y.soundOff}
            className="hit-counter flex h-9 w-9 items-center justify-center border border-line bg-surface/80 text-muted backdrop-blur-sm transition-colors hover:border-primary hover:text-accent"
        >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
    );
}
