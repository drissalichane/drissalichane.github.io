"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, User } from "lucide-react";

type Comment = {
    id: string;
    name: string;
    message: string;
    createdAt: Timestamp;
};

export default function Guestbook() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const commentsData: Comment[] = [];
            querySnapshot.forEach((doc) => {
                commentsData.push({ id: doc.id, ...doc.data() } as Comment);
            });
            setComments(commentsData);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        setLoading(true);
        try {
            await addDoc(collection(db, "guestbook"), {
                name: name.trim(),
                message: message.trim(),
                createdAt: serverTimestamp(),
            });
            setName("");
            setMessage("");
        } catch (error) {
            console.error("Error adding document: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="guestbook" className="py-20 relative bg-zinc-900/50">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <MessageSquare className="text-blue-400" size={24} />
                        <h2 className="text-blue-400 font-medium tracking-wide text-sm uppercase">Livre d&apos;or</h2>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Laissez un message
                    </h3>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Nom</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Votre nom"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    placeholder="Un petit mot..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Envoi..." : (
                                    <>
                                        <Send size={18} />
                                        Envoyer
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Comments List */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2"
                    >
                        <AnimatePresence>
                            {comments.map((comment) => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-500/10 rounded-full">
                                            <User size={16} className="text-blue-400" />
                                        </div>
                                        <span className="font-bold text-white">{comment.name}</span>
                                        <span className="text-xs text-gray-500 ml-auto bg-black/30 px-2 py-1 rounded">
                                            {comment.createdAt?.seconds
                                                ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString()
                                                : "À l'instant"}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed pl-11">
                                        {comment.message}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {comments.length === 0 && (
                            <div className="text-center text-gray-500 py-10">
                                Soyez le premier à laisser un message !
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
