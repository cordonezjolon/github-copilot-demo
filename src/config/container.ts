import 'reflect-metadata';
import { container } from 'tsyringe';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../services/UserService';
import { UserController } from '../controllers/UserController';
import { IUserRepository } from '../types/interfaces';

// Register repositories
container.register<IUserRepository>('IUserRepository', {
  useClass: UserRepository,
});

// Register services
container.registerSingleton(UserService);

// Register controllers
container.registerSingleton(UserController);

export { container };
