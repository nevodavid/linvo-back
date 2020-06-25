import * as mongoose from "mongoose";
import '../../../services/database/mongodb.service';
import mongoose_delete from "mongoose-delete";

export const WidgetSchema = new mongoose.Schema({
    id: String,
    title: String,
    user:  String,
    text: String,
    type: String,
    domain: String
}, {strict: false});

export interface Widget extends mongoose.Document {
    id: string,
    title: string,
    user: string,
    text: string,
    type: 'pixel' | 'popup',
    domain: string
}

WidgetSchema.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt : true });
