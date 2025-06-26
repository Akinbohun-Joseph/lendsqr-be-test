import { Response } from 'express';
import Joi from 'joi';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../types/index';
import { isUserBlacklisted } from '../services/blacklistService';

const updateProfileSchema = Joi.object({
  first_name: Joi.string().min(2).optional(),
  last_name: Joi.string().min(2).optional(),
  phone: Joi.string().optional(),
});

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2).required(),
  phone: Joi.string().optional(),
  bvn: Joi.string().length(11).required(),
});

export class UserController {
  static async createUser(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { error, value } = createUserSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { email, password, first_name, last_name, phone, bvn } = value;

      // Check if user already exists
      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists with this email' });
      }

      // Check blacklist
      const blacklistResult = await isUserBlacklisted(email, bvn);
      if (blacklistResult.isBlacklisted) {
        return res.status(403).json({
          error: 'Registration not allowed',
          reason: blacklistResult.reason,
        });
      }

      // Create user
      const newUser = await UserService.create({
        email,
        password,
        first_name,
        last_name,
        phone,
        bvn,
      });

      // Create response without password_hash
      const userResponse = {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        phone: newUser.phone,
        bvn: newUser.bvn,
        is_blacklisted: newUser.is_blacklisted,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      };

      return res.status(201).json({
        message: 'User created successfully',
        user: userResponse,
      });
    } catch (err) {
      console.error('User creation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return res.status(500).json({ error: errorMessage });
    }
  }

  static async getProfile(req: AuthRequest, res: Response): Promise<Response> {
    try {
      // Check if user exists
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Create profile response without password_hash
      const profile = {
        id: req.user.id,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        phone: req.user.phone,
        bvn: req.user.bvn,
        is_blacklisted: req.user.is_blacklisted,
        created_at: req.user.created_at,
        updated_at: req.user.updated_at,
      };

      return res.json({ profile });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response): Promise<Response> {
    try {
      // Check if user exists
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { error, value } = updateProfileSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const updatedUser = await UserService.updateProfile(req.user.id, value);
      
      // Create profile response without password_hash
      const profile = {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        phone: updatedUser.phone,
        bvn: updatedUser.bvn,
        is_blacklisted: updatedUser.is_blacklisted,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
      };

      return res.json({ profile });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}