"use client";

import { useEffect, useState } from "react";
import { Transaction } from "../types";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const stored = localStorage.getItem("transactions");

    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        localStorage.removeItem("transactions");
      }
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  return {
    transactions,
    setTransactions,
  };
}
