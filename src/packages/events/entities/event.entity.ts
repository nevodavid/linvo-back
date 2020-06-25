import * as mongoose from "mongoose";
import '../../../services/database/mongodb.service';
import {Widget} from "../../widgets/entities/widget.entity";
import mongoose_delete from "mongoose-delete";

export const EventsSchema = new mongoose.Schema({
    id: String,
    picture: String,
    url: String,
    match: String,
    order: Number
}, {strict: false});

EventsSchema.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt : true });

export const EventsGroupSchema = new mongoose.Schema({
    user: String,
    domain: String,
    id: String,
    groupName: String,
    eventToolOpen: Boolean,
    isSyncedWithServer: Boolean,
    views: Number,
    hits: Number,
    widget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Widgets'
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events'
    }]
}, {strict: false});

EventsGroupSchema.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt : true });

export interface Event extends mongoose.Document {
    id: string,
    picture: string,
    url: string,
    match: string,
    order: number
}

export interface EventsGroup extends mongoose.Document {
    user: string,
    domain: string,
    id: string,
    groupName: string,
    eventToolOpen: boolean,
    isSyncedWithServer: boolean,
    views: number,
    hits: number,
    widget?: Widget,
    events: Event[]
}
