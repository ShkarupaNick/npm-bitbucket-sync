import { BitbucketClient } from './BitbucketClient';
import config from './config';
import logger from './logger';

function updatePackageVersion(fileContent: string, packageName: string, packageVersion: string): string {
    try {
        const packageJSON = JSON.parse(fileContent);
        packageJSON.dependencies[packageName] = packageVersion;
        return JSON.stringify(packageJSON, null, 2);
    } catch (error) {
        // TODO add exception handling here
        console.error('Error parsing package.json:', error);
        return fileContent;
    }
}

export async function start(){
    try {
        // TODO Possibly we can read these parameters from arguments. Implemented them as env vars for now.
        const { PACKAGE_WORKSPACE, PACKAGE_NAME, PACKAGE_VERSION } = config;

        const client = new BitbucketClient(PACKAGE_NAME, PACKAGE_WORKSPACE);
        const branchName = `update-${PACKAGE_NAME}-to-${PACKAGE_VERSION}`;

        logger.debug('Gonna get the latest commit in the repo');
        const latestHash = await client.getLatestCommit();
        logger.trace({ latestHash }, 'Found the latest commit');

        logger.debug('Gonna get the package.json file content');
        const packageJson = await client.readFileContent(latestHash, 'package.json');
        logger.trace({ packageJson }, 'Content loaded');

        logger.debug('Gonna apply changes to the package.json');
        const updatedPackageJson = updatePackageVersion(packageJson, PACKAGE_NAME, PACKAGE_VERSION);


        // We do not need to create a branch in separate API request. This call will create new branch with new file version.
        logger.debug(`Gonna upload new file version to the branch ${branchName}`);
        await client.uploadFile('package.json', updatedPackageJson, branchName);


        logger.debug('Gonna create pull request');
        const { data: { links: { html: { href }}} } = await client.createPullRequest(`Update package ${PACKAGE_NAME} to the version ${PACKAGE_VERSION}`, branchName);
        logger.info(`PR link: ${href}`)
        return href;
    } catch (err) {
        logger.error(err, 'Execution error');
        process.exit(2);
    }
}

start();
