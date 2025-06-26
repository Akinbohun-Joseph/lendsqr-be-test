// services/UserService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/database";
import { User } from "../types";

export class UserService {
  static async create(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    bvn: string; 
  }): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      const [userId] = await db("users").insert({
        email: userData.email,
        password_hash: hashedPassword,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        bvn: userData.bvn, // Store BVN
        is_blacklisted: false, // Default value
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      });

      // Create wallet for user
      await db("wallets").insert({
        user_id: userId,
        balance: 0.0,
        currency: "NGN",
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      });

      const user = await this.findById(userId);
      if (!user) {
        throw new Error("User not found after creation");
      }
      
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  static async authenticate(
    email: string,
    password: string
  ): Promise<{ user: User; token: string } | null> {
    try {
      const user = await db("users").where("email", email).first();

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return null;
      }

      if (user.is_blacklisted) {
        throw new Error("User is blacklisted");
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "24h" }
      );

      return { user, token };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  static async findById(id: number): Promise<User | null> {
    return db("users").where("id", id).first();
  }

  static async findByEmail(email: string): Promise<User | null> {
    return db("users").where("email", email).first();
  }

  static async updateProfile(
    userId: number,
    updates: Partial<User>
  ): Promise<User> {
    try {
      // Remove sensitive fields that shouldn't be updated directly
      const { password_hash, id, created_at, ...safeUpdates } = updates;
      
      await db("users")
        .where("id", userId)
        .update({
          ...safeUpdates,
          updated_at: db.fn.now()
        });

      const user = await this.findById(userId);
      if (!user) {
        throw new Error("User not found after update");
      }
      
      return user;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }
}