"use client";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useWallet } from "../../hooks/usewallet";
import { useLending } from "../../hooks/uselending";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { address } = useWallet();
  const {
    getUserLoanCount,
    getAmountOwed,
    getDepositBalance,
    getOutstandingDebt,
    //getBorrowLimit,
  } = useLending();

  const [loanCount, setLoanCount] = useState(0);
  const [outstanding, setOutstanding] = useState("0");
  const [depositBalance, setDepositBalance] = useState("0");
  const [outstandingDebt, setOutstandingDebt] = useState("0");
  const [borrowLimit, setBorrowLimit] = useState("0");
  const getBorrowLimit = async (address: string) => {
  return 0;
};

  useEffect(() => {
    const loadData = async () => {
      if (!address) return;

      const count = await getUserLoanCount(address);
      setLoanCount(Number(count));

      if (count > 0) {
        const lastLoanId = Number(count) - 1;
        const amount = await getAmountOwed(lastLoanId);
        setOutstanding(amount);
      }

      const deposit = await getDepositBalance(address);
      setDepositBalance(deposit);

      const debt = await getOutstandingDebt(address);
      setOutstandingDebt(debt);

      const limit = await getBorrowLimit(address);
      setBorrowLimit(limit);
    };

    loadData();
  }, [
    address,
    getAmountOwed,
    //getBorrowLimit,
    getDepositBalance,
    getOutstandingDebt,
    getUserLoanCount,
  ]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title="Dashboard" />
        <main className="flex-1 bg-gray-100 p-10 overflow-auto text-lg">
          <div className="bg-white p-6 rounded-xl shadow space-y-2">
            <h2 className="text-2xl font-semibold">
              Welcome, {address?.slice(0, 6)}...{address?.slice(-4)}
            </h2>
            <p>📂 Number of loan records: {loanCount}</p>
            <p>📌 Amount owed on the latest loan: {outstanding} ETH</p>
            <p>💰 Current deposit balance: {depositBalance} ETH</p>

          </div>

          <div className="flex gap-4 mt-6">
            <Link
              href="/loan"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Go to Loan Page
            </Link>
            <Link
              href="/deposit"
              className="px-6 py-3 border border-indigo-600 text-indigo-600 bg-white rounded-xl hover:bg-indigo-50 transition"
            >
              Go to Deposit Page
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
