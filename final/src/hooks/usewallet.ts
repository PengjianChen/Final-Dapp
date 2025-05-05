import { useEffect, useState } from "react";
import { ethers } from "ethers";

const ADMIN_WHITELIST = [
  "0xabb702eC968B31ff3c9eDecdf840b23C9F34CB3e".toLowerCase(),
];

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("请安装 MetaMask");
      return false;
    }
    try {
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length === 0) return false;

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      setAddress(accounts[0]);

      return true;
    } catch (err) {
      console.error("连接失败", err);
      return false;
    }
  };

  const verifyAdmin = async () => {
    return address !== null && ADMIN_WHITELIST.includes(address.toLowerCase());
  };

  useEffect(() => {
    if (window.ethereum && !address) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);

      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) setAddress(accounts[0]);
        });
    }
  }, [address]);

  const signer = provider ? provider.getSigner() : null;

  return { connectWallet, address, verifyAdmin, provider, signer };
}
