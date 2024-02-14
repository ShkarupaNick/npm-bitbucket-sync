import nconf, { Provider } from 'nconf';
import { resolve } from 'path';
import * as DEFAULTS from './default.json';

export class Config {
    protected nconf: Provider;
    public constructor() {
        const ENVIRONMENT = process.env.NODE_ENV;
        nconf.env({ parseValues: true });
        nconf.file({ file: resolve(__dirname, `${ENVIRONMENT}.json`) });
        nconf.defaults(DEFAULTS);

        this.nconf = nconf;
        this.validateEnvironmentVariables();
    }

    private validateEnvironmentVariables() {
        const requiredVariables = ['AUTH_TOKEN', 'PACKAGE_WORKSPACE', 'PACKAGE_NAME', 'PACKAGE_VERSION'];

        for (const variable of requiredVariables) {
            if (!this.nconf.get(variable)) {
                throw new Error(`Missing required environment variable: ${variable}`);
            }
        }
    }

    public get LOG_LEVEL(): string {
        return this.nconf.get('LOG_LEVEL');
    }

    public get AUTH_TOKEN(): string {
        return this.nconf.get('AUTH_TOKEN');
    }

    public get PACKAGE_WORKSPACE(): string {
        return this.nconf.get('PACKAGE_WORKSPACE');
    }

    public get PACKAGE_NAME(): string {
        return this.nconf.get('PACKAGE_NAME');
    }

    public get PACKAGE_VERSION(): string {
        return this.nconf.get('PACKAGE_VERSION');
    }
}

export default new Config();
