export interface ConfigInterface {
    port: number;
    pluginDirectory: string;
    shopify: {
        API_KEY: string,
        API_SECRET: string,
        SCOPES: string
    }
    upload: {
        save_path: string;
        domain: string;
        url_path: string;
    };

    mysql: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    };
}

export interface ConfigEnvironment {
    development: ConfigInterface;
    stage: ConfigInterface;
    production: ConfigInterface;
}

const configEnv: ConfigEnvironment = {
    development: {
        port: 4000,
        pluginDirectory: 'http://localhost:3001',
        shopify: {
            API_KEY: '',
            API_SECRET: '',
            SCOPES: 'read_script_tags,write_script_tags'
        },
        upload: {
            save_path: '/var/www/uploads',
            domain: 'http://localhost:4000',
            url_path: '/uploads'
        },
        mysql: {
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'linvoapp'
        }
    },
    stage: {
        port: 4000,
        pluginDirectory: '/private/var/www/linvo-app/build/plugin_build',
        shopify: {
            API_KEY: '',
            API_SECRET: '',
            SCOPES: 'read_script_tags,write_script_tags'
        },
        upload: {
            save_path: '/var/www/uploads',
            domain: 'http://localhost:4000',
            url_path: '/uploads'
        },
        mysql: {
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'linvoapp'
        }
    },
    production: {
        port: 4001,
        pluginDirectory: '/var/www/plugin_build',
        shopify: {
            API_KEY: '',
            API_SECRET: '',
            SCOPES: 'read_script_tags,write_script_tags'
        },
        upload: {
            save_path: '/var/www/uploads',
            domain: 'https://api.linvo.io',
            url_path: '/uploads'
        },
        mysql: {
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'linvoapp'
        }
    }
};

export const config: ConfigInterface = configEnv[process.env.NODE_ENV] ? configEnv[process.env.NODE_ENV] : configEnv.development;
