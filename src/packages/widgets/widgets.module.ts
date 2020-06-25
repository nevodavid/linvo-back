import {Global, Module} from '@nestjs/common';
import {WidgetsRepository} from "./repositories/widgets.repository";
import {WidgetsService} from "./services/widgets.service";
import {MongooseModule} from "@nestjs/mongoose";
import {WidgetSchema} from "./entities/widget.entity";

@Global()
@Module({
    imports: [MongooseModule.forFeature([{
        name: 'Widgets',
        collection: 'Widgets',
        schema: WidgetSchema
    }])],
    controllers: [],
    providers: [WidgetsRepository, WidgetsService],
    exports: [WidgetsService],
})
export class WidgetsModule {}
