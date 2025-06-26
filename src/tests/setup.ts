import { beforeEach } from 'node:test';
import { db } from '../config/database';

beforeAll(async () => {
  try {
    // Run migrations
    await db.migrate.latest();
  } catch (error) {
    console.error('Migration failed:', error);
  }
});

afterAll(async () => {
  try {
    // Close database connection
    await db.destroy();
  } catch (error) {
    console.error('Database cleanup failed:', error);
  }
});

beforeEach(async () => {
  try {
    // Clean up database between tests
    await db('transactions').del();
    await db('wallets').del();
    await db('users').del();
  } catch (error) {
    console.error('Database cleanup failed:', error);
  }
});

function beforeAll(arg0: () => Promise<void>) {
    throw new Error('Function not implemented.');
}
function afterAll(arg0: () => Promise<void>) {
    throw new Error('Function not implemented.');
}

