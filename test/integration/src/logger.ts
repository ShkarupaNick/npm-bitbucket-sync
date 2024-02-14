import { LogLevel } from 'bunyan';
import { createLogger } from 'bunyan';
import config from './config';


export default createLogger({
    name: 'npm-bitbucket-sync',
    level: config.LOG_LEVEL as LogLevel,
    PACKAGE_WORKSPACE: config.PACKAGE_WORKSPACE,
    PACKAGE_NAME: config.PACKAGE_NAME,
    PACKAGE_VERSION: config.PACKAGE_VERSION
});
