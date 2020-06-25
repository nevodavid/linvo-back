import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {CreateWidgetDto} from "./validation/create.widget.dto";
import {WidgetsService} from "../../packages/widgets/services/widgets.service";
import {UserFromRequest} from "../../services/auth/user.from.request";
import {UserEntity} from "../../packages/users/entities/user.entity";

@Controller('/widgets')
export class WidgetsController {
    constructor(
        private _widgetService: WidgetsService
    ) {
    }
    @Post('/')
    createNewGroupEvent(@UserFromRequest() user: UserEntity, @Body() widget: CreateWidgetDto) {
        return this._widgetService.createWidget(user, widget);
    }

    @Put('/:id')
    createNewEvent(@UserFromRequest() user: UserEntity, @Param('id') id: string, @Body() event: CreateWidgetDto) {
        return this._widgetService.updateWidget(user, id, event);
    }

    @Delete('/:id')
    deleteWidgets(@UserFromRequest() user: UserEntity, @Param('id') id: string) {
        return this._widgetService.deleteWidget(user, id);
    }
}
