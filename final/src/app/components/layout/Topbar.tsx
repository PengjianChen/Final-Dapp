"use client";
import { useState, useRef, useEffect } from "react";
import { useWallet } from "../../../hooks/usewallet";

export default function Topbar({ title }: { title: string }) {
  const { address } = useWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const showDropdown = () => setDropdownOpen(true);
  const hideDropdown = () => setDropdownOpen(false);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const formattedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Not Connected";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full h-20 bg-white flex items-center justify-between px-32 shadow-md border-b border-gray-100 text-lg text-gray-700 relative">
      {/* Left-side title (soft gray) */}
      <h1 className="text-3xl font-bold text-gray-600">{title}</h1>

      {/* Wallet address display */}
      {address && (
        <div
          ref={ref}
          className="relative"
          onMouseEnter={showDropdown}
          onMouseLeave={hideDropdown}
        >
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 text-gray-600 hover:underline"
          >
            Wallet: {formattedAddress}
            <span className="text-xl">{dropdownOpen ? "▲" : "▼"}</span>
          </button>

          {/* Dropdown showing full wallet address */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-max bg-white border shadow-lg rounded-md p-4 z-50">
              <div className="text-sm font-mono break-all text-gray-700">
                {address}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
