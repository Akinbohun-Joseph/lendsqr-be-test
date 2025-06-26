// services/blacklistService.ts
interface BlacklistResult {
  isBlacklisted: boolean;
  reason?: string;
}

const mockBlacklistData = {
  bvns: ["12345678901", "09876543210", "11223344556"],
  emails: ["blacklisted@example.com", "fraud@test.com"]
};

export const isUserBlacklisted = async (email: string, bvn: string): Promise<BlacklistResult> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (mockBlacklistData.emails.includes(email.toLowerCase())) {
      return { isBlacklisted: true, reason: 'Email is blacklisted' };
    }
    
    if (mockBlacklistData.bvns.includes(bvn)) {
      return { isBlacklisted: true, reason: 'BVN is blacklisted' };
    }

    return { isBlacklisted: false };
    
  } catch (error) {
    console.error('Blacklist check error:', error);
    // Fail safe - don't block registration due to service issues
    return { isBlacklisted: false };
  }
};