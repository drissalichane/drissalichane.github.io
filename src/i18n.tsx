"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { portfolioData } from "@/data/portfolio";
import { portfolioDataEn } from "@/data/portfolio.en";

export type Lang = "fr" | "en";

// Every interface string; the content itself lives in src/data/portfolio(.en).ts.
const ui = {
    fr: {
        nav: { experience: "Expérience", projects: "Projets", skills: "Compétences", education: "Formation", guestbook: "Message", contact: "Contact" },
        a11y: { openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", toLight: "Passer en mode clair", toDark: "Passer en mode sombre", language: "Langue" },
        hero: { cta: "Voir mon parcours", contact: "Me contacter", scroll: "Défiler", role: "Rôle", status: "Statut", statusValue: "Disponible immédiatement", base: "Base", stack: "Stack", whoami: "alichane-driss · full-stack & ia" },
        experience: { label: "Carrière", title: "Expériences professionnelles" },
        projects: { label: "Réalisations", title: "Projets", stack: "Stack", source: "Code source", others: "Autres projets" },
        skills: {
            label: "Expertise", title: "Compétences techniques", soft: "Savoir-être", spoken: "Langues",
            categories: { languages: "Langages", frameworks: "Frameworks", databases: "Bases de données", devops: "DevOps & outils", conception: "Conception", ai_data: "IA & Data" },
        },
        education: { label: "Parcours", title: "Formation", certifications: "Certifications" },
        guestbook: {
            label: "Message", title: "Laissez un message", name: "Nom", namePlaceholder: "Votre nom",
            email: "E-mail (facultatif)", emailPlaceholder: "Pour que je puisse vous répondre", message: "Message",
            messagePlaceholder: "Un retour, une question, une opportunité...", send: "Envoyer", sending: "Envoi...",
            sendError: "Le message n'a pas pu être envoyé. Réessayez plus tard.",
            sentTitle: "Message envoyé, merci.", sentText: "Je le lis personnellement et vous réponds si vous avez laissé un e-mail.",
        },
        contact: { label: "Contact", title: "Discutons de votre projet.", text: "Un projet, une question ou une opportunité ? Écrivez-moi, je réponds rapidement.", phone: "Téléphone" },
    },
    en: {
        nav: { experience: "Experience", projects: "Projects", skills: "Skills", education: "Education", guestbook: "Message", contact: "Contact" },
        a11y: { openMenu: "Open menu", closeMenu: "Close menu", toLight: "Switch to light mode", toDark: "Switch to dark mode", language: "Language" },
        hero: { cta: "See my experience", contact: "Get in touch", scroll: "Scroll", role: "Role", status: "Status", statusValue: "Available immediately", base: "Based in", stack: "Stack", whoami: "alichane-driss · full-stack & ai" },
        experience: { label: "Career", title: "Professional experience" },
        projects: { label: "Work", title: "Projects", stack: "Stack", source: "Source code", others: "Other projects" },
        skills: {
            label: "Expertise", title: "Technical skills", soft: "Soft skills", spoken: "Languages",
            categories: { languages: "Languages", frameworks: "Frameworks", databases: "Databases", devops: "DevOps & tools", conception: "Design", ai_data: "AI & Data" },
        },
        education: { label: "Background", title: "Education", certifications: "Certifications" },
        guestbook: {
            label: "Message", title: "Leave a message", name: "Name", namePlaceholder: "Your name",
            email: "Email (optional)", emailPlaceholder: "So I can reply to you", message: "Message",
            messagePlaceholder: "Feedback, a question, an opportunity...", send: "Send", sending: "Sending...",
            sendError: "Your message could not be sent. Please try again later.",
            sentTitle: "Message sent, thank you.", sentText: "I read every message myself and will reply if you left an email.",
        },
        contact: { label: "Contact", title: "Let's talk about your project.", text: "A project, a question or an opportunity? Write to me, I reply quickly.", phone: "Phone" },
    },
};

type Ctx = {
    lang: Lang;
    setLang: (lang: Lang) => void;
    data: typeof portfolioData;
    t: (typeof ui)["fr"];
};

const LanguageContext = createContext<Ctx | null>(null);

// The chosen language lives in localStorage; the static export is rendered in French (server snapshot)
// and switches to the saved choice on hydration.
const langListeners = new Set<() => void>();

function subscribeLang(listener: () => void) {
    langListeners.add(listener);
    window.addEventListener("storage", listener);
    return () => {
        langListeners.delete(listener);
        window.removeEventListener("storage", listener);
    };
}

function readLang(): Lang {
    try {
        return localStorage.getItem("lang") === "en" ? "en" : "fr";
    } catch {
        return "fr";
    }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const lang = useSyncExternalStore(subscribeLang, readLang, () => "fr" as Lang);

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    const setLang = (next: Lang) => {
        try {
            localStorage.setItem("lang", next);
        } catch {}
        langListeners.forEach((listener) => listener());
    };

    const value: Ctx = { lang, setLang, data: lang === "en" ? portfolioDataEn : portfolioData, t: ui[lang] };
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
    return ctx;
}
