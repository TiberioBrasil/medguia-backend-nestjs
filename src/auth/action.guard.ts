import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Profile } from '../profiles/entities/profile.entity';
import { User } from '../users/entities/user.entity';
import { EntityManager } from 'typeorm';

/* eslint-disable-next-line */
export const RequireAction = (action: string) =>
  SetMetadata('auth.action', action);

export class ActionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targetAction = this.reflector.get<string>(
      'auth.action',
      context.getHandler(),
    );

    if (!targetAction) {
      return true;
    }

    const { url, method, user } = context.switchToHttp().getRequest();

    const { profileId } = await this.entityManager.findOneOrFail(
      User,
      user.id,
      {
        select: ['profileId'],
      },
    );

    const { actions } = await this.entityManager.findOneOrFail(
      Profile,
      profileId,
      {
        relations: ['actions'],
      },
    );

    if (
      (await actions).find(
        ({ action }) => action.toLowerCase() === targetAction.toLowerCase(),
      ) === undefined
    ) {
      console.log(
        { url, method, userId: user.id, action: targetAction },
        'A user tried to perform an action it was not allowed to',
      );
      throw new ForbiddenException(
        "You're not authorized to use this resource",
      );
    }

    return true;
  }
}
