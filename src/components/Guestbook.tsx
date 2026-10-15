"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useLang } from "@/i18n";

type Comment = {
    id: string;
    name: string;
    message: string;
    createdAt: Timestamp;
};

export default function Guestbook() {
    const { t } = useLang();
    const [comments, setComments] = useState<Comment[]>([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    // Set when Firestore refuses the read (e.g. security rules); the section then says so instead of staying empty.
    const [unavailable, setUnavailable] = useState(false);
    const [sendError, setSendError] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const commentsData: Comment[] = [];
                querySnapshot.forEach((doc) => {
                    commentsData.push({ id: doc.id, ...doc.data() } as Comment);
                });
                setComments(commentsData);
                setUnavailable(false);
            },
            (error) => {
                console.warn("Guestbook unavailable:", error.code);
                setUnavailable(true);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        setLoading(true);
        setSendError(false);
        try {
            await addDoc(collection(db, "guestbook"), {
                name: name.trim(),
                message: message.trim(),
                createdAt: serverTimestamp(),
            });
            setName("");
            setMessage("");
        } catch (error) {
            console.warn("Guestbook write refused:", error);
            setSendError(true);
        } finally {
            setLoading(false);
        }
    };

    const field =
        "w-full border border-line bg-background px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none";

    return (
        <section id="guestbook" className="relative border-t border-line py-28">
            <div className="container mx-auto px-6">
                <SectionHeading index="05" label={t.guestbook.label} title={t.guestbook.title} />

                <div className="grid gap-12 lg:grid-cols-12">
                    <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-5">
                        <div>
                            <label htmlFor="name" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                                {t.guestbook.name}
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={field}
                                placeholder={t.guestbook.namePlaceholder}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                                {t.guestbook.message}
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
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

                    <div className="max-h-[440px] overflow-y-auto border-t border-line lg:col-span-7">
                        <AnimatePresence>
                            {comments.map((comment) => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="border-b border-line py-5"
                                >
                                    <div className="mb-2 flex items-baseline justify-between gap-4">
                                        <span className="font-medium text-ink">{comment.name}</span>
                                        <span className="font-mono text-[11px] text-muted">
                                            {comment.createdAt?.seconds
                                                ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString(t.guestbook.dateLocale)
                                                : t.guestbook.justNow}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-muted">{comment.message}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {unavailable ? (
                            <p className="py-10 font-mono text-sm text-muted">{t.guestbook.unavailable}</p>
                        ) : (
                            comments.length === 0 && (
                                <p className="py-10 font-mono text-sm text-muted">{t.guestbook.empty}</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
