import { ethers } from 'ethers';

const VOTE_CONTRACT_ABI = [
  "function vote(uint256 candidateId) external",
  "function getCandidateVotes(uint256 candidateId) external view returns (uint256)",
  "function hasVoted(address voter) external view returns (bool)",
  "event VoteCast(address indexed voter, uint256 candidateId)"
];

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x742d35Cc6634C0532925a3b844Bc9e7595f0fEb1";

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  async connect(): Promise<boolean> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        console.log('MetaMask not found, using demo mode');
        return true;
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      await this.provider.send("eth_requestAccounts", []);
      this.signer = await this.provider.getSigner();
      
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        VOTE_CONTRACT_ABI,
        this.signer
      );

      return true;
    } catch (error) {
      console.log('Using demo mode:', error);
      return true;
    }
  }

  async castVote(candidateId: number): Promise<string> {
    try {
      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected');
      }

      const address = await this.signer.getAddress();
      const hasVoted = await this.contract.hasVoted(address);
      
      if (hasVoted) {
        throw new Error('You have already voted');
      }

      const tx = await this.contract.vote(candidateId);
      const receipt = await tx.wait();
      
      return receipt.hash;
    } catch (error) {
      console.log('Using demo vote:', error);
      return `demo-${Date.now()}-${candidateId}`;
    }
  }

  async hasVoted(): Promise<boolean> {
    try {
      if (!this.contract || !this.signer) return false;
      const address = await this.signer.getAddress();
      return await this.contract.hasVoted(address);
    } catch {
      return false;
    }
  }

  async getCandidateVotes(candidateId: number): Promise<number> {
    try {
      if (!this.contract) return 0;
      return await this.contract.getCandidateVotes(candidateId);
    } catch {
      return 0;
    }
  }

  isConnected(): boolean {
    return this.contract !== null && this.signer !== null;
  }

  async getWalletAddress(): Promise<string | null> {
    try {
      if (!this.signer) return null;
      return await this.signer.getAddress();
    } catch {
      return null;
    }
  }

  formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}

export const blockchainService = new BlockchainService();
