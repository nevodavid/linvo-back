import {Body, Controller, Get, Param, Post, Req} from "@nestjs/common";
import {Request} from "express";
import {PluginsService} from "../../packages/plugins/services/plugins.service";
import {UserFromRequest} from "../../services/auth/user.from.request";
import {UserEntity} from "../../packages/users/entities/user.entity";
import {Plugins} from "./validation/create.plugins.dto";

@Controller('/plugins')
export class PluginsController {
    constructor(
        private _pluginsService: PluginsService,
    ) {
    }

    @Get('/')
    async getPlugins(@UserFromRequest() user: UserEntity, @Param('id') id: string, @Req() request: Request) {
        const domain = String(request.headers.domain);
        return this._pluginsService.getList(user.id, domain);
    }

    @Post('/')
    async savePlugins(
        @UserFromRequest() user: UserEntity,
        @Body() plugins: Plugins[],
        @Req() request: Request
    ) {
        const domain = String(request.headers.domain);
        return this._pluginsService.createUpdate(user.id, domain, plugins);
    }
}
