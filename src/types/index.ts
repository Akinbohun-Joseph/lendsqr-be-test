import { Request } from 'express';
export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  bvn: string;
  is_blacklisted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Wallet {
  id: number;
  user_id: number;
  balance: number;
  currency: string;
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  id: number;
  wallet_id: number;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: Date;
}

export interface AuthRequestBody {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  amount?: number;
  description?: string;
  reference?: string;
  bvn?: string
  wallet_id?: number;
  type?: 'credit' | 'debit';
  status?: 'pending' | 'completed' | 'failed';
  user_id?: number;
}

export interface AuthRequestParams {
  id?: string;
  wallet_id?: string;
  transaction_id?: string;
}

export interface AuthRequestQuery {
  page?: string;
  limit?: string;
  search?: string;
}

export interface AuthRequest extends Request<AuthRequestParams, any, AuthRequestBody, AuthRequestQuery> {
  user?: User;
  token?: string;
}
export interface Pagination<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
export interface WalletBalance {
  balance: number;
  currency: string;
}
export interface FundWalletRequest {
  amount: number;
  description?: string;
}
export interface WithdrawFundsRequest {
  amount: number;
  description?: string;
}
export interface TransactionHistoryRequest {
  page?: number;
  limit?: number;
  search?: string;
}
export type TransactionType = 'credit' | 'debit';
export type TransactionStatus = 'pending' | 'completed' | 'failed';


