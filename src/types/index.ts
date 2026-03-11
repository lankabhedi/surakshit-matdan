export interface User {
  id: string;
  aadhaarNumber: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'voter' | 'admin';
  isVerified: boolean;
  hasVoted: boolean;
  registeredAt: Date;
  avatar?: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  symbol: string;
  description: string;
  votes: number;
  image?: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  candidates: Candidate[];
  isActive: boolean;
  isPublished: boolean;
  totalVotes: number;
}

export interface Vote {
  id: string;
  electionId: string;
  voterId: string;
  candidateId: string;
  timestamp: Date;
  transactionHash: string;
}

export type AuthStep = 'aadhaar' | 'otp' | 'biometric' | 'wallet';

export interface AuthState {
  step: AuthStep;
  aadhaarNumber: string;
  userData: {
    aadhaarNumber: string;
    name: string;
  } | null;
}
