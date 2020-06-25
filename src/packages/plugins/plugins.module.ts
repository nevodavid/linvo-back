import {Global, Module} from '@nestjs/common';
import {PluginsRepository} from "./repositories/plugins.repository";
import {PluginsService} from "./services/plugins.service";

@Global()
@Module({
    controllers: [],
    providers: [PluginsRepository, PluginsService],
    exports: [PluginsService],
})
export class PluginsModule {}
