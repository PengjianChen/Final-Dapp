'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Sidebar from '../../app/components/layout/Sidebar'
import Topbar from '../../app/components/layout/Topbar'
import { LENDING_CONTRACT_ABI, LENDING_CONTRACT_ADDRESS } from '@/hooks/contractlending'

interface RawLoan {
  borrower: string
  principal: ethers.BigNumber
  startTime: ethers.BigNumber
  dueTime: ethers.BigNumber
  repaid: boolean
  overdue: boolean
  repayTime: ethers.BigNumber
  interestRate: ethers.BigNumber
  penaltyRate: ethers.BigNumber
}

type LoanDetail = {
  id: number
  borrower: string
  principal: string
  startTime: string
  dueTime: string
  repayTime: string
  repaid: boolean
  overdue: boolean
  owed: string
}

export default function LoanPage() {
  const [address, setAddress] = useState<string | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [loans, setLoans] = useState<LoanDetail[]>([])
  const [outstanding, setOutstanding] = useState('')
  const [borrowAmount, setBorrowAmount] = useState('')
  const [repayId, setRepayId] = useState('')
  const [repayAmount, setRepayAmount] = useState('')

  const toDate = (ts: number) => ts === 0 ? '—' : new Date(ts * 1000).toLocaleDateString()

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      const userAddress = await signer.getAddress()
      setSigner(signer)
      setAddress(userAddress)
    }
  }

  const loadLoans = async () => {
    if (!signer || !address) return

    const contract = new ethers.Contract(
      LENDING_CONTRACT_ADDRESS,
      LENDING_CONTRACT_ABI,
      signer
    )

    const total = await contract.loans.length
    const list: LoanDetail[] = []

    for (let i = 0; i < total; i++) {
      const loan: RawLoan = await contract.loans(i)
      if (loan.borrower.toLowerCase() !== address.toLowerCase()) continue

      const owed = await contract.getAmountOwed(i)

      list.push({
        id: i,
        borrower: loan.borrower,
        principal: ethers.utils.formatEther(loan.principal),
        startTime: toDate(loan.startTime.toNumber()),
        dueTime: toDate(loan.dueTime.toNumber()),
        repayTime: toDate(loan.repayTime.toNumber()),
        repaid: loan.repaid,
        overdue: loan.overdue,
        owed: ethers.utils.formatEther(owed),
      })
    }

    setLoans(list)

    const totalOwed = await contract.userOutstanding(address)
    setOutstanding(ethers.utils.formatEther(totalOwed))
  }

  const handleBorrow = async () => {
    if (!signer || !borrowAmount) return
    const contract = new ethers.Contract(LENDING_CONTRACT_ADDRESS, LENDING_CONTRACT_ABI, signer)
    try {
      const tx = await contract.borrow(ethers.utils.parseEther(borrowAmount))
      await tx.wait()
      alert('✅ Borrow successful')
      setBorrowAmount('')
      await loadLoans()
    } catch (err) {
      console.error(err)
      alert('❌ Borrow failed')
    }
  }

  const handleRepay = async () => {
    if (!signer || !repayId || !repayAmount) return
    const contract = new ethers.Contract(LENDING_CONTRACT_ADDRESS, LENDING_CONTRACT_ABI, signer)
    try {
      const tx = await contract.repay(parseInt(repayId), {
        value: ethers.utils.parseEther(repayAmount),
      })
      await tx.wait()
      alert('✅ Repay successful')
      setRepayId('')
      setRepayAmount('')
      await loadLoans()
    } catch (err) {
      console.error(err)
      alert('❌ Repay failed')
    }
  }

  useEffect(() => {
    connectWallet()
  }, [])

  useEffect(() => {
    if (signer && address) loadLoans()
  }, [signer, address])

  return (
    <div className="flex h-screen bg-[#f5f6fa]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6 space-y-6 overflow-auto">
          <h2 className="text-2xl font-bold text-gray-800">📄 My Loans</h2>

          <div className="flex justify-between bg-white shadow rounded-xl p-4">
            <div>Total Loans: <span className="font-bold">{loans.length}</span></div>
            <div>Outstanding: <span className="font-bold">{outstanding} ETH</span></div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold text-lg mb-2">📘 Loan Records</h3>
            {loans.length === 0 ? (
              <p className="text-gray-500">No loan records</p>
            ) : (
              <ul className="space-y-2 text-sm text-gray-700">
                {loans.map((loan) => (
                  <li key={loan.id} className="border-b pb-1">
                    <span className="font-semibold">ID: {loan.id}</span>,
                    Principal: {loan.principal} ETH,
                    Owed: <span className="text-red-600">{loan.owed} ETH</span>,
                    Start: {loan.startTime},
                    Due: {loan.dueTime},
                    Repaid: {loan.repaid ? '✅' : '❌'},
                    Overdue: {loan.overdue ? '⚠️' : '—'}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow space-y-2">
            <h3 className="font-semibold text-lg">💰 Borrow</h3>
            <input
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
              placeholder="Amount (ETH)"
              className="border rounded px-3 py-2 w-full"
            />
            <button
              onClick={handleBorrow}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg"
            >
              Borrow
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl shadow space-y-2">
            <h3 className="font-semibold text-lg">💸 Repay</h3>
            <input
              value={repayId}
              onChange={(e) => setRepayId(e.target.value)}
              placeholder="Loan ID"
              className="border rounded px-3 py-2 w-full"
            />
            <input
              value={repayAmount}
              onChange={(e) => setRepayAmount(e.target.value)}
              placeholder="Repay Amount (ETH)"
              className="border rounded px-3 py-2 w-full"
            />
            <button
              onClick={handleRepay}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg"
            >
              Repay
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



