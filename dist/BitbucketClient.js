"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitbucketClient = void 0;
const bitbucket_1 = require("bitbucket");
const config_1 = __importDefault(require("./config"));
const form_data_1 = __importDefault(require("form-data"));
class BitbucketClient {
    constructor(repo_slug, workspace) {
        this.baseUrl = 'https://api.bitbucket.org/2.0';
        const { AUTH_TOKEN } = config_1.default;
        this.repo_slug = repo_slug;
        this.workspace = workspace;
        this.client = new bitbucket_1.Bitbucket({
            baseUrl: this.baseUrl,
            auth: {
                token: AUTH_TOKEN
            },
            timeout: 60000
        });
    }
    async getLatestCommit() {
        try {
            const { data: { values: [{ hash: latestHash }] } } = await this.client.repositories.listCommits({
                workspace: this.workspace,
                repo_slug: this.repo_slug,
                sort: '-data'
            });
            return latestHash;
        }
        catch (e) {
            // TODO create exception handling with custom error types and without missing errors detail
            console.error(e);
            throw new Error('Can not find the latest commit');
        }
    }
    async readFileContent(commit, path) {
        try {
            const res = await this.client.source.read({
                repo_slug: this.repo_slug,
                workspace: this.workspace,
                commit,
                path
            });
            return res.data;
        }
        catch (e) {
            // TODO create exception handling with custom error types and without missing errors detail
            console.error(e);
            throw new Error('Can not load file content');
        }
    }
    async uploadFile(name, content, branchName) {
        const form = new form_data_1.default();
        form.append(name, content);
        try {
            await this.client.source.createFileCommit({
                _body: form,
                repo_slug: this.repo_slug,
                workspace: this.workspace,
                branch: branchName
            });
        }
        catch (e) {
            // TODO create exception handling with custom error types and without missing errors detail
            console.error(e);
            throw new Error('Can not create commit with file');
        }
    }
    async createPullRequest(title, sourceBranch) {
        try {
            await this.client.repositories.createPullRequest({
                repo_slug: this.repo_slug,
                workspace: this.workspace,
                _body: {
                    title,
                    source: {
                        branch: {
                            name: sourceBranch
                        }
                    }
                }
            });
        }
        catch (e) {
            // TODO create exception handling with custom error types and without missing errors detail
            console.error(e);
            throw new Error('Can not create Pull Request');
        }
    }
}
exports.BitbucketClient = BitbucketClient;
//# sourceMappingURL=BitbucketClient.js.map