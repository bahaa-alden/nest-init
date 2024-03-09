import { Request } from 'express';
import { User } from '../models/users';

export type RequestWithUser = Request & { user: User };
