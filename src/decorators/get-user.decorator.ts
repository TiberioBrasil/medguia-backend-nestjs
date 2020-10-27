import { createParamDecorator } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

export const GetUserID = createParamDecorator(
  (data, req): Partial<User> => {
    return req.args[0].user.id;
  },
);
