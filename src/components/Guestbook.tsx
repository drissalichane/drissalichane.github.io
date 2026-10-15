"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowRight, Check, Lock } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useLang } from "@/i18n";

// Messages are written to Firestore and never read back by the site: only the owner sees them, in the console.
export default function Guestbook() {
    const { t } = useLang();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [sendError, setSendError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        setLoading(true);
        setSendError(false);
        try {
            await addDoc(collection(db, "guestbook"), {
                name: name.trim(),
                email: email.trim(),
                message: message.trim(),
                createdAt: serverTimestamp(),
            });
            setName("");
            setEmail("");
            setMessage("");
            setSent(true);
        } catch (error) {
            console.warn("Message refused:", error);
            setSendError(true);
        } finally {
            setLoading(false);
        }
    };

    const field =
        "w-full border border-line bg-background px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none";
    const label = "mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-muted";

    return (
        <section id="guestbook" className="relative border-t border-line py-28">
            <div className="container mx-auto px-6">
                <SectionHeading index="05" label={t.guestbook.label} title={t.guestbook.title} />

                <div className="grid gap-12 lg:grid-cols-12">
                    <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-7">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className={label}>
                                    {t.guestbook.name}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={60}
                                    className={field}
                                    placeholder={t.guestbook.namePlaceholder}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className={label}>
                                    {t.guestbook.email}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    maxLength={120}
                                    className={field}
                                    placeholder={t.guestbook.emailPlaceholder}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="message" className={label}>
                                {t.guestbook.message}
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    setSent(false);
                                }}
                                rows={5}
                                maxLength={500}
                                className={`${field} resize-none`}
                                placeholder={t.guestbook.messagePlaceholder}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? t.guestbook.sending : t.guestbook.send}
                            {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
                        </button>
                        {sendError && <p className="font-mono text-xs text-accent">{t.guestbook.sendError}</p>}
                    </form>

                    <div className="border-t border-line pt-8 lg:col-span-5">
                        {sent ? (
                            <div className="flex gap-4">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-primary text-accent">
                                    <Check size={16} />
                                </span>
                                <div>
                                    <p className="font-medium text-ink">{t.guestbook.sentTitle}</p>
                                    <p className="mt-2 text-sm leading-relaxed text-muted">{t.guestbook.sentText}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-line text-muted">
                                    <Lock size={16} />
                                </span>
                                <p className="text-sm leading-relaxed text-muted">{t.guestbook.privateNote}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
