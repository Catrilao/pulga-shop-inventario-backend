import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserPayload {
  id: number;
  email: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: UserPayload }>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
