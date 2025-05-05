'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLending } from '../../hooks/uselending'
import { useWallet } from '../../hooks/usewallet'
import Sidebar from '../../app/components/layout/Sidebar'
import Topbar from '../../app/components/layout/Topbar'

export default function AdminPage() {
  const {
    fundPool,
    withdrawPool,
    getPoolBalance,
  } = useLending()

  const { connectWallet } = useWallet()

  const [poolBalance, setPoolBalance] = useState('0.0000')
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')

  const updatePoolBalance = useCallback(async () => {
    try {
      const pool = await getPoolBalance()
      setPoolBalance(pool)
    } catch (err) {
      console.error('Failed to get pool balance:', err)
      setPoolBalance('0.0000')
    }
  }, [getPoolBalance])

  const loadParams = useCallback(async () => {
    try {
      await connectWallet()
      await updatePoolBalance()
    } catch (err) {
      console.error('Failed to load wallet or balance:', err)
    }
  }, [connectWallet, updatePoolBalance])

  useEffect(() => {
    loadParams()
  }, [loadParams])

  const handleDeposit = async () => {
    if (!depositAmount) return alert('Please enter a deposit amount.')
    try {
      await fundPool(depositAmount)
      alert('✅ Deposit successful')
      await updatePoolBalance()
    } catch (err) {
      console.error('Deposit failed:', err)
      alert('❌ Deposit failed. Check wallet permissions or network.')
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount) return alert('Please enter a withdrawal amount.')
    try {
      await withdrawPool(withdrawAmount)
      alert('✅ Withdrawal successful')
      await updatePoolBalance()
    } catch (err) {
      console.error('Withdrawal failed:', err)
      alert('❌ Withdrawal failed. Check wallet permissions or network.')
    }
  }

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title="Admin" />
        <section className="pl-8 pr-6 pt-6 pb-10 space-y-6 bg-gray-100 min-h-screen">
          <h2 className="text-3xl font-bold text-gray-700">Admin Console</h2>

          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Pool Balance</h3>
            <p className="text-gray-800 mb-4 text-lg">
              Current Pool: <span className="font-bold">{poolBalance || '0.0000'} ETH</span>
            </p>

            <div className="grid grid-cols-2 gap-6">
              {/* Deposit */}
              <div>
                <label className="block mb-2 text-sm text-gray-600">Deposit Amount (ETH)</label>
                <input
                  type="text"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 0.01"
                  className="w-full px-4 py-2 border rounded text-sm"
                />
                <button
                  onClick={handleDeposit}
                  className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  Deposit
                </button>
              </div>

              {/* Withdraw */}
              <div>
                <label className="block mb-2 text-sm text-gray-600">Withdraw Amount (ETH)</label>
                <input
                  type="text"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="e.g. 0.005"
                  className="w-full px-4 py-2 border rounded text-sm"
                />
                <button
                  onClick={handleWithdraw}
                  className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
