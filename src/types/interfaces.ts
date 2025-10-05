import { User } from '../models/User';
import { CreateUserDto, UpdateUserDto } from '../schemas/UserSchema';

export interface IUserRepository {
  create(userData: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(limit?: number, offset?: number): Promise<User[]>;
  update(id: string, userData: UpdateUserDto): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

export interface IUserService {
  createUser(userData: CreateUserDto): Promise<User>;
  getUserById(id: string): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
  getAllUsers(limit?: number, offset?: number): Promise<User[]>;
  updateUser(id: string, userData: UpdateUserDto): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
