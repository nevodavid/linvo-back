import {Controller, Response, Get, Post, Body, Res} from '@nestjs/common';
import {LoginValidation} from "./validation/login.validation";
import {RegisterValidation} from "./validation/register.validation";
import {UserService} from "../../packages/users/services/user.service";
import * as HttpStatus from 'http-status-codes';
import {EventsService} from "../../packages/events/services/events.service";
import {WidgetsService} from "../../packages/widgets/services/widgets.service";

@Controller('/auth')
export class AuthController {
    constructor(
        private _userService: UserService,
        private _eventService: EventsService,
        private _widgetService: WidgetsService,
    ) {
    }

    @Post('/login')
    async login(@Res() response, @Body() credential: LoginValidation) {
        const login = await this._userService.login(credential.email, credential.password);
        if (!login) {
            return response.status(HttpStatus.FORBIDDEN).send();
        }

        const events = await this._eventService.getAll(String(login.id));
        const widgets = await this._widgetService.getAll(String(login.id));

        response.json({
            user: login,
            events,
            widgets
        });

    }

    @Post('/register')
    async register(@Response() response, @Body() credential: RegisterValidation) {
        const auth = await this._userService.register(credential);
        if (!auth) {
            return response.status(HttpStatus.CONFLICT).send();
        }

        return response.status(HttpStatus.OK).json({
            ...auth.user,
            hash: auth.hash
        });
    }
}
