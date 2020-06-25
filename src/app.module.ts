import { Module } from '@nestjs/common';
import {ControllersModule} from "./controllers/controllers.module";
import {PackagesModule} from "./packages/packages.module";
import {ServicesModule} from "./services/services.module";

@Module({
  imports: [ControllersModule, PackagesModule, ServicesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
