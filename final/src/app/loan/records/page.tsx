"use client";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { useWallet } from "../../../hooks/usewallet";
import { useLending } from "../../../hooks/uselending";
import { useEffect, useState } from "react";

export default function LoanRecordsPage() {
  const { address } = useWallet();
  const { getUserLoanCount, getLoanDetails, repay, getAmountOwed } = useLending();

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLoans = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const count = await getUserLoanCount(address);
      const items = [];
      for (let i = 0; i < Number(count); i++) {
        const detail = await getLoanDetails(i);
        const owed = await getAmountOwed(i);
        items.push({ id: i, ...detail, owed });
      }
      setRecords(items);
    } catch (err) {
      console.error("Failed to load loan records", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRepay = async (loanId: number, amount: string) => {
    try {
      setLoading(true);
      await repay(loanId, amount);
      await loadLoans();
    } catch (err) {
      alert("Repayment failed. Please check the amount or your network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, [address]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title="Loan Records" />
        <main className="flex-1 bg-gray-100 p-10 overflow-auto text-lg">
          {records.length === 0 ? (
            <p>No loan records found.</p>
          ) : (
            records.map((loan) => (
              <div key={loan.id} className="bg-white p-6 rounded-xl shadow space-y-2 mb-6">
                <h3 className="text-2xl font-semibold">Loan #{loan.id}</h3>
                <p>Principal: {loan.principal.toString()} wei</p>
                <p>Amount Owed: {loan.owed.toString()} wei</p>
                <p>Start Time: {new Date(Number(loan.startTime) * 1000).toLocaleString()}</p>
                <p>Due Time: {new Date(Number(loan.dueTime) * 1000).toLocaleString()}</p>
                <p>Repaid: {loan.repaid ? "✅" : "❌"}</p>
                <p>Overdue: {loan.overdue ? "⚠️ Yes" : "On Time"}</p>

                {!loan.repaid && (
                  <button
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all mt-2"
                    onClick={() => handleRepay(loan.id, loan.owed.toString())}
                    disabled={loading}
                  >
                    Repay Now
                  </button>
                )}
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
