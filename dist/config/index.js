"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const nconf_1 = __importDefault(require("nconf"));
const path_1 = require("path");
const DEFAULTS = __importStar(require("./default.json"));
class Config {
    constructor() {
        const ENVIRONMENT = process.env.NODE_ENV;
        nconf_1.default.env({ parseValues: true });
        nconf_1.default.file({ file: (0, path_1.resolve)(__dirname, `${ENVIRONMENT}.json`) });
        nconf_1.default.defaults(DEFAULTS);
        this.nconf = nconf_1.default;
        this.validateEnvironmentVariables();
    }
    validateEnvironmentVariables() {
        const requiredVariables = ['AUTH_TOKEN', 'PACKAGE_WORKSPACE', 'PACKAGE_NAME', 'PACKAGE_VERSION'];
        for (const variable of requiredVariables) {
            if (!this.nconf.get(variable)) {
                throw new Error(`Missing required environment variable: ${variable}`);
            }
        }
    }
    get AUTH_TOKEN() {
        return this.nconf.get('AUTH_TOKEN');
    }
    get PACKAGE_WORKSPACE() {
        return this.nconf.get('PACKAGE_WORKSPACE');
    }
    get PACKAGE_NAME() {
        return this.nconf.get('PACKAGE_NAME');
    }
    get PACKAGE_VERSION() {
        return this.nconf.get('PACKAGE_VERSION');
    }
}
exports.Config = Config;
exports.default = new Config();
//# sourceMappingURL=index.js.map