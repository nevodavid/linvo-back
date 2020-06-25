import {HttpStatus, Injectable, NestMiddleware} from '@nestjs/common';
import { Request, Response } from 'express';
import {UserService} from "../../../packages/users/services/user.service";

@Injectable()
export class LoggedMiddleware implements NestMiddleware {
    constructor(private _userService: UserService) {
    }
    use(req: Request, res: Response, next: Function) {
        if (!req.headers.authentication) {
            res.status(HttpStatus.UNAUTHORIZED).send();
            return ;
        }


        (async () => {
            try {
                const verify = await this._userService.verify(String(req.headers.authentication));
                if (!verify) {
                    res.status(HttpStatus.UNAUTHORIZED).send();
                    return;
                }

                // @ts-ignore
                req.user = verify;
                next();
            }
            catch (e) {
                res.status(HttpStatus.UNAUTHORIZED).send();
                return;
            }
        })();
    }
}
