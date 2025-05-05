"use client";

import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/usewallet";

export default function LoginPage() {
  const router = useRouter();
  const { connectWallet, verifyAdmin } = useWallet();

  const handleUserLogin = async () => {
    const ok = await connectWallet();
    if (ok) router.push("/dashboard");
  };

  const handleAdminLogin = async () => {
    const ok = await connectWallet();
    const isAdmin = await verifyAdmin();
    if (ok && isAdmin) router.push("/admin");
    else alert("Access denied: not an admin address");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white gap-6">
      <h1 className="text-3xl font-semibold text-indigo-600">Welcome to NeoLend</h1>
      <div className="flex gap-4">
        <Button onClick={handleUserLogin}>Connect Wallet</Button>
        <Button onClick={handleAdminLogin} variant="outline">
          Admin Login
        </Button>
      </div>
    </div>
  );
}

// ✅ Inline button component (Button)
function Button({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline";
}) {
  const baseStyle = "px-6 py-2 rounded-xl font-medium transition";
  const styles = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${styles[variant]}`}>
      {children}
    </button>
  );
}
