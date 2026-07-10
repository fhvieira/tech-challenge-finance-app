"use client";

import { ComponentType, useEffect, useState } from "react";
import { Transaction } from "../../types";
import LocalTransactionsFeature from "./TransactionsFeature";

type TransactionsFeatureProps = {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onUpdate: (transaction: Transaction) => void;
};

export default function RemoteTransactionsFeature(props: TransactionsFeatureProps) {
  const [Feature, setFeature] =
    useState<ComponentType<TransactionsFeatureProps> | null>(null);

  useEffect(() => {
    let isMounted = true;

    import("transactionsRemote/TransactionsFeature")
      .then((module) => {
        if (isMounted) {
          setFeature(() => module.default);
        }
      })
      .catch(() => {
        if (isMounted) {
          setFeature(() => LocalTransactionsFeature);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!Feature) {
    return (
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Carregando transações...</p>
      </section>
    );
  }

  return <Feature {...props} />;
}
