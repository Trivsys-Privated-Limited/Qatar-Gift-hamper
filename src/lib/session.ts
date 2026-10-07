"use client";

import { useSyncExternalStore } from "react";

/**
 * Demo sign-in. The "account" is the customer's WhatsApp number, kept in this browser.
 * In the live version this would be a real login confirmed with a WhatsApp code.
 */
export type Session = { name: string; phone: string };

const STORAGE_KEY = "qsh:session:v1";

let state: Session | null | undefined;
const listeners = new Set<() => void>();

function read(): Session | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function write(next: Session | null) {
  state = next;
  try {
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Blocked storage: the session lasts until the page is closed.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      state = read();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Session | null {
  if (state === undefined) state = read();
  return state;
}

/**
 * `undefined` while loading on the server and during hydration,
 * then `null` when signed out, or the session.
 */
export function useSession(): Session | null | undefined {
  return useSyncExternalStore(subscribe, getSnapshot, () => undefined);
}

export function signIn(session: Session) {
  write(session);
}

export function signOut() {
  write(null);
}
