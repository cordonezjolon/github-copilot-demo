import { Router } from 'express';
import { container } from '../config/container';
import { UserController } from '../controllers/UserController';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserIdSchema,
  UserQuerySchema,
} from '../schemas/UserSchema';

const router = Router();
const userController = container.resolve(UserController);

router.post(
  '/',
  validateBody(CreateUserSchema),
  userController.create.bind(userController)
);

router.get(
  '/',
  validateQuery(UserQuerySchema),
  userController.getAll.bind(userController)
);

router.get(
  '/:id',
  validateParams(UserIdSchema),
  userController.getById.bind(userController)
);

router.put(
  '/:id',
  validateParams(UserIdSchema),
  validateBody(UpdateUserSchema),
  userController.update.bind(userController)
);

router.delete(
  '/:id',
  validateParams(UserIdSchema),
  userController.delete.bind(userController)
);

export default router;
