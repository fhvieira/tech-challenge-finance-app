"use client";

import { useMemo } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Transaction } from "../../types";

const incomeTypes = new Set(["Depósito"]);

function isIncome(transaction: Transaction) {
  return incomeTypes.has(transaction.type);
}

function buildLinePath(points: number[], width: number, height: number) {
  if (points.length === 0) return "";

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = points.length > 1 ? width / (points.length - 1) : width;

  return points
    .map((point, index) => {
      const x = points.length > 1 ? index * step : width / 2;
      const y = height - ((point - min) / range) * height;

      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

type DashboardChartsProps = {
  transactions: Transaction[];
};

export default function DashboardCharts({ transactions }: DashboardChartsProps) {
  const analytics = useMemo(() => {
    const income = transactions
      .filter(isIncome)
      .reduce((total, transaction) => total + transaction.amount, 0);
    const expense = transactions
      .filter((transaction) => !isIncome(transaction))
      .reduce((total, transaction) => total + transaction.amount, 0);
    const totalMovement = income + expense || 1;

    const spendingByCategory = transactions
      .filter((transaction) => !isIncome(transaction))
      .reduce((categories, transaction) => {
        const category = transaction.category?.trim() || "Sem categoria";
        categories[category] = (categories[category] ?? 0) + transaction.amount;

        return categories;
      }, {} as Record<string, number>);

    const categoryRows = Object.entries(spendingByCategory)
      .sort(([, firstAmount], [, secondAmount]) => secondAmount - firstAmount)
      .slice(0, 5);
    const biggestCategoryAmount = Math.max(
      1,
      ...categoryRows.map(([, amount]) => amount)
    );

    const balancePoints = [...transactions]
      .sort((first, second) => {
        const dateOrder = first.date.localeCompare(second.date);
        return dateOrder === 0 ? first.id - second.id : dateOrder;
      })
      .reduce(
        (result, transaction) => {
          const nextBalance =
            result.runningBalance +
            (isIncome(transaction)
              ? transaction.amount
              : -transaction.amount);

          return {
            runningBalance: nextBalance,
            points: [
              ...result.points,
              {
                id: transaction.id,
                date: transaction.date,
                balance: nextBalance,
              },
            ],
          };
        },
        {
          runningBalance: 0,
          points: [] as Array<{
            id: number;
            date: string;
            balance: number;
          }>,
        }
      )
      .points
      .slice(-6);

    return {
      income,
      expense,
      incomePercent: (income / totalMovement) * 100,
      expensePercent: (expense / totalMovement) * 100,
      categoryRows,
      biggestCategoryAmount,
      balancePoints,
    };
  }, [transactions]);

  const lineValues = analytics.balancePoints.map((point) => point.balance);
  const linePath = buildLinePath(lineValues, 260, 96);

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <article className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Resumo financeiro</h2>
            <p className="text-sm text-slate-500">Entradas e saídas registradas</p>
          </div>
          <span className="text-sm font-bold text-[#0f4c5c]">
            {transactions.length} transações
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[#f8fafc] p-4">
            <p className="text-sm text-slate-500">Receitas</p>
            <p className="mt-1 text-2xl font-bold text-[#0f4c5c]">
              {formatCurrency(analytics.income)}
            </p>
          </div>

          <div className="rounded-xl bg-[#fff7f7] p-4">
            <p className="text-sm text-slate-500">Despesas</p>
            <p className="mt-1 text-2xl font-bold text-[#9f2f2f]">
              {formatCurrency(analytics.expense)}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Receitas</span>
              <span>{analytics.incomePercent.toFixed(0)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#0f4c5c]"
                style={{ width: `${analytics.incomePercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Despesas</span>
              <span>{analytics.expensePercent.toFixed(0)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#d16b6b]"
                style={{ width: `${analytics.expensePercent}%` }}
              />
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">Gastos por categoria</h2>
        <p className="text-sm text-slate-500">Maiores despesas no período</p>

        {analytics.categoryRows.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">
            Nenhuma despesa para categorizar
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {analytics.categoryRows.map(([category, amount]) => (
              <div key={category}>
                <div className="mb-1 flex justify-between gap-3 text-sm">
                  <span className="font-medium">{category}</span>
                  <span>{formatCurrency(amount)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#f4a261]"
                    style={{
                      width: `${(amount / analytics.biggestCategoryAmount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </article>

      <article className="rounded-2xl bg-white p-5 shadow-sm xl:col-span-2">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Evolução do saldo</h2>
            <p className="text-sm text-slate-500">
              Últimas movimentações em ordem cronológica
            </p>
          </div>
          {analytics.balancePoints.length > 0 && (
            <span className="text-sm font-bold text-[#0f4c5c]">
              {formatCurrency(
                analytics.balancePoints[analytics.balancePoints.length - 1].balance
              )}
            </span>
          )}
        </div>

        {analytics.balancePoints.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">
            Adicione transações para acompanhar a evolução
          </p>
        ) : (
          <div className="mt-5">
            <svg
              viewBox="0 0 260 120"
              role="img"
              aria-label="Gráfico de evolução do saldo"
              className="h-40 w-full overflow-visible"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="96"
                x2="260"
                y2="96"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <path
                d={linePath}
                fill="none"
                stroke="#0f4c5c"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              />
              {analytics.balancePoints.map((point, index) => {
                const min = Math.min(...lineValues);
                const max = Math.max(...lineValues);
                const range = max - min || 1;
                const x =
                  lineValues.length > 1
                    ? (index * 260) / (lineValues.length - 1)
                    : 130;
                const y = 96 - ((point.balance - min) / range) * 96;

                return (
                  <circle
                    key={point.id}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#ffffff"
                    stroke="#0f4c5c"
                    strokeWidth="3"
                  />
                );
              })}
            </svg>

            <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
              {analytics.balancePoints.map((point) => (
                <div key={point.id} className="rounded-lg bg-[#f8fafc] p-2">
                  <p>{formatDate(point.date)}</p>
                  <p className="font-bold text-slate-700">
                    {formatCurrency(point.balance)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
