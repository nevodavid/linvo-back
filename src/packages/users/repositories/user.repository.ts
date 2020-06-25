import {EntityRepository, Repository} from "typeorm";
import {UserEntity} from "../entities/user.entity";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    getUserByEmail(email: string) {
        return this.findOne({
            email
        }, {
            select: ['email', 'id', 'password', 'name']
        })
    }

    getUserById(id: number) {
        return this.findOne({
            id
        });
    }

    createUser(name: string, email: string, password: string): Promise<UserEntity> {
        const user = new UserEntity();
        user.email = email;
        user.password = password;
        user.name = name;

        return this.save(user);
    }
}
