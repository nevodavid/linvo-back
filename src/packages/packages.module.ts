import {Global, Module} from '@nestjs/common';
import {UsersModule} from "./users/users.module";
import {EventsModule} from "./events/events.module";
import {WidgetsModule} from "./widgets/widgets.module";
import {PluginsModule} from "./plugins/plugins.module";

@Global()
@Module({
    imports: [UsersModule, WidgetsModule, EventsModule, PluginsModule],
    controllers: [],
    providers: [],
})
export class PackagesModule {}
