import {Injectable} from "@nestjs/common";
import {EventsRepository} from "../repositories/events.repository";
import {CreateGroupDto, UpdateEvent} from "../../../controllers/api/validation/create.event.dto";
import {UserEntity} from "../../users/entities/user.entity";
import {UploadService} from "../../../services/uploads/upload.service";

@Injectable()
export class EventsService {
    constructor(
        private _eventsRepository: EventsRepository,
        private _uploadService: UploadService
    ) {
    }
    async createEvent(user: UserEntity, event: CreateGroupDto) {
        return this._eventsRepository.createEventGroup(user.id, event);
    }

    async updateEvents(id: number, event: UpdateEvent) {
        event.events = event.events.map(event => ({
            ...event,
            picture: event.picture.indexOf('.jpeg') === -1 ? this._uploadService.upload(event.picture) : event.picture
        }));

        return this._eventsRepository.updateEventGroup(id, event);
    }

    async deleteEvent(user: UserEntity, id: string) {
        return this._eventsRepository.deleteEventGroup(user, id);
    }

    async getGroupById(user: UserEntity, id: string) {
        return this._eventsRepository.getGroupById(user, id);
    }

    async getPageEvents(id: string, domain: string) {
        const modified = domain.replace('http://', '').replace('https://', '');
        return this._eventsRepository.getPageEvents(id, modified);
    }

    async getPageEventsById(id: string) {
        return this._eventsRepository.getPageEventsById(id);
    }

    async getWidgetByEventId(event: string) {
        return this._eventsRepository.getWidgetByEventId(event);
    }

    async widgetClicked(event: string) {
        return this._eventsRepository.widgetClicked(event);
    }

    async getAll(userId: string) {
        return this._eventsRepository.getAll(userId);
    }
}
