// src/app/page.tsx
'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6">Welcome to NeoLend</h1>
      <p className="text-lg text-gray-700 mb-6">Your decentralized lending platform.</p>
      <div className="flex gap-4">
        <Link href="/dashboard" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Dashboard</Link>
        <Link href="/deposit" className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50">Deposit</Link>
        <Link href="/loan" className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50">Loan</Link>
        <Link href="/admin" className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50">Admin</Link>
      </div>
    </main>
  )
}
