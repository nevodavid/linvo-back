import {Global, Module} from '@nestjs/common';
import {ApiModule} from "./api/api.module";

@Global()
@Module({
    imports: [ApiModule],
})
export class ControllersModule {}
