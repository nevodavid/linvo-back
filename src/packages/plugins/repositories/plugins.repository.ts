import {Injectable} from "@nestjs/common";
import {getManager} from "typeorm";
import * as _ from 'lodash';
import {Plugins} from "../../../controllers/api/validation/create.plugins.dto";

@Injectable()
export class PluginsRepository {
    constructor(
    ) {
    }
    async getList(user: number, domain: string): Promise<any> {
        const pluginList = await getManager().query(`
        SELECT
            plugin_user.id,
            plugins.id as g_id,
            plugins.title,
            plugins.website,
            plugins.description,
            plugins_variables.id as p_id,
            plugin_user_variables.id as variable_id,
            plugins_variables.value as variable_name,
            plugins_variables.description as variable_description,
            plugin_user_variables.value as variable_value
        FROM plugins
        LEFT JOIN plugin_user ON (plugins.id = plugin_user.plugin AND plugin_user.domain = ? AND plugin_user.user = ?)
        LEFT JOIN plugins_variables ON (plugins_variables.plugin = plugins.id)      
        LEFT JOIN plugin_user_variables ON (plugin_user_variables.plugin_variable = plugins_variables.id AND plugin_user.id = plugin_user_variables.plugin_user)  
        `, [domain, user]);

        return Object.values(_.groupBy(pluginList, (g) => g.g_id)).map((current: any) => {
            return {
                id: current[0].g_id,
                title: current[0].title,
                website: current[0].webiste,
                description: current[0].description,
                variables: Object.values(_.groupBy(current, (g) => g.p_id)).map(([{p_id, variable_description: description, variable_id: id, variable_name: name, variable_value: value}]) => ({
                    id: p_id,
                    name,
                    description,
                    value
                }))
            }
        });
    }

    async setPlugins(user: number, domain: string, id: number[]): Promise<Array<{id: number, plugin: number}>> {
        const pluginsId = await getManager().query(`SELECT id, plugin FROM plugin_user WHERE \`user\` = ? AND domain = ? AND plugin IN (${id.join(',')})`, [user, domain]);
        const foundedId = pluginsId.map(p => p.plugin);
        const toBeAdded = id.filter(f => foundedId.indexOf(f) === -1);
        const query = `INSERT INTO plugin_user(\`user\`, \`plugin\`, \`domain\`, \`active\`) VALUES${toBeAdded.map(() => '(?,?,?,?)').join(',')}
        `;

        if (toBeAdded.length) {
            await getManager().query(query, [...toBeAdded.reduce((all, t) => ([...all, ...[user, t, domain, true]]), [])]);
        }

        return [
            ...pluginsId
        ]
    }

    async setVariables(user: number, domain: string, plugins: Plugins[]) {
        const variableDestruct = plugins.reduce((all, current) => {
            all.push(...current.variables.map(p => ({
                ...p,
                pluginId: current.id
            })));

            return all;
        }, []);

        const query = `
        INSERT INTO plugin_user_variables (plugin_user, plugin_variable, \`value\`)
        SELECT plugin_user.id,
        plugins_variables.id,
        CASE plugins_variables.id
        ${variableDestruct.map(p => ` WHEN ${p.id} THEN ?`).join(' ')}
        ELSE ''
        END
        FROM plugin_user
        LEFT JOIN plugins_variables ON (plugins_variables.plugin = plugin_user.plugin)
        WHERE plugin_user.plugin IN (${plugins.map(p => p.id).join(',')}) AND plugin_user.domain = ?
        ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)
        `;

        await getManager().query(query, [...variableDestruct.reduce((all, p) => ([...all, p.value]), []), domain]);
    }

    async createUpdate(id: number, domain: string, plugins: Plugins[]) {
        await this.setPlugins(id, domain, plugins.map(p => p.id));
        await this.setVariables(id, domain, plugins);
    }

    async getScripts(id: number, domain: string) {
        const plugins = await getManager().query(`
SELECT plugins.id, plugins.title, plugins.script, plugins_variables.value as variable_name, plugin_user_variables.value as variable_value FROM plugin_user
INNER JOIN plugins ON (plugin_user.plugin = plugins.id)
LEFT JOIN plugins_variables ON (plugin_user.plugin = plugins_variables.plugin)
LEFT JOIN plugin_user_variables ON (plugin_user.id = plugin_user_variables.plugin_user AND plugins_variables.id = plugin_user_variables.plugin_variable)
WHERE plugin_user.plugin NOT IN (
     SELECT plugin_user.plugin FROM plugin_user
     INNER JOIN plugins ON (plugin_user.plugin = plugins.id)
     LEFT JOIN plugins_variables ON (plugins_variables.plugin = plugins.id)
     LEFT JOIN plugin_user_variables on (plugin_user_variables.plugin_user = plugin_user.id and plugins_variables.id = plugin_user_variables.plugin_variable)
     WHERE (plugin_user_variables.value IS NULL OR plugin_user_variables.value = '') AND plugin_user.user = ${id} AND plugin_user.domain = ?
     GROUP BY plugin_user.plugin
) AND
plugin_user.user = ${id} AND plugin_user.domain = ?
GROUP BY plugin_user.plugin, plugin_user_variables.id
`, [domain, domain]);

        return Object.values(_.groupBy(plugins, (g) => g.id));
    }
}
