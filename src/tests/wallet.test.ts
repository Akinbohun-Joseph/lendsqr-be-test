import request from 'supertest';
import app from '../server';
import { UserService } from '../services/UserService';
import { WalletService } from '../services/walletService';

describe('Wallet Operations', () => {
  let userToken: string;
  let userId: number;

  beforeEach(async () => {
    const user = await UserService.create({
      email: 'test@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
    });
    
    userId = user.id;
    
    const authResult = await UserService.authenticate('test@example.com', 'password123');
    userToken = authResult!.token;
  });

  describe('GET /api/wallet/balance', () => {
    it('should return wallet balance', async () => {
      const response = await request(app)
        .get('/api/wallet/balance')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.balance).toBe(0);
      expect(response.body.currency).toBe('NGN');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/wallet/balance')
        .expect(401);
    });
  });

  describe('POST /api/wallet/fund', () => {
    it('should fund wallet successfully', async () => {
      const response = await request(app)
        .post('/api/wallet/fund')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          amount: 1000,
          description: 'Test funding',
        })
        .expect(200);

      expect(response.body.message).toBe('Wallet funded successfully');
      expect(response.body.transaction.amount).toBe(1000);
      expect(response.body.transaction.type).toBe('credit');
    });

    it('should return validation error for negative amount', async () => {
      const response = await request(app)
        .post('/api/wallet/fund')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          amount: -100,
        })
        .expect(400);

      expect(response.body.error).toContain('positive');
    });
  });

  describe('POST /api/wallet/transfer', () => {
    let recipientToken: string;

    beforeEach(async () => {
      // Create recipient user
      await UserService.create({
        email: 'recipient@example.com',
        password: 'password123',
        first_name: 'Jane',
        last_name: 'Doe',
      });

      const recipientAuth = await UserService.authenticate('recipient@example.com', 'password123');
      recipientToken = recipientAuth!.token;

      // Fund sender's wallet
      await WalletService.fundWallet(userId, 1000);
    });

    it('should transfer funds successfully', async () => {
      const response = await request(app)
        .post('/api/wallet/transfer')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          recipient_email: 'recipient@example.com',
          amount: 500,
          description: 'Test transfer',
        })
        .expect(200);

      expect(response.body.message).toBe('Transfer successful');
      expect(response.body.debitTransaction.amount).toBe(500);
      expect(response.body.creditTransaction.amount).toBe(500);
    });

    it('should return error for insufficient balance', async () => {
      const response = await request(app)
        .post('/api/wallet/transfer')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          recipient_email: 'recipient@example.com',
          amount: 2000,
        })
        .expect(400);

      expect(response.body.error).toBe('Insufficient balance');
    });

    it('should return error for non-existent recipient', async () => {
      const response = await request(app)
        .post('/api/wallet/transfer')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          recipient_email: 'nonexistent@example.com',
          amount: 100,
        })
        .expect(404);

      expect(response.body.error).toBe('Recipient not found');
    });
  });

  describe('POST /api/wallet/withdraw', () => {
    beforeEach(async () => {
      await WalletService.fundWallet(userId, 1000);
    });

    it('should withdraw funds successfully', async () => {
      const response = await request(app)
        .post('/api/wallet/withdraw')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          amount: 500,
          description: 'Test withdrawal',
        })
        .expect(200);

      expect(response.body.message).toBe('Withdrawal successful');
      expect(response.body.transaction.amount).toBe(500);
      expect(response.body.transaction.type).toBe('debit');
    });

    it('should return error for insufficient balance', async () => {
      const response = await request(app)
        .post('/api/wallet/withdraw')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          amount: 2000,
        })
        .expect(400);

      expect(response.body.error).toBe('Insufficient balance');
    });
  });

  describe('GET /api/wallet/transactions', () => {
    beforeEach(async () => {
      await WalletService.fundWallet(userId, 1000, 'Funding 1');
      await WalletService.fundWallet(userId, 500, 'Funding 2');
      await WalletService.withdrawFunds(userId, 200, 'Withdrawal 1');
    });

    it('should return transaction history', async () => {
      const response = await request(app)
        .get('/api/wallet/transactions')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.transactions).toHaveLength(3);
      expect(response.body.pagination.total).toBe(3);
      expect(response.body.transactions[0].created_at).toBeDefined();
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/wallet/transactions?page=1&limit=2')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.transactions).toHaveLength(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.pages).toBe(2);
    });
  });
});