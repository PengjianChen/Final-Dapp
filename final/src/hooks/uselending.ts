import { useCallback } from 'react';
import { ethers } from 'ethers';
import { LENDING_CONTRACT_ADDRESS, LENDING_CONTRACT_ABI } from '../hooks/contractlending';
import { useWallet } from './usewallet';

export interface LoanDetail {
  borrower: string;
  principal: string;
  startTime: number;
  dueTime: number;
  repayTime: number;
  repaid: boolean;
  overdue: boolean;
  interestRate: number;
  penaltyRate: number;
}

export function useLending() {
  const { signer } = useWallet();

  const getContract = useCallback(() => {
    if (!signer) throw new Error('Signer 未连接钱包');
    return new ethers.Contract(LENDING_CONTRACT_ADDRESS, LENDING_CONTRACT_ABI, signer);
  }, [signer]);

  // --- Borrower functions ---

  const borrow = async (amount: string) => {
    const contract = getContract();
    const tx = await contract.borrow(ethers.utils.parseEther(amount));
    await tx.wait();
  };

  const repay = async (loanId: number, amount: string) => {
    const contract = getContract();
    const tx = await contract.repay(loanId, {
      value: ethers.utils.parseEther(amount),
    });
    await tx.wait();
  };

  const getAmountOwed = async (loanId: number): Promise<string> => {
    const contract = getContract();
    const result = await contract.getAmountOwed(loanId);
    return ethers.utils.formatEther(result);
  };

  const getLoanDetails = async (loanId: number): Promise<LoanDetail> => {
    const contract = getContract();
    const result = await contract.getLoanDetails(loanId);
    return {
      borrower: result[0],
      principal: ethers.utils.formatEther(result[1]),
      startTime: result[2].toNumber(),
      dueTime: result[3].toNumber(),
      repaid: result[4],
      overdue: result[5],
      repayTime: result[6].toNumber(),
      interestRate: result[7].toNumber(),
      penaltyRate: result[8].toNumber(),
    };
  };

  const getUserLoanCount = async (user: string): Promise<number> => {
    const contract = getContract();
    const count = await contract.getUserLoanCount(user);
    return Number(count);
  };

  const getUserLoanId = async (user: string, index: number): Promise<number> => {
    const contract = getContract();
    const count = await contract.getUserLoanCount(user);
    if (index >= count) throw new Error('Index out of range');
    const id = await contract.userLoans(user, index);
    return Number(id);
  };
  

  const getOutstandingDebt = async (user: string): Promise<string> => {
    const contract = getContract();
    const debt = await contract.userOutstanding(user);
    return ethers.utils.formatEther(debt);
  };

  // --- Admin & Pool info ---

  const fundPool = async (amount: string) => {
    const contract = getContract();
    const tx = await contract.fundPool({
      value: ethers.utils.parseEther(amount),
    });
    await tx.wait();
  };

  const withdrawPool = async (amount: string) => {
    const contract = getContract();
    const tx = await contract.withdrawPool(ethers.utils.parseEther(amount));
    await tx.wait();
  };

  const getPoolBalance = async (): Promise<string> => {
    const contract = getContract();
    const balance = await contract.poolBalance();
    return ethers.utils.formatEther(balance);
  };

  const getOwner = async (): Promise<string> => {
    const contract = getContract();
    return await contract.owner();
  };

  const getBaseInterestRate = async (): Promise<string> => {
    const contract = getContract();
    const result = await contract.BASE_INTEREST_NO_DEPOSIT();
    return result.toString();
  };

  const getPenaltyInterestRate = async (): Promise<string> => {
    const contract = getContract();
    const result = await contract.PENALTY_INTEREST_NO_DEPOSIT();
    return result.toString();
  };

  const getLoanTerm = async (): Promise<number> => {
    const contract = getContract();
    const term = await contract.LOAN_TERM();
    return Number(term);
  };

  const getDepositContractAddress = async (): Promise<string> => {
    const contract = getContract();
    return await contract.depositContract();
  };

  const getTotalDeposits = async (): Promise<string> => {
    const contract = getContract();
    const total = await contract.totalDeposits();
    return ethers.utils.formatEther(total);
  };

  const getDepositBalance = async (user: string): Promise<string> => {
    const contract = getContract();
    const balance = await contract.poolBalance(); // or getTotalDeposits() if available
    return ethers.utils.formatEther(balance);
  };
  return {
    borrow,
    repay,
    getAmountOwed,
    getLoanDetails,
    getUserLoanCount,
    getUserLoanId,
    getOutstandingDebt,
    fundPool,
    withdrawPool,
    getPoolBalance,
    getOwner,
    getBaseInterestRate,
    getPenaltyInterestRate,
    getLoanTerm,
    getDepositContractAddress,
    getTotalDeposits,
    getDepositBalance,
  };
}
