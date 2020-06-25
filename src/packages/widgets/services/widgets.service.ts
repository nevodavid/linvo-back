import {Injectable} from "@nestjs/common";
import {WidgetsRepository} from "../repositories/widgets.repository";
import {CreateWidgetDto} from "../../../controllers/api/validation/create.widget.dto";
import {UserEntity} from "../../users/entities/user.entity";
import {UploadService} from "../../../services/uploads/upload.service";

@Injectable()
export class WidgetsService {
    constructor(
        private _widgetsRepository: WidgetsRepository,
        private _uploadService: UploadService
    ) {
    }

    uploadUrls(widget: CreateWidgetDto) {
        const regexes = widget.text.match(/src="(data:image\/[^;]+;base64[^"]+)"/);
        if (!regexes || !regexes.length) {
            return widget;
        }

        return regexes.map(current => {
            return {
                current,
                url: this._uploadService.upload(current)
            };
        }).reduce((all, current) => {
            all.text = all.text.replace(current.current, `src="${current.url}"`);
            return all;
        }, widget);
    }

    async createWidget(user: UserEntity, widget: CreateWidgetDto) {
        const widgetWithUrls = this.uploadUrls(widget);
        return this._widgetsRepository.createWidget(String(user.id), widgetWithUrls);
    }

    async updateWidget(user: UserEntity, id: string, event: CreateWidgetDto) {
        const widgetWithUrls = this.uploadUrls(event);
        return this._widgetsRepository.updateWidget(user, id, widgetWithUrls);
    }

    async deleteWidget(user: UserEntity, id: string) {
        return this._widgetsRepository.deleteWidget(user, id);
    }

    getAll(id: string) {
        return this._widgetsRepository.getAll(id);
    }
}
