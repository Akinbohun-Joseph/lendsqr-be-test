import { Response } from 'express';
import Joi from 'joi';
import { WalletService } from '../services/walletService';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../types';

const fundSchema = Joi.object({
  amount: Joi.number().positive().required(),
  description: Joi.string().optional(),
});

const transferSchema = Joi.object({
  recipient_email: Joi.string().email().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().optional(),
});

const withdrawSchema = Joi.object({
  amount: Joi.number().positive().required(),
  description: Joi.string().optional(),
});

export class WalletController {
  static async getBalance(req: AuthRequest, res: Response): Promise<void> {
    try {
      const balance = await WalletService.getBalance(req.user!.id);
      
      res.json({
        balance,
        currency: 'NGN',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fundWallet(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { error, value } = fundSchema.validate(req.body);
      
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const transaction = await WalletService.fundWallet(
        req.user!.id,
        value.amount,
        value.description
      );

      res.json({
        message: 'Wallet funded successfully',
        transaction,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async transferFunds(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { error, value } = transferSchema.validate(req.body);
      
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      // Find recipient
      const recipient = await UserService.findByEmail(value.recipient_email);
      if (!recipient) {
        res.status(404).json({ error: 'Recipient not found' });
        return;
      }

      if (recipient.is_blacklisted) {
        res.status(403).json({ error: 'Recipient is blacklisted' });
        return;
      }

      if (recipient.id === req.user!.id) {
        res.status(400).json({ error: 'Cannot transfer to yourself' });
        return;
      }

      const { debitTransaction, creditTransaction } = await WalletService.transferFunds(
        req.user!.id,
        recipient.id,
        value.amount,
        value.description
      );

      res.json({
        message: 'Transfer successful',
        debitTransaction,
        creditTransaction,
      });
    } catch (error: any) {
      if (error.message === 'Insufficient balance') {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async withdrawFunds(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { error, value } = withdrawSchema.validate(req.body);
      
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const transaction = await WalletService.withdrawFunds(
        req.user!.id,
        value.amount,
        value.description
      );

      res.json({
        message: 'Withdrawal successful',
        transaction,
      });
    } catch (error: any) {
      if (error.message === 'Insufficient balance') {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async getTransactionHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);

      const { transactions, total } = await WalletService.getTransactionHistory(
        req.user!.id,
        page,
        limit
      );

      res.json({
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}