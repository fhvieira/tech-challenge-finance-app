"use client";

import { useEffect, useState } from "react";
import { Transaction } from "../types";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("transactions");

    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch {
        localStorage.removeItem("transactions");
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions, isLoaded]);

  return {
    transactions,
    setTransactions,
  };
}