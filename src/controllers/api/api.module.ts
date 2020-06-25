import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AuthController} from "./auth.controller";
import {EventsController} from "./events.controller";
import {WidgetsController} from "./widgets.controller";
import {LoggedMiddleware} from "./middlewares/logged.middleware";
import {InteractionsController} from "./interactions.controller";
import {ShopifyControllers} from "./shopify.controllers";
import {PluginsController} from "./plugins.controller";

@Module({
    imports: [],
    controllers: [AuthController, EventsController, WidgetsController, InteractionsController, ShopifyControllers, PluginsController]
})
export class ApiModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggedMiddleware)
            .forRoutes(EventsController, WidgetsController, PluginsController);
    }
}
