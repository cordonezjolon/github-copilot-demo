import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { UserService } from '../services/UserService';
import { ResponseHandler } from '../utils/response';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from '../schemas/UserSchema';

@injectable()
export class UserController {
  constructor(private userService: UserService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = req.body as CreateUserDto;
      const user = await this.userService.createUser(userData);
      ResponseHandler.created(res, user, 'User created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      ResponseHandler.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit, offset } = req.query as unknown as UserQueryDto;
      const users = await this.userService.getAllUsers(limit, offset);
      ResponseHandler.success(res, users);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userData = req.body as UpdateUserDto;
      const user = await this.userService.updateUser(id, userData);
      ResponseHandler.success(res, user, 200, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);
      ResponseHandler.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}
