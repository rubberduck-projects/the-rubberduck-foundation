"use client";

import { useSyncExternalStore } from "react";

const EVENT = "ducktrail-progress";
const empty: string[] = [];
const cache = new Map<string, { raw: string | null; value: string[] }>();
const keyFor = (trail: string) => `ducktrail:${trail}:done`;

// Storage can be disabled or hand edited, so every read tolerates junk.
function read(trail: string): string[] {
    let raw: string | null = null;
    try {
        raw = localStorage.getItem(keyFor(trail));
    } catch {}
    const cached = cache.get(trail);
    if (cached && cached.raw === raw) return cached.value;
    let value = empty;
    try {
        const parsed: unknown = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) value = parsed.filter((s): s is string => typeof s === "string");
    } catch {}
    cache.set(trail, { raw, value });
    return value;
}

function write(trail: string, slugs: string[]) {
    try {
        if (slugs.length) localStorage.setItem(keyFor(trail), JSON.stringify(slugs));
        else localStorage.removeItem(keyFor(trail));
    } catch {}
    window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
    window.addEventListener("storage", onChange);
    window.addEventListener(EVENT, onChange);
    return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(EVENT, onChange);
    };
}

export function useDone(trail: string) {
    return useSyncExternalStore(subscribe, () => read(trail), () => empty);
}

export function setDone(trail: string, slug: string, done: boolean) {
    const rest = read(trail).filter((s) => s !== slug);
    write(trail, done ? [...rest, slug] : rest);
}

export const clearProgress = (trail: string) => write(trail, []);
