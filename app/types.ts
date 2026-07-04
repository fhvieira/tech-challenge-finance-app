export type Transaction = {
  id: number;
  type: string;
  description?: string;
  category?: string;
  receipt?: {
    name: string;
    type: string;
    size: number;
    dataUrl: string;
  };
  amount: number;
  date: string;
};
