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
      console.error('获取资金池失败:', err)
      setPoolBalance('0.0000')
    }
  }, [getPoolBalance])

  const loadParams = useCallback(async () => {
    try {
      await connectWallet()
      await updatePoolBalance()
    } catch (err) {
      console.error('加载失败:', err)
    }
  }, [connectWallet, updatePoolBalance])

  useEffect(() => {
    loadParams()
  }, [loadParams])

  const handleDeposit = async () => {
    if (!depositAmount) return alert('请输入注资金额')
    try {
      await fundPool(depositAmount)
      alert('注资成功')
      await updatePoolBalance()
    } catch (err) {
      console.error('注资失败:', err)
      alert('注资失败，请检查权限和网络')
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount) return alert('请输入提取金额')
    try {
      await withdrawPool(withdrawAmount)
      alert('提取成功')
      await updatePoolBalance()
    } catch (err) {
      console.error('提取失败:', err)
      alert('提取失败，请检查权限和网络')
    }
  }

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title="Admin" />
        <section className="pl-8 pr-6 pt-6 pb-10 space-y-6 bg-gray-100 min-h-screen">
          <h2 className="text-3xl font-bold text-gray-700">管理员控制台</h2>

          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">资金池余额</h3>
            <p className="text-gray-800 mb-4 text-lg">
              当前资金池: <span className="font-bold">{poolBalance || '0.0000'} ETH</span>
            </p>

            <div className="grid grid-cols-2 gap-6">
              {/* 注资 */}
              <div>
                <label className="block mb-2 text-sm text-gray-600">注资金额（ETH）</label>
                <input
                  type="text"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="例如 0.01"
                  className="w-full px-4 py-2 border rounded text-sm"
                />
                <button
                  onClick={handleDeposit}
                  className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  注资
                </button>
              </div>

              {/* 提取 */}
              <div>
                <label className="block mb-2 text-sm text-gray-600">提取金额（ETH）</label>
                <input
                  type="text"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="例如 0.005"
                  className="w-full px-4 py-2 border rounded text-sm"
                />
                <button
                  onClick={handleWithdraw}
                  className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  提取
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}