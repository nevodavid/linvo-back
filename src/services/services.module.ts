import {Global, Module} from '@nestjs/common';
import MysqlService from "./database/mysql.service";
import {AuthService} from "./auth/auth.service";
import {MorganModule, MorganInterceptor} from "nest-morgan";
import { APP_INTERCEPTOR } from '@nestjs/core';
import MongodbService from "./database/mongodb.service";
import {UploadService} from "./uploads/upload.service";
import {EmailService} from "./email/email.service";

@Global()
@Module({
    imports: [MysqlService, MongodbService, MorganModule.forRoot()],
    controllers: [],
    providers: [EmailService, UploadService, AuthService, {
        provide: APP_INTERCEPTOR,
        useClass: MorganInterceptor('combined'),
    }],
    exports: [EmailService, AuthService, UploadService],
})
export class ServicesModule {}
