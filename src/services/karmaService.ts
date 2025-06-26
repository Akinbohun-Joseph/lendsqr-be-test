import axios from 'axios';
import { logger } from '../utils/logger';

export class KarmaService {
  private static readonly baseURL = process.env.KARMA_BASE_URL || 'https://api.karmaapi.com';
  private static readonly apiKey = process.env.KARMA_API_KEY;

  static async checkBlacklist(email: string): Promise<boolean> {
    try {
      if (!this.apiKey) {
        logger.warn('Karma API key not configured, skipping blacklist check');
        return false;
      }

      const response = await axios.get(`${this.baseURL}/blacklist/${email}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        timeout: 5000,
      });

      return response.data.blacklisted === true;
    } catch (error) {
      logger.error('Error checking Karma blacklist:', error);
      // Return false on error to not block legitimate users
      return false;
    }
  }
}
