import { inject, injectable } from 'tsyringe';
import { User } from '../models/User';
import { CreateUserDto, UpdateUserDto } from '../schemas/UserSchema';
import { IUserRepository, IUserService } from '../types/interfaces';
import { NotFoundError, ConflictError } from '../utils/errors';
import { logger } from '../utils/logger';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      const user = await this.userRepository.create(userData);
      logger.info(`User service: Created user ${user.id}`);
      return user;
    } catch (error) {
      logger.error('Error in createUser service:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      logger.error(`Error in getUserById service for ID ${id}:`, error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundError(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      logger.error(`Error in getUserByEmail service for email ${email}:`, error);
      throw error;
    }
  }

  async getAllUsers(limit = 10, offset = 0): Promise<User[]> {
    try {
      return await this.userRepository.findAll(limit, offset);
    } catch (error) {
      logger.error('Error in getAllUsers service:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    try {
      if (userData.email) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser && existingUser.id !== id) {
          throw new ConflictError('Email already in use by another user');
        }
      }

      const user = await this.userRepository.update(id, userData);
      if (!user) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }

      logger.info(`User service: Updated user ${id}`);
      return user;
    } catch (error) {
      logger.error(`Error in updateUser service for ID ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const deleted = await this.userRepository.delete(id);
      if (!deleted) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }
      logger.info(`User service: Deleted user ${id}`);
    } catch (error) {
      logger.error(`Error in deleteUser service for ID ${id}:`, error);
      throw error;
    }
  }
}
