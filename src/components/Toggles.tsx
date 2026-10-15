"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/i18n";

type Theme = "dark" | "light";

// The inline script in layout.tsx sets data-theme on <html> before paint; that attribute is the source of truth.
const themeListeners = new Set<() => void>();

function subscribeTheme(listener: () => void) {
    themeListeners.add(listener);
    return () => themeListeners.delete(listener);
}

const readTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function ThemeToggle() {
    const { t } = useLang();
    const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "dark" as Theme);

    const toggle = () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try {
            localStorage.setItem("theme", next);
        } catch {}
        themeListeners.forEach((listener) => listener());
    };

    return (
        <button
            onClick={toggle}
            aria-label={theme === "dark" ? t.a11y.toLight : t.a11y.toDark}
            className="flex h-9 w-9 items-center justify-center border border-line text-muted transition-colors hover:border-primary hover:text-accent"
        >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
}

export function LanguageToggle({ className }: { className?: string }) {
    const { lang, setLang, t } = useLang();
    return (
        <div role="group" aria-label={t.a11y.language} className={cn("flex font-mono text-xs uppercase tracking-[0.15em]", className)}>
            {(["fr", "en"] as const).map((code, i) => (
                <span key={code} className="flex items-center">
                    {i > 0 && <span className="px-1.5 text-line">/</span>}
                    <button
                        onClick={() => setLang(code)}
                        aria-pressed={lang === code}
                        className={cn("transition-colors", lang === code ? "text-accent" : "text-muted hover:text-ink")}
                    >
                        {code}
                    </button>
                </span>
            ))}
        </div>
    );
}
