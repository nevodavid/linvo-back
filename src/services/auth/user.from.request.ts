import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const UserFromRequest = createParamDecorator((data, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
});
