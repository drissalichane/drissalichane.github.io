"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export default function TapCounter() {
    const [count, setCount] = useState<number | null>(null);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        // Listen to real-time updates
        const docRef = doc(db, "counters", "portfolio-taps");

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setCount(docSnap.data().count);
            } else {
                // Initialize if not exists
                setDoc(docRef, { count: 0 });
                setCount(0);
            }
        });

        // Check if user already liked in this session
        const hasLiked = localStorage.getItem("portfolio-liked");
        if (hasLiked) setLiked(true);

        return () => unsubscribe();
    }, []);

    const handleTap = async () => {
        if (liked) return;

        // Optimistic update
        setLiked(true);
        localStorage.setItem("portfolio-liked", "true");

        const docRef = doc(db, "counters", "portfolio-taps");
        await updateDoc(docRef, {
            count: increment(1)
        });
    };

    if (count === null) return null; // Loading state

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleTap}
                disabled={liked}
                className={`relative flex items-center justify-center p-4 rounded-full shadow-2xl transition-all duration-300 ${liked
                        ? "bg-red-500/20 border border-red-500/50 cursor-default"
                        : "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 cursor-pointer"
                    }`}
            >
                <div className="relative">
                    <Heart
                        size={24}
                        className={`transition-colors duration-300 ${liked ? "fill-red-500 text-red-500" : "text-white"}`}
                    />

                    <AnimatePresence>
                        {liked && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 bg-red-500 rounded-full"
                            />
                        )}
                    </AnimatePresence>
                </div>

                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center border border-red-400">
                    {count}
                </div>
            </motion.button>
        </div>
    );
}
