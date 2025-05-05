"use client";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function FormulaPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title="Calculation Formulas" />
        <main className="flex-1 bg-gray-100 p-10 overflow-auto text-lg space-y-6">
          {/* Loan Formula Card */}
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-2xl font-semibold">Loan Calculation Formula</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Maximum Loan Amount</strong>
                <ul className="list-[circle] pl-6 space-y-1">
                  <li>With deposits: 2 × deposit balance + 1 ETH (but no more than 50% of the pool balance)</li>
                  <li>Without deposits: up to 1 ETH (requires ≥70 reputation and at least 1 repayment)</li>
                </ul>
              </li>
              <li>Per-loan limit: Cannot exceed 50% of the pool balance</li>
              <li>
                <strong>Annual Interest Rate</strong>
                <ul className="list-[circle] pl-6 space-y-1">
                  <li>With deposits: 8%</li>
                  <li>Without deposits: 11%</li>
                </ul>
              </li>
              <li>
                <strong>Early Repayment Penalty</strong>
                <ul className="list-[circle] pl-6 space-y-1">
                  <li>With deposits: 1%</li>
                  <li>Without deposits: 3%</li>
                </ul>
              </li>
              <li>
                <strong>Late Penalty = Base Rate + Penalty Rate</strong>
              </li>
            </ul>
          </div>

          {/* Deposit Rules Card */}
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-2xl font-semibold">Deposit Rules</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All deposits are withdrawable anytime, but if loans are unpaid, withdrawal may be limited.</li>
              <li>
                Withdrawal limit: After withdrawal, you must still meet{" "}
                <strong>Max Loanable Amount ≥ Outstanding Loans</strong>
              </li>
              <li>
                Deposit Balance = Total Deposits - Withdrawals
              </li>
            </ul>
          </div>

          {/* Deposit Types Info */}
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-2xl font-semibold">Deposit Types & Interest Rates</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Fixed Term</strong>: 4.75% annual interest
                <ul className="list-[circle] pl-6 space-y-1">
                  <li>1-year lock-in</li>
                  <li>Not withdrawable before maturity</li>
                </ul>
              </li>
              <li>
                <strong>Flexible Term</strong>: 1.5% annual interest
                <ul className="list-[circle] pl-6 space-y-1">
                  <li>Withdraw anytime</li>
                  <li>Interest based on actual holding days</li>
                </ul>
              </li>
              <li>
                <strong>Monthly Saver</strong>: 6.0% annual interest
                <ul className="list-[circle] pl-6 space-y-1">
                  <li>Deposit only once per month</li>
                  <li>Max per deposit: 0.5 ETH</li>
                  <li>If withdrawn early more than 3 times in 12 months, rate drops to 1.0%</li>
                </ul>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
