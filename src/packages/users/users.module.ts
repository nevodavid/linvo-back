import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRepository} from "./repositories/user.repository";
import {UserService} from "./services/user.service";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([UserRepository])],
    controllers: [],
    providers: [UserService],
    exports: [UserService],
})
export class UsersModule {}
