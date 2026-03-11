import type { User } from '../types';
import { MOCK_USERS } from '../data/mockData';

export async function authenticateWithAadhaar(aadhaarNumber: string): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = MOCK_USERS.find(u => u.aadhaarNumber === aadhaarNumber);
  
  if (!user) {
    return { success: false, error: 'Aadhaar number not registered. Please register first.' };
  }
  
  return { success: true, user };
}

export async function verifyOTP(otp: string): Promise<{ success: boolean; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (otp === '123456') {
    return { success: true };
  }
  
  return { success: false, error: 'Invalid OTP. Use 123456 for demo.' };
}

export async function registerVoter(data: {
  aadhaarNumber: string;
  name: string;
  email?: string;
  phone: string;
}): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  if (data.aadhaarNumber.length !== 12) {
    return { success: false, error: 'Aadhaar must be 12 digits' };
  }
  
  if (data.name.length < 2) {
    return { success: false, error: 'Name must be at least 2 characters' };
  }
  
  if (data.phone.length !== 10) {
    return { success: false, error: 'Phone must be 10 digits' };
  }
  
  const existingUser = MOCK_USERS.find(u => u.aadhaarNumber === data.aadhaarNumber);
  if (existingUser) {
    return { success: false, error: 'Aadhaar already registered' };
  }
  
  const newUser: User = {
    id: String(Date.now()),
    aadhaarNumber: data.aadhaarNumber,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: 'voter',
    isVerified: true,
    hasVoted: false,
    registeredAt: new Date(),
  };
  
  MOCK_USERS.push(newUser);
  
  return { success: true, user: newUser };
}

export async function verifyBiometric(): Promise<{ success: boolean; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}
