import { TypeOrmModule } from '@nestjs/typeorm';
import {config} from "../../config";

const MysqlService = TypeOrmModule.forRoot({
    type: 'mysql',
    host: config.mysql.host,
    port: config.mysql.port,
    username: config.mysql.username,
    password: config.mysql.password,
    database: config.mysql.database,
    entities: ["packages/**/entities/*.entity{.ts,.js}"],
    synchronize: true,
})

export default MysqlService;
