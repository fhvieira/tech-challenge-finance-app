"use client";

import { ComponentType, useEffect, useState } from "react";
import { Transaction } from "../../types";
import LocalTransactionsFeature from "./TransactionsFeature";

type TransactionsFeatureProps = {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onUpdate: (transaction: Transaction) => void;
};

type RemoteFeatureState = {
  Component: ComponentType<TransactionsFeatureProps>;
  isFallback: boolean;
};

export default function RemoteTransactionsFeature(props: TransactionsFeatureProps) {
  const [featureState, setFeatureState] = useState<RemoteFeatureState | null>(
    null
  );

  useEffect(() => {
    let isMounted = true;

    import("transactionsRemote/TransactionsFeature")
      .then((module) => {
        if (isMounted) {
          setFeatureState({
            Component: module.default,
            isFallback: false,
          });
        }
      })
      .catch(() => {
        if (isMounted) {
          setFeatureState({
            Component: LocalTransactionsFeature,
            isFallback: true,
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!featureState) {
    return (
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Carregando transações...</p>
      </section>
    );
  }

  const { Component, isFallback } = featureState;

  return (
    <>
      {isFallback && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Remote indisponível. Usando módulo local de transações.
        </section>
      )}
      <Component {...props} />
    </>
  );
}
