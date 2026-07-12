declare module "transactionsRemote/TransactionsFeature" {
  import type { ComponentType } from "react";
  import type { Transaction } from "./types";

  export type TransactionsFeatureProps = {
    transactions: Transaction[];
    onDelete: (id: number) => void;
    onUpdate: (transaction: Transaction) => void;
  };

  const TransactionsFeature: ComponentType<TransactionsFeatureProps>;
  export default TransactionsFeature;
}
