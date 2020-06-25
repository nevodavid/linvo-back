import {Body, Controller, Get, Param, Post, Query, Req, Res} from "@nestjs/common";
import {EventsService} from "../../packages/events/services/events.service";
import {Request} from "express";
import {EmailService} from "../../services/email/email.service";

@Controller('/interactions')
export class InteractionsController {
    constructor(
        private _eventsService: EventsService,
        private _emailService: EmailService
    ) {
    }

    @Get('/:id')
    async getPageEvents(@Param('id') id: string, @Req() request: Request) {
        const domain = String(request.headers.origin);
        const events = await this._eventsService.getPageEvents(id, domain);
        return events || {events: []};
    }

    @Get('/:id/widget')
    getWidgetByEventId(
        @Param('id') id: string
    ) {
        return this._eventsService.getWidgetByEventId(id);
    }

    @Get('/:id/video')
    async showVideo(
        @Param('id') id: string,
        @Query('video') video: string,
        @Res() res: any
    ) {
        const eventGroup = await this._eventsService.getPageEventsById(id);
        const images = eventGroup[0].events.map(e => `<div style="background: white; display: inline;"><img style="margin-top: 10px; padding: 10px; margin-left: 20px; border: 1px solid black; float: left;" src='${e.picture}' /></div>`).join(' ');
        const page = `
        <html><head><title>Video</title></head><body>
        <div style="padding: 20px">
            <h1 style="margin-left: 20px">${eventGroup[0].groupName}</h1>
            <div style="margin-left: 20px; float: left; clear: both;">
                Watch Video: <a href="#" onclick="window.open('${Buffer.from(video, 'base64').toString()}', '', 'width=' + window.innerWidth + ',height=' + window.innerHeight)">Click</a>
            </div>
            <div style="float: left; clear: both;">
                ${images}
            </div>
        </div>
        </body></html>
        `;

        res.status(200).send(page);
    }

    @Post('/:id/clicked')
    widgetClicked(
        @Param('id') id: string,
        @Body() body: {video?: string}
    ) {
        if (body.video) {
            this._emailService.send(['nevo@linvo.io'], 'New Video', {
                html: `https://api.linvo.io/interactions/${id}/video?video=${body.video}`
            }, {});
        }
        return this._eventsService.widgetClicked(id);
    }
}
