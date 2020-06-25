import {Injectable} from "@nestjs/common";
import {CreateGroupDto, UpdateEvent} from "../../../controllers/api/validation/create.event.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {EventsGroup, Event} from "../entities/event.entity";
import {UserEntity} from "../../users/entities/user.entity";

@Injectable()
export class EventsRepository {
    constructor(
        @InjectModel('Events') private _eventsModel: Model<Event>,
        @InjectModel('EventsGroup') private _eventsGroupModel: Model<EventsGroup>
    ) {
    }
    async createEventGroup(id: number, event: CreateGroupDto): Promise<any> {
        const group = new this._eventsGroupModel({
            user: id,
            domain: event.domain,
            id: event.id,
            views: 0,
            hits: 0,
            groupName: event.groupName,
            eventToolOpen: event.eventToolOpen,
            isSyncedWithServer: true
        });

        return this._eventsGroupModel.create(group);
    }

    async getGroupById(user: UserEntity, id: string) {
        return this._eventsGroupModel.findOne({
            user: String(user.id),
            id
        });
    }

    async deleteEventGroup(user: UserEntity, id: string) {
        const event = await this._eventsGroupModel.findOne({
            user: String(user.id),
            id
        });

        if (event) {
            // @ts-ignore
            event.delete();
        }

        return event;
    }

    async updateEventGroup(id: number, eventList: UpdateEvent) {
        const createNewEvents = eventList.events.filter(e => !e._id).map((event) => {
            return new this._eventsModel({
                id: event.id,
                picture: event.picture,
                url: event.url,
                match: event.match,
                order: event.order
            })
        });

        const writes = [
            ...createNewEvents.map(event => ({
                insertOne: {document: event}
            })),
            ...eventList.events.filter(e => e._id).map((event) => ({
                updateOne: {
                    filter: {_id: event._id},
                    update: {$set: event}
                }
            }))
        ];

        const events = writes.length ? await this._eventsModel.bulkWrite(writes) : {
            result: {
                insertedIds: []
            }
        };

        const mappers = [...events.result.insertedIds, ...eventList.events.filter(e => e._id)];

        await this._eventsGroupModel.updateOne({
            id
        }, {
            $set: {
                ...eventList,
                events: mappers.map(e => e._id),
                ...(eventList.widget) ? {widget: eventList.widget._id as any} : {}
            }
        }, {upsert: true})

        return this._eventsGroupModel.findOne({
            id
        }).populate({path: 'events', options: {sort: {order: 'asc'}}}).populate('widget');
    }

    async getPageEvents(id: string, domain: string) {
        return this._eventsGroupModel.find({
            user: id,
            domain
        }).populate({path: 'events', options: {sort: {order: 'asc'}}});
    }

    async getPageEventsById(id: string) {
        return this._eventsGroupModel.find({
            id
        }).populate({path: 'events', options: {sort: {order: 'asc'}}});
    }

    async getWidgetByEventId(id: string) {
        const widget = await this._eventsGroupModel.findOne({
            id
        }).populate('widget');

        this._eventsGroupModel.updateOne({
            id,
        }, {
            $inc: {
                views: 1
            }
        }).then(() => ({}));

        return widget.widget;
    }

    async widgetClicked(id: string) {
        return this._eventsGroupModel.updateOne({
            id,
        }, {
            $inc: {
                hits: 1
            }
        }).then(() => ({}));
    }

    async getAll(id: string) {
        return this._eventsGroupModel.find({
            user: id,
        }).populate({path: 'events', options: {sort: {order: 'asc'}}}).populate('widget');
    }
}
