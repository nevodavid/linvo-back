import {Injectable} from "@nestjs/common";
import {sign, decode, verify} from 'jsonwebtoken';
import {UserEntity} from "../../packages/users/entities/user.entity";

const hashkey = 'sdfb3iy5398ytwsd!!@#%SDgfasdkjrghv35345345';

@Injectable()
export class AuthService {
    public auth(email: string, password: string) {

    }

    public generateAuthToken(user: UserEntity) {
        return sign(user, hashkey);
    }

    public decodeToken(token: string) {
        return verify(token, hashkey);
    }
}
