import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Widget} from "../entities/widget.entity";
import {CreateWidgetDto} from "../../../controllers/api/validation/create.widget.dto";
import {UserEntity} from "../../users/entities/user.entity";

@Injectable()
export class WidgetsRepository {
    constructor(
        @InjectModel('Widgets') private _widgetsModel: Model<Widget>,
    ) {
    }

    createWidget(user: string, widget: CreateWidgetDto) {
        const widgetModel = new this._widgetsModel({
            id: widget.id,
            user,
            title: widget.title,
            type: widget.type,
            text: widget.text,
            domain: widget.domain
        });

        return this._widgetsModel.create(widgetModel);
    }

    async updateWidget(user: UserEntity, id: string, widget: CreateWidgetDto) {
        await this._widgetsModel.updateOne({
            user: String(user.id),
            id: widget.id
        }, {
            id: widget.id,
            title: widget.title,
            type: widget.type,
            text: widget.text,
            domain: widget.domain
        });

        return this._widgetsModel.findOne({
            id: widget.id
        });
    }

    async deleteWidget(user: UserEntity, id: string) {
        const widget = await this._widgetsModel.findOne({
            id,
            user: String(user.id)
        });

        // @ts-ignore
        widget.delete();
        return widget;
    }

    getAll(user: string) {
        return this._widgetsModel.find({
            user
        });
    }
}
