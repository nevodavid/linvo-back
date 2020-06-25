import * as mongoose from "mongoose";
import '../../../services/database/mongodb.service';

const EventsSchema = new mongoose.Schema({
    user: Number,
    domains: [{
        name: String,
        groups: [{
            id: String,
            groupName: String,
            eventToolOpen: Boolean,
            isSyncedWithServer: Boolean,
            events: [{
                id: String,
                picture: String,
                url: String,
                match: String
            }]
        }]
    }]
});

interface Events extends mongoose.Document {
    user: number,
    domains: Array<{
        name: string,
        groups: Array<{
            id: string,
            groupName: string,
            eventToolOpen: boolean,
            isSyncedWithServer: boolean,
            events: Array<{
                id: string,
                picture: string,
                url: string,
                match: string
            }>
        }>
    }>
}

const EventEntity = mongoose.model<Events>('Events', EventsSchema);
export default EventEntity;
