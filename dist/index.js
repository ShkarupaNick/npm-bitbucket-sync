"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const BitbucketClient_1 = require("./BitbucketClient");
const config_1 = __importDefault(require("./config"));
function updatePackageVersion(fileContent, packageName, packageVersion) {
    try {
        const packageJSON = JSON.parse(fileContent);
        packageJSON.dependencies[packageName] = packageVersion;
        return JSON.stringify(packageJSON, null, 2);
    }
    catch (error) {
        // TODO add exception handling here
        console.error('Error parsing package.json:', error);
        return fileContent;
    }
}
async function start() {
    try {
        // TODO Possibly we can read these parameters from arguments
        const { PACKAGE_WORKSPACE, PACKAGE_NAME, PACKAGE_VERSION } = config_1.default;
        const client = new BitbucketClient_1.BitbucketClient(PACKAGE_NAME, PACKAGE_WORKSPACE);
        const branchName = `update-${PACKAGE_NAME}-to-${PACKAGE_VERSION}`;
        const latestHash = await client.getLatestCommit();
        const packageJson = await client.readFileContent(latestHash, 'package.json');
        const updatedPackageJson = updatePackageVersion(packageJson, PACKAGE_NAME, PACKAGE_VERSION);
        // We do not need to create a branch in separate API request. This call will create new branch with new file version.
        await client.uploadFile('package.json', updatedPackageJson, branchName);
        const pr = await client.createPullRequest(`Update package ${PACKAGE_NAME} to the version ${PACKAGE_VERSION}`, branchName);
        console.log(pr);
    }
    catch (err) {
        console.error(err, 'Cannot start application');
        process.exit(2);
    }
}
exports.start = start;
start();
//# sourceMappingURL=index.js.map