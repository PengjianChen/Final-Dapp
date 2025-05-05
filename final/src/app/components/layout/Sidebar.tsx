"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Loan", href: "/loan" },
  { label: "Deposit", href: "/deposit" },
  

  { label: "Information", href: "/information" },
  { label: "Admin", href: "/admin" },
  { label: "Sign Out", href: "/" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white shadow-lg p-6 rounded-r-3xl flex flex-col">
      <div className="text-3xl font-bold mb-10 text-indigo-600">NeoLend</div>
      <nav className="space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg text-lg transition-all ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
