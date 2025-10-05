import 'reflect-metadata';
import { UserService } from '../../src/services/UserService';
import { IUserRepository } from '../../src/types/interfaces';
import { User } from '../../src/models/User';
import { CreateUserDto, UpdateUserDto } from '../../src/schemas/UserSchema';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    userService = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    const userData: CreateUserDto = {
      email: 'test@example.com',
      name: 'John Doe',
      age: 25,
      isActive: true,
    };

    it('should create user successfully', async () => {
      const mockUser = { id: '123', ...userData } as User;
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(userData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictError if email already exists', async () => {
      const existingUser = { id: '123', ...userData } as User;
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(userService.createUser(userData)).rejects.toThrow('User with this email already exists');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
      } as User;
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById('123');

      expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundError if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.getUserById('123')).rejects.toThrow('User with ID 123 not found');
    });
  });

  describe('updateUser', () => {
    const updateData: UpdateUserDto = {
      name: 'Jane Doe',
      age: 30,
    };

    it('should update user successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Jane Doe',
        age: 30,
      } as User;
      mockUserRepository.update.mockResolvedValue(mockUser);

      const result = await userService.updateUser('123', updateData);

      expect(mockUserRepository.update).toHaveBeenCalledWith('123', updateData);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundError if user not found', async () => {
      mockUserRepository.update.mockResolvedValue(null);

      await expect(userService.updateUser('123', updateData)).rejects.toThrow('User with ID 123 not found');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockUserRepository.delete.mockResolvedValue(true);

      await userService.deleteUser('123');

      expect(mockUserRepository.delete).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundError if user not found', async () => {
      mockUserRepository.delete.mockResolvedValue(false);

      await expect(userService.deleteUser('123')).rejects.toThrow('User with ID 123 not found');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', name: 'User 1', age: 25 },
        { id: '2', email: 'user2@example.com', name: 'User 2', age: 30 },
      ] as User[];
      mockUserRepository.findAll.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(mockUserRepository.findAll).toHaveBeenCalledWith(10, 0);
      expect(result).toEqual(mockUsers);
    });
  });
});
