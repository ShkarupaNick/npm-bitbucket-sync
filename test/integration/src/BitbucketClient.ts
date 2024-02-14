import { Bitbucket } from 'bitbucket';
import config from './config';
import FormData from 'form-data';


export class BitbucketClient {
    private client;
    private readonly baseUrl = 'https://api.bitbucket.org/2.0';
    private readonly repo_slug: string;
    private readonly workspace: string;

    constructor(repo_slug, workspace) {
        const { AUTH_TOKEN } = config;
        this.repo_slug = repo_slug;
        this.workspace = workspace;
        this.client = new Bitbucket({
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
        } catch (e) {
            // TODO create exception handling with custom error types and without missing errors detail
            console.error(e);
            throw new Error('Can not find the latest commit');
        }
    }

    async readFileContent(commit: string, path: string): Promise<string> {
        try {
            const res = await this.client.source.read({
                repo_slug: this.repo_slug,
                workspace: this.workspace,
                commit,
                path
            });
            return res.data;
        } catch (e) {
            // TODO create exception handling with custom error types and without missing errors detail
            console.error(e);
            throw new Error('Can not load file content');
        }
    }

    async uploadFile(name, content, branchName){
        const form = new FormData();
        form.append(name, content);
        try {
            await this.client.source.createFileCommit({
                _body: form,
                repo_slug: this.repo_slug,
                workspace: this.workspace,
                branch: branchName
            })
        } catch (e) {
            // TODO create exception handling with custom error types and without missing errors detail
            console.error(e);
            throw new Error('Can not create commit with file');
        }
    }

    async createPullRequest(title: string, sourceBranch: string) {
        try {
            const result = await this.client.repositories.createPullRequest({
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
            return result;
        } catch (e) {
            // TODO create exception handling with custom error types and without missing errors detail
            console.error(e);
            throw new Error('Can not create Pull Request');
        }
    }
}
