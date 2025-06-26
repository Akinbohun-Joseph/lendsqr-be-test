/*import { Request, Response } from 'express';
import Joi from 'joi';
import { UserService } from '../services/UserService';

 const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  first_name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2).required(),
  phone: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const register = async (req: Request, res: Response) => {
    try {
      const { error, value } = registerSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Check if user already exists
      const existingUser = await UserService.findByEmail(value.email);
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      const user = await UserService.create(value);
      const { password_hash, ...userResponse } = user;

      res.status(201).json({
        message: 'User created successfully',
        user: userResponse,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  export const login = async (req: Request, res: Response) => {
    try {
      const { error, value } = loginSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const result = await UserService.authenticate(value.email, value.password);
      
      if (!result) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const { password_hash, ...userResponse } = result.user;

      res.json({
        message: 'Login successful',
        user: userResponse,
        token: result.token,
      });
    } catch (error) {
      if (error.message === 'User is blacklisted') {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };*/

  
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { UserService } from '../services/UserService';

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  first_name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2).required(),
  phone: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = registerSchema.validate(req.body);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const existingUser = await UserService.findByEmail(value.email);
  if (existingUser) {
     res.status(409).json({ error: 'User already exists' });
     return;
  }

  const user = await UserService.create(value);
  const { password_hash, ...userResponse } = user;

   res.status(201).json({
    message: 'User created successfully',
    user: userResponse,
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
     res.status(400).json({ error: error.details[0].message });
     return;
  }

  try {
    const result = await UserService.authenticate(value.email, value.password);
    if (!result) {
       res.status(401).json({ error: 'Invalid credentials' });
       return;
    }

    const { password_hash, ...userResponse } = result.user;

     res.status(200).json({
      message: 'Login successful',
      user: userResponse,
      token: result.token,
    });
  } catch (err: any) {
    if (err.message === 'User is blacklisted') {
       res.status(403).json({ error: err.message });
       return;
    }

     res.status(500).json({ error: err.message });
  }
};
