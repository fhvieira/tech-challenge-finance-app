"use client";

import { Dispatch, SetStateAction, useSyncExternalStore } from "react";
import { Transaction } from "../types";

const transactionsStorageKey = "transactions";
const emptyTransactions: Transaction[] = [];
const listeners = new Set<() => void>();

let cachedRawTransactions: string | null | undefined;
let cachedTransactions: Transaction[] = emptyTransactions;

function readStoredTransactions() {
  if (typeof window === "undefined") {
    return emptyTransactions;
  }

  const stored = localStorage.getItem(transactionsStorageKey);

  if (stored === cachedRawTransactions) {
    return cachedTransactions;
  }

  cachedRawTransactions = stored;

  if (!stored) {
    cachedTransactions = emptyTransactions;
    return cachedTransactions;
  }

  try {
    cachedTransactions = JSON.parse(stored);
  } catch {
    localStorage.removeItem(transactionsStorageKey);
    cachedRawTransactions = null;
    cachedTransactions = emptyTransactions;
  }

  return cachedTransactions;
}

function getServerSnapshot() {
  return emptyTransactions;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === transactionsStorageKey) {
      cachedRawTransactions = undefined;
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function useTransactions() {
  const transactions = useSyncExternalStore(
    subscribe,
    readStoredTransactions,
    getServerSnapshot
  );

  const setTransactions: Dispatch<SetStateAction<Transaction[]>> = (value) => {
    const currentTransactions = readStoredTransactions();
    const nextTransactions =
      typeof value === "function" ? value(currentTransactions) : value;
    const nextRawTransactions = JSON.stringify(nextTransactions);

    cachedTransactions = nextTransactions;
    cachedRawTransactions = nextRawTransactions;
    localStorage.setItem(transactionsStorageKey, nextRawTransactions);
    emitChange();
  };

  return {
    transactions,
    setTransactions,
  };
}
