import {Injectable} from "@nestjs/common";
import {PluginsRepository} from "../repositories/plugins.repository";
import {Plugins} from "../../../controllers/api/validation/create.plugins.dto";
import {UploadService} from "../../../services/uploads/upload.service";

@Injectable()
export class PluginsService {
    constructor(
        private _pluginRepository: PluginsRepository,
        private _uploadService: UploadService
    ) {
    }
    async getList(id: number, domain: string) {
        return this._pluginRepository.getList(id, domain);
    }

    async createUpdate(id: number, domain: string, plugins: Plugins[]) {
        await this._pluginRepository.createUpdate(id, domain, plugins);
        this.createScript(id, domain);
    }

    async createScript(id: number, domain: string) {
        const information = await this._pluginRepository.getScripts(id, domain);
        const scripts = information.map((current: any) => {
            return `\n/** START ${current[0].title} **/\n` + current.reduce((theScript, toReplace) => {
                return theScript.replace('##' + toReplace.variable_name, toReplace.variable_value) as string;
            },current[0].script as string) + `\n/** END ${current[0].title} **/`;
        }, []);

        this._uploadService.uploadJs(id, domain, scripts.join("\n"));
    }
}
