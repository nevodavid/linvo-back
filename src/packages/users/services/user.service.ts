import {Injectable} from "@nestjs/common";
import {AuthService} from "../../../services/auth/auth.service";
import {UserRepository} from "../repositories/user.repository";
import {RegisterValidation} from "../../../controllers/api/validation/register.validation";
import {genSalt, hashSync, compareSync} from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private _authService: AuthService,
        private _userRepository: UserRepository
    ) {
    }

    public async login(email: string, password: string) {
        const userByEmailModel = await this._userRepository.getUserByEmail(email);
        if (!userByEmailModel) {
            return false;
        }

        const compare = compareSync(password, userByEmailModel.password);
        if (!compare) {
            return false;
        }

        delete userByEmailModel.password;
        return {...userByEmailModel, hash: this._authService.generateAuthToken(JSON.parse(JSON.stringify(userByEmailModel)))};
    }

    public async register(credential: RegisterValidation) {
        const salt = await genSalt(10);
        const hash = hashSync(credential.password, salt);

        const checkIfUserExists = await this._userRepository.getUserByEmail(credential.email);
        if (checkIfUserExists) {
            return false;
        }

        const savedUser = JSON.parse(JSON.stringify(await this._userRepository.createUser(credential.fullname, credential.email, hash)));
        return {
            user: savedUser,
            hash: this._authService.generateAuthToken(savedUser)
        }
    }

    public getUserById(id: number) {
        return this._userRepository.getUserById(id);
    }

    public async verify(token: string) {
        const verify = this._authService.decodeToken(token);
        if (!verify) {
            return false;
        }

        // @ts-ignore
        return this.getUserById(verify.id);
    }
}
