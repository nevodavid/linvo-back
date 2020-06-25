import {Body, Controller, Delete, Get, Param, Post, Req} from "@nestjs/common";
import {CreateGroupDto, UpdateEvent} from "./validation/create.event.dto";
import {EventsService} from "../../packages/events/services/events.service";
import {Request} from 'express';
import {UserFromRequest} from "../../services/auth/user.from.request";
import {UserEntity} from "../../packages/users/entities/user.entity";

@Controller('/events')
export class EventsController {
    constructor(
        private _eventsService: EventsService
    ) {
    }
    @Post('/')
    createNewGroupEvent(@UserFromRequest() user: UserEntity, @Body() event: CreateGroupDto) {
        return this._eventsService.createEvent(user, event);
    }

    @Post('/:groupId')
    createNewEvent(@Param('groupId') id: number, @Body() event: UpdateEvent) {
        return this._eventsService.updateEvents(id, event);
    }

    @Delete('/:groupId')
    deleteGroup(@UserFromRequest() user: UserEntity, @Param('groupId') id: string) {
        return this._eventsService.deleteEvent(user, id);
    }

    @Get('/:id')
    getGroupId(
        @UserFromRequest() user: UserEntity,
        @Param('id') id: string
    ) {
        return this._eventsService.getGroupById(user, id);
    }

    @Get('/:id/widget')
    getWidgetByEventId(
        @Param('id') id: string
    ) {
        return this._eventsService.getWidgetByEventId(id);
    }
}
