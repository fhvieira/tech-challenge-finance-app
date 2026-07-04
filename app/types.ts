export type Transaction = {
  id: number;
  type: string;
  description?: string;
  category?: string;
  amount: number;
  date: string;
};
