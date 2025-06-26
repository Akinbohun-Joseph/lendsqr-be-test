import { db } from '../config/database';
import { Wallet, Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class WalletService {
  static async getWalletByUserId(userId: number): Promise<Wallet | null> {
    return db('wallets').where('user_id', userId).first();
  }

  static async getBalance(userId: number): Promise<number> {
    const wallet = await this.getWalletByUserId(userId);
    return wallet?.balance || 0;
  }

  static async fundWallet(userId: number, amount: number, description: string = 'Wallet funding'): Promise<Transaction> {
    const trx = await db.transaction();
    
    try {
      const wallet = await trx('wallets').where('user_id', userId).first();
      
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Update wallet balance
      await trx('wallets')
        .where('user_id', userId)
        .increment('balance', amount);

      // Record transaction
      const [transactionId] = await trx('transactions').insert({
        wallet_id: wallet.id,
        type: 'credit',
        amount,
        description,
        reference: uuidv4(),
        status: 'completed',
      });

      await trx.commit();

      return this.getTransactionById(transactionId);
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  static async transferFunds(
    fromUserId: number,
    toUserId: number,
    amount: number,
    description: string = 'Transfer'
  ): Promise<{ debitTransaction: Transaction; creditTransaction: Transaction }> {
    const trx = await db.transaction();

    try {
      const fromWallet = await trx('wallets').where('user_id', fromUserId).first();
      const toWallet = await trx('wallets').where('user_id', toUserId).first();

      if (!fromWallet || !toWallet) {
        throw new Error('Wallet not found');
      }

      if (fromWallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // Debit sender
      await trx('wallets')
        .where('user_id', fromUserId)
        .decrement('balance', amount);

      // Credit recipient
      await trx('wallets')
        .where('user_id', toUserId)
        .increment('balance', amount);

      // Record debit transaction
      const [debitTransactionId] = await trx('transactions').insert({
        wallet_id: fromWallet.id,
        type: 'debit',
        amount,
        description: `Transfer to user ${toUserId}: ${description}`,
        reference: uuidv4(),
        status: 'completed',
      });

      // Record credit transaction
      const [creditTransactionId] = await trx('transactions').insert({
        wallet_id: toWallet.id,
        type: 'credit',
        amount,
        description: `Transfer from user ${fromUserId}: ${description}`,
        reference: uuidv4(),
        status: 'completed',
      });

      await trx.commit();

      const debitTransaction = await this.getTransactionById(debitTransactionId);
      const creditTransaction = await this.getTransactionById(creditTransactionId);

      return { debitTransaction, creditTransaction };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  static async withdrawFunds(
    userId: number,
    amount: number,
    description: string = 'Withdrawal'
  ): Promise<Transaction> {
    const trx = await db.transaction();

    try {
      const wallet = await trx('wallets').where('user_id', userId).first();

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (wallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // Update wallet balance
      await trx('wallets')
        .where('user_id', userId)
        .decrement('balance', amount);

      // Record transaction
      const [transactionId] = await trx('transactions').insert({
        wallet_id: wallet.id,
        type: 'debit',
        amount,
        description,
        reference: uuidv4(),
        status: 'completed',
      });

      await trx.commit();

      return this.getTransactionById(transactionId);
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  static async getTransactionHistory(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const wallet = await this.getWalletByUserId(userId);
    
    if (!wallet) {
      return { transactions: [], total: 0 };
    }

    const offset = (page - 1) * limit;

    const [transactions, [{ total }]] = await Promise.all([
      db('transactions')
        .where('wallet_id', wallet.id)
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),
      db('transactions')
        .where('wallet_id', wallet.id)
        .count('id as total')
    ]);

    return { transactions, total: total as number };
  }

  static async getTransactionById(id: number): Promise<Transaction> {
    return db('transactions').where('id', id).first();
  }
}
