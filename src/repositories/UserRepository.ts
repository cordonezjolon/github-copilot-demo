import { injectable } from 'tsyringe';
import { User } from '../models/User';
import { CreateUserDto, UpdateUserDto } from '../schemas/UserSchema';
import { IUserRepository } from '../types/interfaces';
import { logger } from '../utils/logger';

@injectable()
export class UserRepository implements IUserRepository {
  async create(userData: CreateUserDto): Promise<User> {
    try {
      const user = await User.create(userData);
      logger.info(`User created with ID: ${user.id}`);
      return user;
    } catch (error) {
      logger.error('Error creating user in repository:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await User.findByPk(id);
    } catch (error) {
      logger.error(`Error finding user by ID ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({ where: { email } });
    } catch (error) {
      logger.error(`Error finding user by email ${email}:`, error);
      throw error;
    }
  }

  async findAll(limit = 10, offset = 0): Promise<User[]> {
    try {
      return await User.findAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      logger.error('Error finding all users:', error);
      throw error;
    }
  }

  async update(id: string, userData: UpdateUserDto): Promise<User | null> {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return null;
      }

      await user.update(userData);
      logger.info(`User updated with ID: ${id}`);
      return user;
    } catch (error) {
      logger.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return false;
      }

      await user.destroy();
      logger.info(`User deleted with ID: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
}
