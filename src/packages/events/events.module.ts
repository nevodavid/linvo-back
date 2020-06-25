import {Global, Module} from '@nestjs/common';
import {EventsRepository} from "./repositories/events.repository";
import {EventsService} from "./services/events.service";
import {MongooseModule} from "@nestjs/mongoose";
import {EventsGroupSchema, EventsSchema} from "./entities/event.entity";

@Global()
@Module({
    imports: [MongooseModule.forFeature([{
        name: 'EventsGroup',
        collection: 'EventsGroup',
        schema: EventsGroupSchema
    }, {
        name: 'Events',
        collection: 'Events',
        schema: EventsSchema
    }])],
    controllers: [],
    providers: [EventsRepository, EventsService],
    exports: [EventsService],
})
export class EventsModule {}
