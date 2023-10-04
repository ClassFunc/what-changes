/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

        /***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
            const os = __importStar(__nccwpck_require__(2037));
            const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

        /***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
            const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
            const utils_1 = __nccwpck_require__(5278);
            const os = __importStar(__nccwpck_require__(2037));
            const path = __importStar(__nccwpck_require__(1017));
            const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
            const fs = __importStar(__nccwpck_require__(7147));
            const os = __importStar(__nccwpck_require__(2037));
            const uuid_1 = __nccwpck_require__(5840);
            const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

        /***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
            const http_client_1 = __nccwpck_require__(6255);
            const auth_1 = __nccwpck_require__(5526);
            const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

        /***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
            const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

        /***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
            const os_1 = __nccwpck_require__(2037);
            const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

        /***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

        /***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

        /***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
            const http = __importStar(__nccwpck_require__(3685));
            const https = __importStar(__nccwpck_require__(5687));
            const pm = __importStar(__nccwpck_require__(9835));
            const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
    readBodyBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const chunks = [];
                this.message.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                this.message.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

        /***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        try {
            return new URL(proxyVar);
        }
        catch (_a) {
            if (!proxyVar.startsWith('http://') && !proxyVar.startsWith('https://'))
                return new URL(`http://${proxyVar}`);
        }
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

        /***/ 9417:
        /***/ ((module) => {

"use strict";

            module.exports = balanced;

            function balanced(a, b, str) {
                if (a instanceof RegExp) a = maybeMatch(a, str);
                if (b instanceof RegExp) b = maybeMatch(b, str);

                var r = range(a, b, str);

                return r && {
                    start: r[0],
                    end: r[1],
                    pre: str.slice(0, r[0]),
                    body: str.slice(r[0] + a.length, r[1]),
                    post: str.slice(r[1] + b.length)
                };
            }

            function maybeMatch(reg, str) {
                var m = str.match(reg);
                return m ? m[0] : null;
            }

            balanced.range = range;

            function range(a, b, str) {
                var begs, beg, left, right, result;
                var ai = str.indexOf(a);
                var bi = str.indexOf(b, ai + 1);
                var i = ai;

                if (ai >= 0 && bi > 0) {
                    if (a === b) {
                        return [ai, bi];
                    }
                    begs = [];
                    left = str.length;

                    while (i >= 0 && !result) {
                        if (i == ai) {
                            begs.push(i);
                            ai = str.indexOf(a, i + 1);
                        } else if (begs.length == 1) {
                            result = [begs.pop(), bi];
                        } else {
                            beg = begs.pop();
                            if (beg < left) {
                                left = beg;
                                right = bi;
                            }

                            bi = str.indexOf(b, i + 1);
                        }

                        i = ai < bi && ai >= 0 ? ai : bi;
                    }

                    if (begs.length) {
                        result = [left, right];
                    }
                }

                return result;
            }


            /***/
        }),

        /***/ 3717:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var concatMap = __nccwpck_require__(6891);
            var balanced = __nccwpck_require__(9417);

            module.exports = expandTop;

            var escSlash = '\0SLASH' + Math.random() + '\0';
            var escOpen = '\0OPEN' + Math.random() + '\0';
            var escClose = '\0CLOSE' + Math.random() + '\0';
            var escComma = '\0COMMA' + Math.random() + '\0';
            var escPeriod = '\0PERIOD' + Math.random() + '\0';

            function numeric(str) {
                return parseInt(str, 10) == str
                  ? parseInt(str, 10)
                  : str.charCodeAt(0);
            }

            function escapeBraces(str) {
                return str.split('\\\\').join(escSlash)
                  .split('\\{').join(escOpen)
                  .split('\\}').join(escClose)
                  .split('\\,').join(escComma)
                  .split('\\.').join(escPeriod);
            }

            function unescapeBraces(str) {
                return str.split(escSlash).join('\\')
                  .split(escOpen).join('{')
                  .split(escClose).join('}')
                  .split(escComma).join(',')
                  .split(escPeriod).join('.');
            }


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
            function parseCommaParts(str) {
                if (!str)
                    return [''];

                var parts = [];
                var m = balanced('{', '}', str);

                if (!m)
                    return str.split(',');

                var pre = m.pre;
                var body = m.body;
                var post = m.post;
                var p = pre.split(',');

                p[p.length - 1] += '{' + body + '}';
                var postParts = parseCommaParts(post);
                if (post.length) {
                    p[p.length - 1] += postParts.shift();
                    p.push.apply(p, postParts);
                }

                parts.push.apply(parts, p);

                return parts;
            }

            function expandTop(str) {
                if (!str)
                    return [];

                // I don't know why Bash 4.3 does this, but it does.
                // Anything starting with {} will have the first two bytes preserved
                // but *only* at the top level, so {},a}b will not expand to anything,
                // but a{},b}c will be expanded to [a}c,abc].
                // One could argue that this is a bug in Bash, but since the goal of
                // this module is to match Bash's rules, we escape a leading {}
                if (str.substr(0, 2) === '{}') {
                    str = '\\{\\}' + str.substr(2);
                }

                return expand(escapeBraces(str), true).map(unescapeBraces);
            }

            function identity(e) {
                return e;
            }

            function embrace(str) {
                return '{' + str + '}';
            }

            function isPadded(el) {
                return /^-?0\d/.test(el);
            }

            function lte(i, y) {
                return i <= y;
            }

            function gte(i, y) {
                return i >= y;
            }

            function expand(str, isTop) {
                var expansions = [];

                var m = balanced('{', '}', str);
                if (!m || /\$$/.test(m.pre)) return [str];

                var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
                var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
                var isSequence = isNumericSequence || isAlphaSequence;
                var isOptions = m.body.indexOf(',') >= 0;
                if (!isSequence && !isOptions) {
                    // {a},b}
                    if (m.post.match(/,.*\}/)) {
                        str = m.pre + '{' + m.body + escClose + m.post;
                        return expand(str);
                    }
                    return [str];
                }

                var n;
                if (isSequence) {
                    n = m.body.split(/\.\./);
                } else {
                    n = parseCommaParts(m.body);
                    if (n.length === 1) {
                        // x{{a,b}}y ==> x{a}y x{b}y
                        n = expand(n[0], false).map(embrace);
                        if (n.length === 1) {
                            var post = m.post.length
                              ? expand(m.post, false)
                              : [''];
                            return post.map(function(p) {
                                return m.pre + n[0] + p;
                            });
                        }
                    }
                }

                // at this point, n is the parts, and we know it's not a comma set
                // with a single entry.

                // no need to expand pre, since it is guaranteed to be free of brace-sets
                var pre = m.pre;
                var post = m.post.length
                  ? expand(m.post, false)
                  : [''];

                var N;

                if (isSequence) {
                    var x = numeric(n[0]);
                    var y = numeric(n[1]);
                    var width = Math.max(n[0].length, n[1].length)
                    var incr = n.length == 3
                      ? Math.abs(numeric(n[2]))
                      : 1;
                    var test = lte;
                    var reverse = y < x;
                    if (reverse) {
                        incr *= -1;
                        test = gte;
                    }
                    var pad = n.some(isPadded);

                    N = [];

                    for (var i = x; test(i, y); i += incr) {
                        var c;
                        if (isAlphaSequence) {
                            c = String.fromCharCode(i);
                            if (c === '\\')
                                c = '';
                        } else {
                            c = String(i);
                            if (pad) {
                                var need = width - c.length;
                                if (need > 0) {
                                    var z = new Array(need + 1).join('0');
                                    if (i < 0)
                                        c = '-' + z + c.slice(1);
                                    else
                                        c = z + c;
                                }
                            }
                        }
                        N.push(c);
                    }
                } else {
                    N = concatMap(n, function(el) {
                        return expand(el, false)
                    });
                }

                for (var j = 0; j < N.length; j++) {
                    for (var k = 0; k < post.length; k++) {
                        var expansion = pre + N[j] + post[k];
                        if (!isTop || isSequence || expansion)
                            expansions.push(expansion);
                    }
                }

                return expansions;
            }


            /***/
        }),

        /***/ 6891:
        /***/ ((module) => {

            module.exports = function(xs, fn) {
                var res = [];
                for (var i = 0; i < xs.length; i++) {
                    var x = fn(xs[i], i);
                    if (isArray(x)) res.push.apply(res, x);
                    else res.push(x);
                }
                return res;
};

            var isArray = Array.isArray || function(xs) {
                return Object.prototype.toString.call(xs) === '[object Array]';
            };


            /***/
        }),

        /***/ 6863:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            module.exports = realpath
            realpath.realpath = realpath
            realpath.sync = realpathSync
            realpath.realpathSync = realpathSync
            realpath.monkeypatch = monkeypatch
            realpath.unmonkeypatch = unmonkeypatch

            var fs = __nccwpck_require__(7147)
            var origRealpath = fs.realpath
            var origRealpathSync = fs.realpathSync

            var version = process.version
            var ok = /^v[0-5]\./.test(version)
            var old = __nccwpck_require__(1734)

            function newError(er) {
                return er && er.syscall === 'realpath' && (
                  er.code === 'ELOOP' ||
                  er.code === 'ENOMEM' ||
                  er.code === 'ENAMETOOLONG'
                )
            }

            function realpath(p, cache, cb) {
                if (ok) {
                    return origRealpath(p, cache, cb)
                }

                if (typeof cache === 'function') {
                    cb = cache
                    cache = null
                }
                origRealpath(p, cache, function(er, result) {
                    if (newError(er)) {
                        old.realpath(p, cache, cb)
                    } else {
                        cb(er, result)
                    }
                })
            }

            function realpathSync(p, cache) {
                if (ok) {
                    return origRealpathSync(p, cache)
                }

                try {
                    return origRealpathSync(p, cache)
                } catch (er) {
                    if (newError(er)) {
                        return old.realpathSync(p, cache)
                    } else {
                        throw er
                    }
                }
            }

            function monkeypatch() {
                fs.realpath = realpath
                fs.realpathSync = realpathSync
            }

            function unmonkeypatch() {
                fs.realpath = origRealpath
                fs.realpathSync = origRealpathSync
            }


            /***/
        }),

        /***/ 1734:
        /***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

            var pathModule = __nccwpck_require__(1017);
            var isWindows = process.platform === 'win32';
            var fs = __nccwpck_require__(7147);

// JavaScript implementation of realpath, ported from node pre-v6

            var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

            function rethrow() {
                // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
                // is fairly slow to generate.
                var callback;
                if (DEBUG) {
                    var backtrace = new Error;
                    callback = debugCallback;
                } else
                    callback = missingCallback;

                return callback;

                function debugCallback(err) {
                    if (err) {
                        backtrace.message = err.message;
                        err = backtrace;
                        missingCallback(err);
                    }
                }

                function missingCallback(err) {
                    if (err) {
                        if (process.throwDeprecation)
                            throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
                        else if (!process.noDeprecation) {
                            var msg = 'fs: missing callback ' + (err.stack || err.message);
                            if (process.traceDeprecation)
                                console.trace(msg);
                            else
                                console.error(msg);
                        }
                    }
                }
            }

            function maybeCallback(cb) {
                return typeof cb === 'function' ? cb : rethrow();
            }

            var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
            if (isWindows) {
                var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
            } else {
                var nextPartRe = /(.*?)(?:[\/]+|$)/g;
            }

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
            if (isWindows) {
                var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
            } else {
                var splitRootRe = /^[\/]*/;
            }

            exports.realpathSync = function realpathSync(p, cache) {
                // make p is absolute
                p = pathModule.resolve(p);

                if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
                    return cache[p];
                }

                var original = p,
                  seenLinks = {},
                  knownHard = {};

                // current character position in p
                var pos;
                // the partial path so far, including a trailing slash if any
                var current;
                // the partial path without a trailing slash (except when pointing at a root)
                var base;
                // the partial path scanned in the previous round, with slash
                var previous;

                start();

                function start() {
                    // Skip over roots
                    var m = splitRootRe.exec(p);
                    pos = m[0].length;
                    current = m[0];
                    base = m[0];
                    previous = '';

                    // On windows, check that the root exists. On unix there is no need.
                    if (isWindows && !knownHard[base]) {
                        fs.lstatSync(base);
                        knownHard[base] = true;
                    }
                }

                // walk down the path, swapping out linked pathparts for their real
                // values
                // NB: p.length changes.
                while (pos < p.length) {
                    // find the next part
                    nextPartRe.lastIndex = pos;
                    var result = nextPartRe.exec(p);
                    previous = current;
                    current += result[0];
                    base = previous + result[1];
                    pos = nextPartRe.lastIndex;

                    // continue if not a symlink
                    if (knownHard[base] || (cache && cache[base] === base)) {
                        continue;
                    }

                    var resolvedLink;
                    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
                        // some known symbolic link.  no need to stat again.
                        resolvedLink = cache[base];
                    } else {
                        var stat = fs.lstatSync(base);
                        if (!stat.isSymbolicLink()) {
                            knownHard[base] = true;
                            if (cache) cache[base] = base;
                            continue;
                        }

                        // read the link if it wasn't read before
                        // dev/ino always return 0 on windows, so skip the check.
                        var linkTarget = null;
                        if (!isWindows) {
                            var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
                            if (seenLinks.hasOwnProperty(id)) {
                                linkTarget = seenLinks[id];
                            }
                        }
                        if (linkTarget === null) {
                            fs.statSync(base);
                            linkTarget = fs.readlinkSync(base);
                        }
                        resolvedLink = pathModule.resolve(previous, linkTarget);
                        // track this, if given a cache.
                        if (cache) cache[base] = resolvedLink;
                        if (!isWindows) seenLinks[id] = linkTarget;
                    }

                    // resolve the link, then start over
                    p = pathModule.resolve(resolvedLink, p.slice(pos));
                    start();
                }

                if (cache) cache[original] = p;

                return p;
            };


            exports.realpath = function realpath(p, cache, cb) {
                if (typeof cb !== 'function') {
                    cb = maybeCallback(cache);
                    cache = null;
                }

                // make p is absolute
                p = pathModule.resolve(p);

                if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
                    return process.nextTick(cb.bind(null, null, cache[p]));
                }

                var original = p,
                  seenLinks = {},
                  knownHard = {};

                // current character position in p
                var pos;
                // the partial path so far, including a trailing slash if any
                var current;
                // the partial path without a trailing slash (except when pointing at a root)
                var base;
                // the partial path scanned in the previous round, with slash
                var previous;

                start();

                function start() {
                    // Skip over roots
                    var m = splitRootRe.exec(p);
                    pos = m[0].length;
                    current = m[0];
                    base = m[0];
                    previous = '';

                    // On windows, check that the root exists. On unix there is no need.
                    if (isWindows && !knownHard[base]) {
                        fs.lstat(base, function(err) {
                            if (err) return cb(err);
                            knownHard[base] = true;
                            LOOP();
                        });
                    } else {
                        process.nextTick(LOOP);
                    }
                }

                // walk down the path, swapping out linked pathparts for their real
                // values
                function LOOP() {
                    // stop if scanned past end of path
                    if (pos >= p.length) {
                        if (cache) cache[original] = p;
                        return cb(null, p);
                    }

                    // find the next part
                    nextPartRe.lastIndex = pos;
                    var result = nextPartRe.exec(p);
                    previous = current;
                    current += result[0];
                    base = previous + result[1];
                    pos = nextPartRe.lastIndex;

                    // continue if not a symlink
                    if (knownHard[base] || (cache && cache[base] === base)) {
                        return process.nextTick(LOOP);
                    }

                    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
                        // known symbolic link.  no need to stat again.
                        return gotResolvedLink(cache[base]);
                    }

                    return fs.lstat(base, gotStat);
                }

                function gotStat(err, stat) {
                    if (err) return cb(err);

                    // if not a symlink, skip to the next path part
                    if (!stat.isSymbolicLink()) {
                        knownHard[base] = true;
                        if (cache) cache[base] = base;
                        return process.nextTick(LOOP);
                    }

                    // stat & read the link if not read before
                    // call gotTarget as soon as the link target is known
                    // dev/ino always return 0 on windows, so skip the check.
                    if (!isWindows) {
                        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
                        if (seenLinks.hasOwnProperty(id)) {
                            return gotTarget(null, seenLinks[id], base);
                        }
                    }
                    fs.stat(base, function(err) {
                        if (err) return cb(err);

                        fs.readlink(base, function(err, target) {
                            if (!isWindows) seenLinks[id] = target;
                            gotTarget(err, target);
                        });
                    });
                }

                function gotTarget(err, target, base) {
                    if (err) return cb(err);

                    var resolvedLink = pathModule.resolve(previous, target);
                    if (cache) cache[base] = resolvedLink;
                    gotResolvedLink(resolvedLink);
                }

                function gotResolvedLink(resolvedLink) {
                    // resolve the link, then start over
                    p = pathModule.resolve(resolvedLink, p.slice(pos));
                    start();
                }
};


            /***/
        }),

        /***/ 7625:
        /***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

            exports.setopts = setopts
            exports.ownProp = ownProp
            exports.makeAbs = makeAbs
            exports.finish = finish
            exports.mark = mark
            exports.isIgnored = isIgnored
            exports.childrenIgnored = childrenIgnored

            function ownProp(obj, field) {
                return Object.prototype.hasOwnProperty.call(obj, field)
            }

            var fs = __nccwpck_require__(7147)
            var path = __nccwpck_require__(1017)
            var minimatch = __nccwpck_require__(3973)
            var isAbsolute = __nccwpck_require__(8714)
            var Minimatch = minimatch.Minimatch

            function alphasort(a, b) {
                return a.localeCompare(b, 'en')
            }

            function setupIgnores(self, options) {
                self.ignore = options.ignore || []

                if (!Array.isArray(self.ignore))
                    self.ignore = [self.ignore]

                if (self.ignore.length) {
                    self.ignore = self.ignore.map(ignoreMap)
                }
            }

// ignore patterns are always in dot:true mode.
            function ignoreMap(pattern) {
                var gmatcher = null
                if (pattern.slice(-3) === '/**') {
                    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
                    gmatcher = new Minimatch(gpattern, { dot: true })
                }

                return {
                    matcher: new Minimatch(pattern, { dot: true }),
                    gmatcher: gmatcher
                }
            }

            function setopts(self, pattern, options) {
                if (!options)
                    options = {}

                // base-matching: just use globstar for that.
                if (options.matchBase && -1 === pattern.indexOf("/")) {
                    if (options.noglobstar) {
                        throw new Error("base matching requires globstar")
                    }
                    pattern = "**/" + pattern
                }

                self.silent = !!options.silent
                self.pattern = pattern
                self.strict = options.strict !== false
                self.realpath = !!options.realpath
                self.realpathCache = options.realpathCache || Object.create(null)
                self.follow = !!options.follow
                self.dot = !!options.dot
                self.mark = !!options.mark
                self.nodir = !!options.nodir
                if (self.nodir)
                    self.mark = true
                self.sync = !!options.sync
                self.nounique = !!options.nounique
                self.nonull = !!options.nonull
                self.nosort = !!options.nosort
                self.nocase = !!options.nocase
                self.stat = !!options.stat
                self.noprocess = !!options.noprocess
                self.absolute = !!options.absolute
                self.fs = options.fs || fs

                self.maxLength = options.maxLength || Infinity
                self.cache = options.cache || Object.create(null)
                self.statCache = options.statCache || Object.create(null)
                self.symlinks = options.symlinks || Object.create(null)

                setupIgnores(self, options)

                self.changedCwd = false
                var cwd = process.cwd()
                if (!ownProp(options, "cwd"))
                    self.cwd = cwd
                else {
                    self.cwd = path.resolve(options.cwd)
                    self.changedCwd = self.cwd !== cwd
                }

                self.root = options.root || path.resolve(self.cwd, "/")
                self.root = path.resolve(self.root)
                if (process.platform === "win32")
                    self.root = self.root.replace(/\\/g, "/")

                // TODO: is an absolute `cwd` supposed to be resolved against `root`?
                // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
                self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
                if (process.platform === "win32")
                    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
                self.nomount = !!options.nomount

                // disable comments and negation in Minimatch.
                // Note that they are not supported in Glob itself anyway.
                options.nonegate = true
                options.nocomment = true
                // always treat \ in patterns as escapes, not path separators
                options.allowWindowsEscape = false

                self.minimatch = new Minimatch(pattern, options)
                self.options = self.minimatch.options
            }

            function finish(self) {
                var nou = self.nounique
                var all = nou ? [] : Object.create(null)

                for (var i = 0, l = self.matches.length; i < l; i++) {
                    var matches = self.matches[i]
                    if (!matches || Object.keys(matches).length === 0) {
                        if (self.nonull) {
                            // do like the shell, and spit out the literal glob
                            var literal = self.minimatch.globSet[i]
                            if (nou)
                                all.push(literal)
                            else
                                all[literal] = true
                        }
                    } else {
                        // had matches
                        var m = Object.keys(matches)
                        if (nou)
                            all.push.apply(all, m)
                        else
                            m.forEach(function(m) {
                                all[m] = true
                            })
                    }
                }

                if (!nou)
                    all = Object.keys(all)

                if (!self.nosort)
                    all = all.sort(alphasort)

                // at *some* point we statted all of these
                if (self.mark) {
                    for (var i = 0; i < all.length; i++) {
                        all[i] = self._mark(all[i])
                    }
                    if (self.nodir) {
                        all = all.filter(function(e) {
                            var notDir = !(/\/$/.test(e))
                            var c = self.cache[e] || self.cache[makeAbs(self, e)]
                            if (notDir && c)
                                notDir = c !== 'DIR' && !Array.isArray(c)
                            return notDir
                        })
                    }
                }

                if (self.ignore.length)
                    all = all.filter(function(m) {
                        return !isIgnored(self, m)
                    })

                self.found = all
            }

            function mark(self, p) {
                var abs = makeAbs(self, p)
                var c = self.cache[abs]
                var m = p
                if (c) {
                    var isDir = c === 'DIR' || Array.isArray(c)
                    var slash = p.slice(-1) === '/'

                    if (isDir && !slash)
                        m += '/'
                    else if (!isDir && slash)
                        m = m.slice(0, -1)

                    if (m !== p) {
                        var mabs = makeAbs(self, m)
                        self.statCache[mabs] = self.statCache[abs]
                        self.cache[mabs] = self.cache[abs]
                    }
                }

                return m
            }

// lotta situps...
            function makeAbs(self, f) {
                var abs = f
                if (f.charAt(0) === '/') {
                    abs = path.join(self.root, f)
                } else if (isAbsolute(f) || f === '') {
                    abs = f
                } else if (self.changedCwd) {
                    abs = path.resolve(self.cwd, f)
                } else {
                    abs = path.resolve(f)
                }

                if (process.platform === 'win32')
                    abs = abs.replace(/\\/g, '/')

                return abs
            }


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
            function isIgnored(self, path) {
                if (!self.ignore.length)
                    return false

                return self.ignore.some(function(item) {
                    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
                })
            }

            function childrenIgnored(self, path) {
                if (!self.ignore.length)
                    return false

                return self.ignore.some(function(item) {
                    return !!(item.gmatcher && item.gmatcher.match(path))
                })
            }


            /***/
        }),

        /***/ 1957:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

            module.exports = glob

            var rp = __nccwpck_require__(6863)
            var minimatch = __nccwpck_require__(3973)
            var Minimatch = minimatch.Minimatch
            var inherits = __nccwpck_require__(4124)
            var EE = (__nccwpck_require__(2361).EventEmitter)
            var path = __nccwpck_require__(1017)
            var assert = __nccwpck_require__(9491)
            var isAbsolute = __nccwpck_require__(8714)
            var globSync = __nccwpck_require__(9010)
            var common = __nccwpck_require__(7625)
            var setopts = common.setopts
            var ownProp = common.ownProp
            var inflight = __nccwpck_require__(2492)
            var util = __nccwpck_require__(3837)
            var childrenIgnored = common.childrenIgnored
            var isIgnored = common.isIgnored

            var once = __nccwpck_require__(1223)

            function glob(pattern, options, cb) {
                if (typeof options === 'function') cb = options, options = {}
                if (!options) options = {}

                if (options.sync) {
                    if (cb)
                        throw new TypeError('callback provided to sync glob')
                    return globSync(pattern, options)
                }

                return new Glob(pattern, options, cb)
            }

            glob.sync = globSync
            var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
            glob.glob = glob

            function extend(origin, add) {
                if (add === null || typeof add !== 'object') {
                    return origin
                }

                var keys = Object.keys(add)
                var i = keys.length
                while (i--) {
                    origin[keys[i]] = add[keys[i]]
                }
                return origin
            }

            glob.hasMagic = function(pattern, options_) {
                var options = extend({}, options_)
                options.noprocess = true

                var g = new Glob(pattern, options)
                var set = g.minimatch.set

                if (!pattern)
                    return false

                if (set.length > 1)
                    return true

                for (var j = 0; j < set[0].length; j++) {
                    if (typeof set[0][j] !== 'string')
                        return true
                }

                return false
            }

            glob.Glob = Glob
            inherits(Glob, EE)

            function Glob(pattern, options, cb) {
                if (typeof options === 'function') {
                    cb = options
                    options = null
                }

                if (options && options.sync) {
                    if (cb)
                        throw new TypeError('callback provided to sync glob')
                    return new GlobSync(pattern, options)
                }

                if (!(this instanceof Glob))
                    return new Glob(pattern, options, cb)

                setopts(this, pattern, options)
                this._didRealPath = false

                // process each pattern in the minimatch set
                var n = this.minimatch.set.length

                // The matches are stored as {<filename>: true,...} so that
                // duplicates are automagically pruned.
                // Later, we do an Object.keys() on these.
                // Keep them as a list so we can fill in when nonull is set.
                this.matches = new Array(n)

                if (typeof cb === 'function') {
                    cb = once(cb)
                    this.on('error', cb)
                    this.on('end', function(matches) {
                        cb(null, matches)
                    })
                }

                var self = this
                this._processing = 0

                this._emitQueue = []
                this._processQueue = []
                this.paused = false

                if (this.noprocess)
                    return this

                if (n === 0)
                    return done()

                var sync = true
                for (var i = 0; i < n; i++) {
                    this._process(this.minimatch.set[i], i, false, done)
                }
                sync = false

                function done() {
                    --self._processing
                    if (self._processing <= 0) {
                        if (sync) {
                            process.nextTick(function() {
                                self._finish()
                            })
                        } else {
                            self._finish()
                        }
                    }
                }
            }

            Glob.prototype._finish = function() {
                assert(this instanceof Glob)
                if (this.aborted)
                    return

                if (this.realpath && !this._didRealpath)
                    return this._realpath()

                common.finish(this)
                this.emit('end', this.found)
            }

            Glob.prototype._realpath = function() {
                if (this._didRealpath)
                    return

                this._didRealpath = true

                var n = this.matches.length
                if (n === 0)
                    return this._finish()

                var self = this
                for (var i = 0; i < this.matches.length; i++)
                    this._realpathSet(i, next)

                function next() {
                    if (--n === 0)
                        self._finish()
                }
            }

            Glob.prototype._realpathSet = function(index, cb) {
                var matchset = this.matches[index]
                if (!matchset)
                    return cb()

                var found = Object.keys(matchset)
                var self = this
                var n = found.length

                if (n === 0)
                    return cb()

                var set = this.matches[index] = Object.create(null)
                found.forEach(function(p, i) {
                    // If there's a problem with the stat, then it means that
                    // one or more of the links in the realpath couldn't be
                    // resolved.  just return the abs value in that case.
                    p = self._makeAbs(p)
                    rp.realpath(p, self.realpathCache, function(er, real) {
                        if (!er)
                            set[real] = true
                        else if (er.syscall === 'stat')
                            set[p] = true
                        else
                            self.emit('error', er) // srsly wtf right here

                        if (--n === 0) {
                            self.matches[index] = set
                            cb()
                        }
                    })
                })
            }

            Glob.prototype._mark = function(p) {
                return common.mark(this, p)
            }

            Glob.prototype._makeAbs = function(f) {
                return common.makeAbs(this, f)
            }

            Glob.prototype.abort = function() {
                this.aborted = true
                this.emit('abort')
            }

            Glob.prototype.pause = function() {
                if (!this.paused) {
                    this.paused = true
                    this.emit('pause')
                }
            }

            Glob.prototype.resume = function() {
                if (this.paused) {
                    this.emit('resume')
                    this.paused = false
                    if (this._emitQueue.length) {
                        var eq = this._emitQueue.slice(0)
                        this._emitQueue.length = 0
                        for (var i = 0; i < eq.length; i++) {
                            var e = eq[i]
                            this._emitMatch(e[0], e[1])
                        }
                    }
                    if (this._processQueue.length) {
                        var pq = this._processQueue.slice(0)
                        this._processQueue.length = 0
                        for (var i = 0; i < pq.length; i++) {
                            var p = pq[i]
                            this._processing--
                            this._process(p[0], p[1], p[2], p[3])
                        }
                    }
                }
            }

            Glob.prototype._process = function(pattern, index, inGlobStar, cb) {
                assert(this instanceof Glob)
                assert(typeof cb === 'function')

                if (this.aborted)
                    return

                this._processing++
                if (this.paused) {
                    this._processQueue.push([pattern, index, inGlobStar, cb])
                    return
                }

                //console.error('PROCESS %d', this._processing, pattern)

                // Get the first [n] parts of pattern that are all strings.
                var n = 0
                while (typeof pattern[n] === 'string') {
                    n++
                }
                // now n is the index of the first one that is *not* a string.

                // see if there's anything else
                var prefix
                switch (n) {
                  // if not, then this is rather simple
                    case pattern.length:
                        this._processSimple(pattern.join('/'), index, cb)
                        return

                    case 0:
                        // pattern *starts* with some non-trivial item.
                        // going to readdir(cwd), but not include the prefix in matches.
                        prefix = null
                        break

                    default:
                        // pattern has some string bits in the front.
                        // whatever it starts with, whether that's 'absolute' like /foo/bar,
                        // or 'relative' like '../baz'
                        prefix = pattern.slice(0, n).join('/')
                        break
                }

                var remain = pattern.slice(n)

                // get the list of entries.
                var read
                if (prefix === null)
                    read = '.'
                else if (isAbsolute(prefix) ||
                  isAbsolute(pattern.map(function(p) {
                      return typeof p === 'string' ? p : '[*]'
                  }).join('/'))) {
                    if (!prefix || !isAbsolute(prefix))
                        prefix = '/' + prefix
                    read = prefix
                } else
                    read = prefix

                var abs = this._makeAbs(read)

                //if ignored, skip _processing
                if (childrenIgnored(this, read))
                    return cb()

                var isGlobStar = remain[0] === minimatch.GLOBSTAR
                if (isGlobStar)
                    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
                else
                    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
            }

            Glob.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar, cb) {
                var self = this
                this._readdir(abs, inGlobStar, function(er, entries) {
                    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
                })
            }

            Glob.prototype._processReaddir2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {

                // if the abs isn't a dir, then nothing can match!
                if (!entries)
                    return cb()

                // It will only match dot entries if it starts with a dot, or if
                // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
                var pn = remain[0]
                var negate = !!this.minimatch.negate
                var rawGlob = pn._glob
                var dotOk = this.dot || rawGlob.charAt(0) === '.'

                var matchedEntries = []
                for (var i = 0; i < entries.length; i++) {
                    var e = entries[i]
                    if (e.charAt(0) !== '.' || dotOk) {
                        var m
                        if (negate && !prefix) {
                            m = !e.match(pn)
                        } else {
                            m = e.match(pn)
                        }
                        if (m)
                            matchedEntries.push(e)
                    }
                }

                //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

                var len = matchedEntries.length
                // If there are no matched entries, then nothing matches.
                if (len === 0)
                    return cb()

                // if this is the last remaining pattern bit, then no need for
                // an additional stat *unless* the user has specified mark or
                // stat explicitly.  We know they exist, since readdir returned
                // them.

                if (remain.length === 1 && !this.mark && !this.stat) {
                    if (!this.matches[index])
                        this.matches[index] = Object.create(null)

                    for (var i = 0; i < len; i++) {
                        var e = matchedEntries[i]
                        if (prefix) {
                            if (prefix !== '/')
                                e = prefix + '/' + e
                            else
                                e = prefix + e
                        }

                        if (e.charAt(0) === '/' && !this.nomount) {
                            e = path.join(this.root, e)
                        }
                        this._emitMatch(index, e)
                    }
                    // This was the last one, and no stats were needed
                    return cb()
                }

                // now test all matched entries as stand-ins for that part
                // of the pattern.
                remain.shift()
                for (var i = 0; i < len; i++) {
                    var e = matchedEntries[i]
                    var newPattern
                    if (prefix) {
                        if (prefix !== '/')
                            e = prefix + '/' + e
                        else
                            e = prefix + e
                    }
                    this._process([e].concat(remain), index, inGlobStar, cb)
                }
                cb()
            }

            Glob.prototype._emitMatch = function(index, e) {
                if (this.aborted)
                    return

                if (isIgnored(this, e))
                    return

                if (this.paused) {
                    this._emitQueue.push([index, e])
                    return
                }

                var abs = isAbsolute(e) ? e : this._makeAbs(e)

                if (this.mark)
                    e = this._mark(e)

                if (this.absolute)
                    e = abs

                if (this.matches[index][e])
                    return

                if (this.nodir) {
                    var c = this.cache[abs]
                    if (c === 'DIR' || Array.isArray(c))
                        return
                }

                this.matches[index][e] = true

                var st = this.statCache[abs]
                if (st)
                    this.emit('stat', e, st)

                this.emit('match', e)
            }

            Glob.prototype._readdirInGlobStar = function(abs, cb) {
                if (this.aborted)
                    return

                // follow all symlinked directories forever
                // just proceed as if this is a non-globstar situation
                if (this.follow)
                    return this._readdir(abs, false, cb)

                var lstatkey = 'lstat\0' + abs
                var self = this
                var lstatcb = inflight(lstatkey, lstatcb_)

                if (lstatcb)
                    self.fs.lstat(abs, lstatcb)

                function lstatcb_(er, lstat) {
                    if (er && er.code === 'ENOENT')
                        return cb()

                    var isSym = lstat && lstat.isSymbolicLink()
                    self.symlinks[abs] = isSym

                    // If it's not a symlink or a dir, then it's definitely a regular file.
                    // don't bother doing a readdir in that case.
                    if (!isSym && lstat && !lstat.isDirectory()) {
                        self.cache[abs] = 'FILE'
                        cb()
                    } else
                        self._readdir(abs, false, cb)
                }
            }

            Glob.prototype._readdir = function(abs, inGlobStar, cb) {
                if (this.aborted)
                    return

                cb = inflight('readdir\0' + abs + '\0' + inGlobStar, cb)
                if (!cb)
                    return

                //console.error('RD %j %j', +inGlobStar, abs)
                if (inGlobStar && !ownProp(this.symlinks, abs))
                    return this._readdirInGlobStar(abs, cb)

                if (ownProp(this.cache, abs)) {
                    var c = this.cache[abs]
                    if (!c || c === 'FILE')
                        return cb()

                    if (Array.isArray(c))
                        return cb(null, c)
                }

                var self = this
                self.fs.readdir(abs, readdirCb(this, abs, cb))
            }

            function readdirCb(self, abs, cb) {
                return function(er, entries) {
                    if (er)
                        self._readdirError(abs, er, cb)
                    else
                        self._readdirEntries(abs, entries, cb)
                }
            }

            Glob.prototype._readdirEntries = function(abs, entries, cb) {
                if (this.aborted)
                    return

                // if we haven't asked to stat everything, then just
                // assume that everything in there exists, so we can avoid
                // having to stat it a second time.
                if (!this.mark && !this.stat) {
                    for (var i = 0; i < entries.length; i++) {
                        var e = entries[i]
                        if (abs === '/')
                            e = abs + e
                        else
                            e = abs + '/' + e
                        this.cache[e] = true
                    }
                }

                this.cache[abs] = entries
                return cb(null, entries)
            }

            Glob.prototype._readdirError = function(f, er, cb) {
                if (this.aborted)
                    return

                // handle errors, and cache the information
                switch (er.code) {
                    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
                    case 'ENOTDIR': // totally normal. means it *does* exist.
                        var abs = this._makeAbs(f)
                        this.cache[abs] = 'FILE'
                        if (abs === this.cwdAbs) {
                            var error = new Error(er.code + ' invalid cwd ' + this.cwd)
                            error.path = this.cwd
                            error.code = er.code
                            this.emit('error', error)
                            this.abort()
                        }
                        break

                    case 'ENOENT': // not terribly unusual
                    case 'ELOOP':
                    case 'ENAMETOOLONG':
                    case 'UNKNOWN':
                        this.cache[this._makeAbs(f)] = false
                        break

                    default: // some unusual error.  Treat as failure.
                        this.cache[this._makeAbs(f)] = false
                        if (this.strict) {
                            this.emit('error', er)
                            // If the error is handled, then we abort
                            // if not, we threw out of here
                            this.abort()
                        }
                        if (!this.silent)
                            console.error('glob error', er)
                        break
                }

                return cb()
            }

            Glob.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar, cb) {
                var self = this
                this._readdir(abs, inGlobStar, function(er, entries) {
                    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
                })
            }


            Glob.prototype._processGlobStar2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
                //console.error('pgs2', prefix, remain[0], entries)

                // no entries means not a dir, so it can never have matches
                // foo.txt/** doesn't match foo.txt
                if (!entries)
                    return cb()

                // test without the globstar, and with every child both below
                // and replacing the globstar.
                var remainWithoutGlobStar = remain.slice(1)
                var gspref = prefix ? [prefix] : []
                var noGlobStar = gspref.concat(remainWithoutGlobStar)

                // the noGlobStar pattern exits the inGlobStar state
                this._process(noGlobStar, index, false, cb)

                var isSym = this.symlinks[abs]
                var len = entries.length

                // If it's a symlink, and we're in a globstar, then stop
                if (isSym && inGlobStar)
                    return cb()

                for (var i = 0; i < len; i++) {
                    var e = entries[i]
                    if (e.charAt(0) === '.' && !this.dot)
                        continue

                    // these two cases enter the inGlobStar state
                    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
                    this._process(instead, index, true, cb)

                    var below = gspref.concat(entries[i], remain)
                    this._process(below, index, true, cb)
                }

                cb()
            }

            Glob.prototype._processSimple = function(prefix, index, cb) {
                // XXX review this.  Shouldn't it be doing the mounting etc
                // before doing stat?  kinda weird?
                var self = this
                this._stat(prefix, function(er, exists) {
                    self._processSimple2(prefix, index, er, exists, cb)
                })
            }
            Glob.prototype._processSimple2 = function(prefix, index, er, exists, cb) {

                //console.error('ps2', prefix, exists)

                if (!this.matches[index])
                    this.matches[index] = Object.create(null)

                // If it doesn't exist, then just mark the lack of results
                if (!exists)
                    return cb()

                if (prefix && isAbsolute(prefix) && !this.nomount) {
                    var trail = /[\/\\]$/.test(prefix)
                    if (prefix.charAt(0) === '/') {
                        prefix = path.join(this.root, prefix)
                    } else {
                        prefix = path.resolve(this.root, prefix)
                        if (trail)
                            prefix += '/'
                    }
                }

                if (process.platform === 'win32')
                    prefix = prefix.replace(/\\/g, '/')

                // Mark this as a match
                this._emitMatch(index, prefix)
                cb()
            }

// Returns either 'DIR', 'FILE', or false
            Glob.prototype._stat = function(f, cb) {
                var abs = this._makeAbs(f)
                var needDir = f.slice(-1) === '/'

                if (f.length > this.maxLength)
                    return cb()

                if (!this.stat && ownProp(this.cache, abs)) {
                    var c = this.cache[abs]

                    if (Array.isArray(c))
                        c = 'DIR'

                    // It exists, but maybe not how we need it
                    if (!needDir || c === 'DIR')
                        return cb(null, c)

                    if (needDir && c === 'FILE')
                        return cb()

                    // otherwise we have to stat, because maybe c=true
                    // if we know it exists, but not what it is.
                }

                var exists
                var stat = this.statCache[abs]
                if (stat !== undefined) {
                    if (stat === false)
                        return cb(null, stat)
                    else {
                        var type = stat.isDirectory() ? 'DIR' : 'FILE'
                        if (needDir && type === 'FILE')
                            return cb()
                        else
                            return cb(null, type, stat)
                    }
                }

                var self = this
                var statcb = inflight('stat\0' + abs, lstatcb_)
                if (statcb)
                    self.fs.lstat(abs, statcb)

                function lstatcb_(er, lstat) {
                    if (lstat && lstat.isSymbolicLink()) {
                        // If it's a symlink, then treat it as the target, unless
                        // the target does not exist, then treat it as a file.
                        return self.fs.stat(abs, function(er, stat) {
                            if (er)
                                self._stat2(f, abs, null, lstat, cb)
                            else
                                self._stat2(f, abs, er, stat, cb)
                        })
                    } else {
                        self._stat2(f, abs, er, lstat, cb)
                    }
                }
            }

            Glob.prototype._stat2 = function(f, abs, er, stat, cb) {
                if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
                    this.statCache[abs] = false
                    return cb()
                }

                var needDir = f.slice(-1) === '/'
                this.statCache[abs] = stat

                if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
                    return cb(null, false, stat)

                var c = true
                if (stat)
                    c = stat.isDirectory() ? 'DIR' : 'FILE'
                this.cache[abs] = this.cache[abs] || c

                if (needDir && c === 'FILE')
                    return cb()

                return cb(null, c, stat)
            }


            /***/
        }),

        /***/ 9010:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            module.exports = globSync
            globSync.GlobSync = GlobSync

            var rp = __nccwpck_require__(6863)
            var minimatch = __nccwpck_require__(3973)
            var Minimatch = minimatch.Minimatch
            var Glob = (__nccwpck_require__(1957).Glob)
            var util = __nccwpck_require__(3837)
            var path = __nccwpck_require__(1017)
            var assert = __nccwpck_require__(9491)
            var isAbsolute = __nccwpck_require__(8714)
            var common = __nccwpck_require__(7625)
            var setopts = common.setopts
            var ownProp = common.ownProp
            var childrenIgnored = common.childrenIgnored
            var isIgnored = common.isIgnored

            function globSync(pattern, options) {
                if (typeof options === 'function' || arguments.length === 3)
                    throw new TypeError('callback provided to sync glob\n' +
                      'See: https://github.com/isaacs/node-glob/issues/167')

                return new GlobSync(pattern, options).found
            }

            function GlobSync(pattern, options) {
                if (!pattern)
                    throw new Error('must provide pattern')

                if (typeof options === 'function' || arguments.length === 3)
                    throw new TypeError('callback provided to sync glob\n' +
                      'See: https://github.com/isaacs/node-glob/issues/167')

                if (!(this instanceof GlobSync))
                    return new GlobSync(pattern, options)

                setopts(this, pattern, options)

                if (this.noprocess)
                    return this

                var n = this.minimatch.set.length
                this.matches = new Array(n)
                for (var i = 0; i < n; i++) {
                    this._process(this.minimatch.set[i], i, false)
                }
                this._finish()
            }

            GlobSync.prototype._finish = function() {
                assert.ok(this instanceof GlobSync)
                if (this.realpath) {
                    var self = this
                    this.matches.forEach(function(matchset, index) {
                        var set = self.matches[index] = Object.create(null)
                        for (var p in matchset) {
        try {
            p = self._makeAbs(p)
            var real = rp.realpathSync(p, self.realpathCache)
            set[real] = true
        } catch (er) {
            if (er.syscall === 'stat')
                set[self._makeAbs(p)] = true
            else
                throw er
        }
                        }
                    })
                }
                common.finish(this)
            }


            GlobSync.prototype._process = function(pattern, index, inGlobStar) {
                assert.ok(this instanceof GlobSync)

                // Get the first [n] parts of pattern that are all strings.
                var n = 0
                while (typeof pattern[n] === 'string') {
                    n++
                }
                // now n is the index of the first one that is *not* a string.

                // See if there's anything else
                var prefix
                switch (n) {
                  // if not, then this is rather simple
                    case pattern.length:
                        this._processSimple(pattern.join('/'), index)
                        return

                    case 0:
                        // pattern *starts* with some non-trivial item.
                        // going to readdir(cwd), but not include the prefix in matches.
                        prefix = null
                        break

                    default:
                        // pattern has some string bits in the front.
                        // whatever it starts with, whether that's 'absolute' like /foo/bar,
                        // or 'relative' like '../baz'
                        prefix = pattern.slice(0, n).join('/')
                        break
                }

                var remain = pattern.slice(n)

                // get the list of entries.
                var read
                if (prefix === null)
                    read = '.'
                else if (isAbsolute(prefix) ||
                  isAbsolute(pattern.map(function(p) {
                      return typeof p === 'string' ? p : '[*]'
                  }).join('/'))) {
                    if (!prefix || !isAbsolute(prefix))
                        prefix = '/' + prefix
                    read = prefix
                } else
                    read = prefix

                var abs = this._makeAbs(read)

                //if ignored, skip processing
                if (childrenIgnored(this, read))
                    return

                var isGlobStar = remain[0] === minimatch.GLOBSTAR
                if (isGlobStar)
                    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
                else
                    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
            }


            GlobSync.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar) {
                var entries = this._readdir(abs, inGlobStar)

                // if the abs isn't a dir, then nothing can match!
                if (!entries)
                    return

                // It will only match dot entries if it starts with a dot, or if
                // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
                var pn = remain[0]
                var negate = !!this.minimatch.negate
                var rawGlob = pn._glob
                var dotOk = this.dot || rawGlob.charAt(0) === '.'

                var matchedEntries = []
                for (var i = 0; i < entries.length; i++) {
                    var e = entries[i]
                    if (e.charAt(0) !== '.' || dotOk) {
                        var m
                        if (negate && !prefix) {
                            m = !e.match(pn)
                        } else {
                            m = e.match(pn)
                        }
                        if (m)
                            matchedEntries.push(e)
                    }
                }

                var len = matchedEntries.length
                // If there are no matched entries, then nothing matches.
                if (len === 0)
                    return

                // if this is the last remaining pattern bit, then no need for
                // an additional stat *unless* the user has specified mark or
                // stat explicitly.  We know they exist, since readdir returned
                // them.

                if (remain.length === 1 && !this.mark && !this.stat) {
                    if (!this.matches[index])
                        this.matches[index] = Object.create(null)

                    for (var i = 0; i < len; i++) {
                        var e = matchedEntries[i]
                        if (prefix) {
                            if (prefix.slice(-1) !== '/')
                                e = prefix + '/' + e
                            else
                                e = prefix + e
                        }

                        if (e.charAt(0) === '/' && !this.nomount) {
                            e = path.join(this.root, e)
                        }
                        this._emitMatch(index, e)
                    }
                    // This was the last one, and no stats were needed
                    return
                }

                // now test all matched entries as stand-ins for that part
                // of the pattern.
                remain.shift()
                for (var i = 0; i < len; i++) {
                    var e = matchedEntries[i]
                    var newPattern
                    if (prefix)
                        newPattern = [prefix, e]
                    else
                        newPattern = [e]
                    this._process(newPattern.concat(remain), index, inGlobStar)
                }
            }


            GlobSync.prototype._emitMatch = function(index, e) {
                if (isIgnored(this, e))
                    return

                var abs = this._makeAbs(e)

                if (this.mark)
                    e = this._mark(e)

                if (this.absolute) {
                    e = abs
                }

                if (this.matches[index][e])
                    return

                if (this.nodir) {
                    var c = this.cache[abs]
                    if (c === 'DIR' || Array.isArray(c))
                        return
                }

                this.matches[index][e] = true

                if (this.stat)
                    this._stat(e)
            }


            GlobSync.prototype._readdirInGlobStar = function(abs) {
                // follow all symlinked directories forever
                // just proceed as if this is a non-globstar situation
                if (this.follow)
                    return this._readdir(abs, false)

                var entries
                var lstat
                var stat
                try {
                    lstat = this.fs.lstatSync(abs)
                } catch (er) {
                    if (er.code === 'ENOENT') {
                        // lstat failed, doesn't exist
                        return null
                    }
                }

                var isSym = lstat && lstat.isSymbolicLink()
                this.symlinks[abs] = isSym

                // If it's not a symlink or a dir, then it's definitely a regular file.
                // don't bother doing a readdir in that case.
                if (!isSym && lstat && !lstat.isDirectory())
                    this.cache[abs] = 'FILE'
                else
                    entries = this._readdir(abs, false)

                return entries
            }

            GlobSync.prototype._readdir = function(abs, inGlobStar) {
                var entries

                if (inGlobStar && !ownProp(this.symlinks, abs))
                    return this._readdirInGlobStar(abs)

                if (ownProp(this.cache, abs)) {
                    var c = this.cache[abs]
                    if (!c || c === 'FILE')
                        return null

                    if (Array.isArray(c))
                        return c
                }

                try {
                    return this._readdirEntries(abs, this.fs.readdirSync(abs))
                } catch (er) {
                    this._readdirError(abs, er)
                    return null
                }
            }

            GlobSync.prototype._readdirEntries = function(abs, entries) {
                // if we haven't asked to stat everything, then just
                // assume that everything in there exists, so we can avoid
                // having to stat it a second time.
                if (!this.mark && !this.stat) {
                    for (var i = 0; i < entries.length; i++) {
                        var e = entries[i]
                        if (abs === '/')
                            e = abs + e
                        else
                            e = abs + '/' + e
                        this.cache[e] = true
                    }
                }

                this.cache[abs] = entries

                // mark and cache dir-ness
                return entries
            }

            GlobSync.prototype._readdirError = function(f, er) {
                // handle errors, and cache the information
                switch (er.code) {
                    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
                    case 'ENOTDIR': // totally normal. means it *does* exist.
                        var abs = this._makeAbs(f)
                        this.cache[abs] = 'FILE'
                        if (abs === this.cwdAbs) {
                            var error = new Error(er.code + ' invalid cwd ' + this.cwd)
                            error.path = this.cwd
                            error.code = er.code
                            throw error
                        }
                        break

                    case 'ENOENT': // not terribly unusual
                    case 'ELOOP':
                    case 'ENAMETOOLONG':
                    case 'UNKNOWN':
                        this.cache[this._makeAbs(f)] = false
                        break

                    default: // some unusual error.  Treat as failure.
                        this.cache[this._makeAbs(f)] = false
                        if (this.strict)
                            throw er
                        if (!this.silent)
                            console.error('glob error', er)
                        break
                }
            }

            GlobSync.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar) {

                var entries = this._readdir(abs, inGlobStar)

                // no entries means not a dir, so it can never have matches
                // foo.txt/** doesn't match foo.txt
                if (!entries)
                    return

                // test without the globstar, and with every child both below
                // and replacing the globstar.
                var remainWithoutGlobStar = remain.slice(1)
                var gspref = prefix ? [prefix] : []
                var noGlobStar = gspref.concat(remainWithoutGlobStar)

                // the noGlobStar pattern exits the inGlobStar state
                this._process(noGlobStar, index, false)

                var len = entries.length
                var isSym = this.symlinks[abs]

                // If it's a symlink, and we're in a globstar, then stop
                if (isSym && inGlobStar)
                    return

                for (var i = 0; i < len; i++) {
                    var e = entries[i]
                    if (e.charAt(0) === '.' && !this.dot)
                        continue

                    // these two cases enter the inGlobStar state
                    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
                    this._process(instead, index, true)

                    var below = gspref.concat(entries[i], remain)
                    this._process(below, index, true)
                }
            }

            GlobSync.prototype._processSimple = function(prefix, index) {
                // XXX review this.  Shouldn't it be doing the mounting etc
                // before doing stat?  kinda weird?
                var exists = this._stat(prefix)

                if (!this.matches[index])
                    this.matches[index] = Object.create(null)

                // If it doesn't exist, then just mark the lack of results
                if (!exists)
                    return

                if (prefix && isAbsolute(prefix) && !this.nomount) {
                    var trail = /[\/\\]$/.test(prefix)
                    if (prefix.charAt(0) === '/') {
                        prefix = path.join(this.root, prefix)
                    } else {
                        prefix = path.resolve(this.root, prefix)
                        if (trail)
                            prefix += '/'
                    }
                }

                if (process.platform === 'win32')
                    prefix = prefix.replace(/\\/g, '/')

                // Mark this as a match
                this._emitMatch(index, prefix)
            }

// Returns either 'DIR', 'FILE', or false
            GlobSync.prototype._stat = function(f) {
                var abs = this._makeAbs(f)
                var needDir = f.slice(-1) === '/'

                if (f.length > this.maxLength)
                    return false

                if (!this.stat && ownProp(this.cache, abs)) {
                    var c = this.cache[abs]

                    if (Array.isArray(c))
                        c = 'DIR'

                    // It exists, but maybe not how we need it
                    if (!needDir || c === 'DIR')
                        return c

                    if (needDir && c === 'FILE')
                        return false

                    // otherwise we have to stat, because maybe c=true
                    // if we know it exists, but not what it is.
                }

                var exists
                var stat = this.statCache[abs]
                if (!stat) {
                    var lstat
                    try {
                        lstat = this.fs.lstatSync(abs)
                    } catch (er) {
                        if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
                            this.statCache[abs] = false
                            return false
                        }
                    }

                    if (lstat && lstat.isSymbolicLink()) {
                        try {
                            stat = this.fs.statSync(abs)
                        } catch (er) {
                            stat = lstat
                        }
                    } else {
                        stat = lstat
                    }
                }

                this.statCache[abs] = stat

                var c = true
                if (stat)
                    c = stat.isDirectory() ? 'DIR' : 'FILE'

                this.cache[abs] = this.cache[abs] || c

                if (needDir && c === 'FILE')
                    return false

                return c
            }

            GlobSync.prototype._mark = function(p) {
                return common.mark(this, p)
}

            GlobSync.prototype._makeAbs = function(f) {
                return common.makeAbs(this, f)
}


/***/ }),

        /***/ 2492:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var wrappy = __nccwpck_require__(2940)
            var reqs = Object.create(null)
            var once = __nccwpck_require__(1223)

            module.exports = wrappy(inflight)

            function inflight(key, cb) {
                if (reqs[key]) {
                    reqs[key].push(cb)
                    return null
                } else {
                    reqs[key] = [cb]
                    return makeres(key)
                }
            }

            function makeres(key) {
                return once(function RES() {
                    var cbs = reqs[key]
                    var len = cbs.length
                    var args = slice(arguments)

                    // XXX It's somewhat ambiguous whether a new callback added in this
                    // pass should be queued for later execution if something in the
                    // list of callbacks throws, or if it should just be discarded.
                    // However, it's such an edge case that it hardly matters, and either
                    // choice is likely as surprising as the other.
                    // As it happens, we do go ahead and schedule it for later execution.
                    try {
                        for (var i = 0; i < len; i++) {
                            cbs[i].apply(null, args)
                        }
                    } finally {
                        if (cbs.length > len) {
                            // added more in the interim.
                            // de-zalgo, just in case, but don't call again.
                            cbs.splice(0, len)
                            process.nextTick(function() {
                                RES.apply(null, args)
                            })
                        } else {
                            delete reqs[key]
                        }
                    }
                })
            }

            function slice(args) {
                var length = args.length
                var array = []

                for (var i = 0; i < length; i++) array[i] = args[i]
                return array
            }


            /***/
        }),

        /***/ 4124:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            try {
                var util = __nccwpck_require__(3837);
                /* istanbul ignore next */
                if (typeof util.inherits !== 'function') throw '';
                module.exports = util.inherits;
            } catch (e) {
                /* istanbul ignore next */
                module.exports = __nccwpck_require__(8544);
            }


            /***/
        }),

        /***/ 8544:
        /***/ ((module) => {

            if (typeof Object.create === 'function') {
                // implementation from standard node.js 'util' module
                module.exports = function inherits(ctor, superCtor) {
                    if (superCtor) {
                        ctor.super_ = superCtor
                        ctor.prototype = Object.create(superCtor.prototype, {
                            constructor: {
                                value: ctor,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        })
                    }
                };
            } else {
                // old school shim for old browsers
                module.exports = function inherits(ctor, superCtor) {
                    if (superCtor) {
                        ctor.super_ = superCtor
                        var TempCtor = function() {
                        }
                        TempCtor.prototype = superCtor.prototype
                        ctor.prototype = new TempCtor()
                        ctor.prototype.constructor = ctor
                    }
                }
}


/***/ }),

        /***/ 6786:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";



////////////////////////////////////////////////////////////////////////////////
// Helpers

// Merge objects
//
            function assign(obj /*from1, from2, from3, ...*/) {
                var sources = Array.prototype.slice.call(arguments, 1);

                sources.forEach(function(source) {
                    if (!source) {
                        return;
                    }

                    Object.keys(source).forEach(function(key) {
                        obj[key] = source[key];
                    });
                });

                return obj;
            }

            function _class(obj) {
                return Object.prototype.toString.call(obj);
            }

            function isString(obj) {
                return _class(obj) === '[object String]';
            }

            function isObject(obj) {
                return _class(obj) === '[object Object]';
            }

            function isRegExp(obj) {
                return _class(obj) === '[object RegExp]';
            }

            function isFunction(obj) {
                return _class(obj) === '[object Function]';
            }


            function escapeRE(str) {
                return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
            }

////////////////////////////////////////////////////////////////////////////////


            var defaultOptions = {
                fuzzyLink: true,
                fuzzyEmail: true,
                fuzzyIP: false
            };


            function isOptionsObj(obj) {
                return Object.keys(obj || {}).reduce(function(acc, k) {
                    return acc || defaultOptions.hasOwnProperty(k);
                }, false);
            }


            var defaultSchemas = {
                'http:': {
                    validate: function(text, pos, self) {
                        var tail = text.slice(pos);

                        if (!self.re.http) {
                            // compile lazily, because "host"-containing variables can change on tlds update.
                            self.re.http = new RegExp(
                              '^\\/\\/' + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path, 'i'
                            );
                        }
                        if (self.re.http.test(tail)) {
                            return tail.match(self.re.http)[0].length;
                        }
                        return 0;
                    }
                },
                'https:': 'http:',
                'ftp:': 'http:',
                '//': {
                    validate: function(text, pos, self) {
                        var tail = text.slice(pos);

                        if (!self.re.no_http) {
                            // compile lazily, because "host"-containing variables can change on tlds update.
                            self.re.no_http = new RegExp(
                              '^' +
                              self.re.src_auth +
                              // Don't allow single-level domains, because of false positives like '//test'
                              // with code comments
                              '(?:localhost|(?:(?:' + self.re.src_domain + ')\\.)+' + self.re.src_domain_root + ')' +
                              self.re.src_port +
                              self.re.src_host_terminator +
                              self.re.src_path,

                              'i'
                            );
                        }

                        if (self.re.no_http.test(tail)) {
                            // should not be `://` & `///`, that protects from errors in protocol name
                            if (pos >= 3 && text[pos - 3] === ':') {
                                return 0;
                            }
                            if (pos >= 3 && text[pos - 3] === '/') {
                                return 0;
                            }
                            return tail.match(self.re.no_http)[0].length;
                        }
                        return 0;
                    }
                },
                'mailto:': {
                    validate: function(text, pos, self) {
                        var tail = text.slice(pos);

                        if (!self.re.mailto) {
                            self.re.mailto = new RegExp(
                              '^' + self.re.src_email_name + '@' + self.re.src_host_strict, 'i'
                            );
                        }
                        if (self.re.mailto.test(tail)) {
                            return tail.match(self.re.mailto)[0].length;
                        }
                        return 0;
                    }
                }
            };

            /*eslint-disable max-len*/

// RE pattern for 2-character tlds (autogenerated by ./support/tlds_2char_gen.js)
            var tlds_2ch_src_re = 'a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]';

// DON'T try to make PRs with changes. Extend TLDs with LinkifyIt.tlds() instead
            var tlds_default = 'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split('|');

            /*eslint-enable max-len*/

////////////////////////////////////////////////////////////////////////////////

            function resetScanCache(self) {
                self.__index__ = -1;
                self.__text_cache__ = '';
            }

            function createValidator(re) {
                return function(text, pos) {
                    var tail = text.slice(pos);

                    if (re.test(tail)) {
                        return tail.match(re)[0].length;
                    }
                    return 0;
                };
            }

            function createNormalizer() {
                return function(match, self) {
                    self.normalize(match);
                };
            }

// Schemas compiler. Build regexps.
//
            function compile(self) {

                // Load & clone RE patterns.
                var re = self.re = __nccwpck_require__(4971)(self.__opts__);

                // Define dynamic patterns
                var tlds = self.__tlds__.slice();

                self.onCompile();

                if (!self.__tlds_replaced__) {
                    tlds.push(tlds_2ch_src_re);
                }
                tlds.push(re.src_xn);

                re.src_tlds = tlds.join('|');

                function untpl(tpl) {
                    return tpl.replace('%TLDS%', re.src_tlds);
                }

                re.email_fuzzy = RegExp(untpl(re.tpl_email_fuzzy), 'i');
                re.link_fuzzy = RegExp(untpl(re.tpl_link_fuzzy), 'i');
                re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), 'i');
                re.host_fuzzy_test = RegExp(untpl(re.tpl_host_fuzzy_test), 'i');

                //
                // Compile each schema
                //

                var aliases = [];

                self.__compiled__ = {}; // Reset compiled data

                function schemaError(name, val) {
                    throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
                }

                Object.keys(self.__schemas__).forEach(function(name) {
                    var val = self.__schemas__[name];

                    // skip disabled methods
                    if (val === null) {
                        return;
                    }

                    var compiled = { validate: null, link: null };

                    self.__compiled__[name] = compiled;

                    if (isObject(val)) {
                        if (isRegExp(val.validate)) {
                            compiled.validate = createValidator(val.validate);
                        } else if (isFunction(val.validate)) {
                            compiled.validate = val.validate;
                        } else {
                            schemaError(name, val);
                        }

                        if (isFunction(val.normalize)) {
                            compiled.normalize = val.normalize;
                        } else if (!val.normalize) {
                            compiled.normalize = createNormalizer();
                        } else {
                            schemaError(name, val);
                        }

                        return;
                    }

                    if (isString(val)) {
                        aliases.push(name);
                        return;
                    }

                    schemaError(name, val);
                });

                //
                // Compile postponed aliases
                //

                aliases.forEach(function(alias) {
                    if (!self.__compiled__[self.__schemas__[alias]]) {
                        // Silently fail on missed schemas to avoid errons on disable.
                        // schemaError(alias, self.__schemas__[alias]);
                        return;
                    }

                    self.__compiled__[alias].validate =
                      self.__compiled__[self.__schemas__[alias]].validate;
                    self.__compiled__[alias].normalize =
                      self.__compiled__[self.__schemas__[alias]].normalize;
                });

                //
                // Fake record for guessed links
                //
                self.__compiled__[''] = { validate: null, normalize: createNormalizer() };

                //
                // Build schema condition
                //
                var slist = Object.keys(self.__compiled__)
                  .filter(function(name) {
                      // Filter disabled & fake schemas
                      return name.length > 0 && self.__compiled__[name];
                  })
                  .map(escapeRE)
                  .join('|');
                // (?!_) cause 1.5x slowdown
                self.re.schema_test = RegExp('(^|(?!_)(?:[><\uff5c]|' + re.src_ZPCc + '))(' + slist + ')', 'i');
                self.re.schema_search = RegExp('(^|(?!_)(?:[><\uff5c]|' + re.src_ZPCc + '))(' + slist + ')', 'ig');
                self.re.schema_at_start = RegExp('^' + self.re.schema_search.source, 'i');

                self.re.pretest = RegExp(
                  '(' + self.re.schema_test.source + ')|(' + self.re.host_fuzzy_test.source + ')|@',
                  'i'
                );

                //
                // Cleanup
                //

                resetScanCache(self);
            }

            /**
             * class Match
             *
             * Match result. Single element of array, returned by [[LinkifyIt#match]]
             **/
            function Match(self, shift) {
                var start = self.__index__,
                  end = self.__last_index__,
                  text = self.__text_cache__.slice(start, end);

                /**
                 * Match#schema -> String
                 *
                 * Prefix (protocol) for matched string.
                 **/
                this.schema = self.__schema__.toLowerCase();
                /**
                 * Match#index -> Number
                 *
                 * First position of matched string.
                 **/
                this.index = start + shift;
                /**
                 * Match#lastIndex -> Number
                 *
                 * Next position after matched string.
                 **/
                this.lastIndex = end + shift;
                /**
                 * Match#raw -> String
                 *
                 * Matched string.
                 **/
                this.raw = text;
                /**
                 * Match#text -> String
                 *
                 * Notmalized text of matched string.
                 **/
                this.text = text;
                /**
                 * Match#url -> String
                 *
                 * Normalized url of matched string.
                 **/
                this.url = text;
            }

            function createMatch(self, shift) {
                var match = new Match(self, shift);

                self.__compiled__[match.schema].normalize(match, self);

                return match;
            }


            /**
             * class LinkifyIt
             **/

            /**
             * new LinkifyIt(schemas, options)
             * - schemas (Object): Optional. Additional schemas to validate (prefix/validator)
             * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
             *
             * Creates new linkifier instance with optional additional schemas.
             * Can be called without `new` keyword for convenience.
             *
             * By default understands:
             *
             * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
             * - "fuzzy" links and emails (example.com, foo@bar.com).
             *
             * `schemas` is an object, where each key/value describes protocol/rule:
             *
             * - __key__ - link prefix (usually, protocol name with `:` at the end, `skype:`
             *   for example). `linkify-it` makes shure that prefix is not preceeded with
             *   alphanumeric char and symbols. Only whitespaces and punctuation allowed.
             * - __value__ - rule to check tail after link prefix
             *   - _String_ - just alias to existing rule
             *   - _Object_
             *     - _validate_ - validator function (should return matched length on success),
             *       or `RegExp`.
             *     - _normalize_ - optional function to normalize text & url of matched result
             *       (for example, for @twitter mentions).
             *
             * `options`:
             *
             * - __fuzzyLink__ - recognige URL-s without `http(s):` prefix. Default `true`.
             * - __fuzzyIP__ - allow IPs in fuzzy links above. Can conflict with some texts
             *   like version numbers. Default `false`.
             * - __fuzzyEmail__ - recognize emails without `mailto:` prefix.
             *
             **/
            function LinkifyIt(schemas, options) {
                if (!(this instanceof LinkifyIt)) {
                    return new LinkifyIt(schemas, options);
                }

                if (!options) {
                    if (isOptionsObj(schemas)) {
                        options = schemas;
                        schemas = {};
                    }
                }

                this.__opts__ = assign({}, defaultOptions, options);

                // Cache last tested result. Used to skip repeating steps on next `match` call.
                this.__index__ = -1;
                this.__last_index__ = -1; // Next scan position
                this.__schema__ = '';
                this.__text_cache__ = '';

                this.__schemas__ = assign({}, defaultSchemas, schemas);
                this.__compiled__ = {};

                this.__tlds__ = tlds_default;
                this.__tlds_replaced__ = false;

                this.re = {};

                compile(this);
            }


            /** chainable
             * LinkifyIt#add(schema, definition)
             * - schema (String): rule name (fixed pattern prefix)
             * - definition (String|RegExp|Object): schema definition
             *
             * Add new rule definition. See constructor description for details.
             **/
            LinkifyIt.prototype.add = function add(schema, definition) {
                this.__schemas__[schema] = definition;
                compile(this);
                return this;
            };


            /** chainable
             * LinkifyIt#set(options)
             * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
             *
             * Set recognition options for links without schema.
             **/
            LinkifyIt.prototype.set = function set(options) {
                this.__opts__ = assign(this.__opts__, options);
                return this;
            };


            /**
             * LinkifyIt#test(text) -> Boolean
             *
             * Searches linkifiable pattern and returns `true` on success or `false` on fail.
             **/
            LinkifyIt.prototype.test = function test(text) {
                // Reset scan cache
                this.__text_cache__ = text;
                this.__index__ = -1;

                if (!text.length) {
                    return false;
                }

                var m, ml, me, len, shift, next, re, tld_pos, at_pos;

                // try to scan for link with schema - that's the most simple rule
                if (this.re.schema_test.test(text)) {
                    re = this.re.schema_search;
                    re.lastIndex = 0;
                    while ((m = re.exec(text)) !== null) {
                        len = this.testSchemaAt(text, m[2], re.lastIndex);
                        if (len) {
                            this.__schema__ = m[2];
                            this.__index__ = m.index + m[1].length;
                            this.__last_index__ = m.index + m[0].length + len;
                            break;
                        }
                    }
                }

                if (this.__opts__.fuzzyLink && this.__compiled__['http:']) {
                    // guess schemaless links
                    tld_pos = text.search(this.re.host_fuzzy_test);
                    if (tld_pos >= 0) {
                        // if tld is located after found link - no need to check fuzzy pattern
                        if (this.__index__ < 0 || tld_pos < this.__index__) {
                            if ((ml = text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {

                                shift = ml.index + ml[1].length;

                                if (this.__index__ < 0 || shift < this.__index__) {
                                    this.__schema__ = '';
                                    this.__index__ = shift;
                                    this.__last_index__ = ml.index + ml[0].length;
                                }
                            }
                        }
                    }
                }

                if (this.__opts__.fuzzyEmail && this.__compiled__['mailto:']) {
                    // guess schemaless emails
                    at_pos = text.indexOf('@');
                    if (at_pos >= 0) {
                        // We can't skip this check, because this cases are possible:
                        // 192.168.1.1@gmail.com, my.in@example.com
                        if ((me = text.match(this.re.email_fuzzy)) !== null) {

                            shift = me.index + me[1].length;
                            next = me.index + me[0].length;

                            if (this.__index__ < 0 || shift < this.__index__ ||
                              (shift === this.__index__ && next > this.__last_index__)) {
                                this.__schema__ = 'mailto:';
                                this.__index__ = shift;
                                this.__last_index__ = next;
                            }
                        }
                    }
                }

                return this.__index__ >= 0;
            };


            /**
             * LinkifyIt#pretest(text) -> Boolean
             *
             * Very quick check, that can give false positives. Returns true if link MAY BE
             * can exists. Can be used for speed optimization, when you need to check that
             * link NOT exists.
             **/
            LinkifyIt.prototype.pretest = function pretest(text) {
                return this.re.pretest.test(text);
            };


            /**
             * LinkifyIt#testSchemaAt(text, name, position) -> Number
             * - text (String): text to scan
             * - name (String): rule (schema) name
             * - position (Number): text offset to check from
             *
             * Similar to [[LinkifyIt#test]] but checks only specific protocol tail exactly
             * at given position. Returns length of found pattern (0 on fail).
             **/
            LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text, schema, pos) {
                // If not supported schema check requested - terminate
                if (!this.__compiled__[schema.toLowerCase()]) {
                    return 0;
                }
                return this.__compiled__[schema.toLowerCase()].validate(text, pos, this);
            };


            /**
             * LinkifyIt#match(text) -> Array|null
             *
             * Returns array of found link descriptions or `null` on fail. We strongly
             * recommend to use [[LinkifyIt#test]] first, for best speed.
             *
             * ##### Result match description
             *
             * - __schema__ - link schema, can be empty for fuzzy links, or `//` for
             *   protocol-neutral  links.
             * - __index__ - offset of matched text
             * - __lastIndex__ - index of next char after mathch end
             * - __raw__ - matched text
             * - __text__ - normalized text
             * - __url__ - link, generated from matched text
             **/
            LinkifyIt.prototype.match = function match(text) {
                var shift = 0, result = [];

                // Try to take previous element from cache, if .test() called before
                if (this.__index__ >= 0 && this.__text_cache__ === text) {
                    result.push(createMatch(this, shift));
                    shift = this.__last_index__;
                }

                // Cut head if cache was used
                var tail = shift ? text.slice(shift) : text;

                // Scan string until end reached
                while (this.test(tail)) {
                    result.push(createMatch(this, shift));

                    tail = tail.slice(this.__last_index__);
                    shift += this.__last_index__;
                }

                if (result.length) {
                    return result;
                }

                return null;
            };


            /**
             * LinkifyIt#matchAtStart(text) -> Match|null
             *
             * Returns fully-formed (not fuzzy) link if it starts at the beginning
             * of the string, and null otherwise.
             **/
            LinkifyIt.prototype.matchAtStart = function matchAtStart(text) {
                // Reset scan cache
                this.__text_cache__ = text;
                this.__index__ = -1;

                if (!text.length) return null;

                var m = this.re.schema_at_start.exec(text);
                if (!m) return null;

                var len = this.testSchemaAt(text, m[2], m[0].length);
                if (!len) return null;

                this.__schema__ = m[2];
                this.__index__ = m.index + m[1].length;
                this.__last_index__ = m.index + m[0].length + len;

                return createMatch(this, 0);
            };


            /** chainable
             * LinkifyIt#tlds(list [, keepOld]) -> this
             * - list (Array): list of tlds
             * - keepOld (Boolean): merge with current list if `true` (`false` by default)
             *
             * Load (or merge) new tlds list. Those are user for fuzzy links (without prefix)
             * to avoid false positives. By default this algorythm used:
             *
             * - hostname with any 2-letter root zones are ok.
             * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
             *   are ok.
             * - encoded (`xn--...`) root zones are ok.
             *
             * If list is replaced, then exact match for 2-chars root zones will be checked.
             **/
            LinkifyIt.prototype.tlds = function tlds(list, keepOld) {
                list = Array.isArray(list) ? list : [list];

                if (!keepOld) {
                    this.__tlds__ = list.slice();
                    this.__tlds_replaced__ = true;
                    compile(this);
                    return this;
                }

                this.__tlds__ = this.__tlds__.concat(list)
                  .sort()
                  .filter(function(el, idx, arr) {
                      return el !== arr[idx - 1];
                  })
                  .reverse();

                compile(this);
                return this;
            };

            /**
             * LinkifyIt#normalize(match)
             *
             * Default normalizer (if schema does not define it's own).
             **/
            LinkifyIt.prototype.normalize = function normalize(match) {

                // Do minimal possible changes by default. Need to collect feedback prior
                // to move forward https://github.com/markdown-it/linkify-it/issues/1

                if (!match.schema) {
                    match.url = 'http://' + match.url;
                }

                if (match.schema === 'mailto:' && !/^mailto:/i.test(match.url)) {
                    match.url = 'mailto:' + match.url;
                }
            };


            /**
             * LinkifyIt#onCompile()
             *
             * Override to modify basic RegExp-s.
             **/
            LinkifyIt.prototype.onCompile = function onCompile() {
            };


            module.exports = LinkifyIt;


            /***/
        }),

        /***/ 4971:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";


            module.exports = function(opts) {
                var re = {};
                opts = opts || {};

                // Use direct extract instead of `regenerate` to reduse browserified size
                re.src_Any = (__nccwpck_require__(703).source);
                re.src_Cc = (__nccwpck_require__(4338).source);
                re.src_Z = (__nccwpck_require__(8810).source);
                re.src_P = (__nccwpck_require__(8019).source);

                // \p{\Z\P\Cc\CF} (white spaces + control + format + punctuation)
                re.src_ZPCc = [re.src_Z, re.src_P, re.src_Cc].join('|');

                // \p{\Z\Cc} (white spaces + control)
                re.src_ZCc = [re.src_Z, re.src_Cc].join('|');

                // Experimental. List of chars, completely prohibited in links
                // because can separate it from other part of text
                var text_separators = '[><\uff5c]';

                // All possible word characters (everything without punctuation, spaces & controls)
                // Defined via punctuation & spaces to save space
                // Should be something like \p{\L\N\S\M} (\w but without `_`)
                re.src_pseudo_letter = '(?:(?!' + text_separators + '|' + re.src_ZPCc + ')' + re.src_Any + ')';
                // The same as abothe but without [0-9]
                // var src_pseudo_letter_non_d = '(?:(?![0-9]|' + src_ZPCc + ')' + src_Any + ')';

                ////////////////////////////////////////////////////////////////////////////////

                re.src_ip4 =

                  '(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

                // Prohibit any of "@/[]()" in user/pass to avoid wrong domain fetch.
                re.src_auth = '(?:(?:(?!' + re.src_ZCc + '|[@/\\[\\]()]).)+@)?';

                re.src_port =

                  '(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?';

                re.src_host_terminator =

                  '(?=$|' + text_separators + '|' + re.src_ZPCc + ')' +
                  '(?!' + (opts['---'] ? '-(?!--)|' : '-|') + '_|:\\d|\\.-|\\.(?!$|' + re.src_ZPCc + '))';

                re.src_path =

                  '(?:' +
                  '[/?#]' +
                  '(?:' +
                  '(?!' + re.src_ZCc + '|' + text_separators + '|[()[\\]{}.,"\'?!\\-;]).|' +
                  '\\[(?:(?!' + re.src_ZCc + '|\\]).)*\\]|' +
                  '\\((?:(?!' + re.src_ZCc + '|[)]).)*\\)|' +
                  '\\{(?:(?!' + re.src_ZCc + '|[}]).)*\\}|' +
                  '\\"(?:(?!' + re.src_ZCc + '|["]).)+\\"|' +
                  "\\'(?:(?!" + re.src_ZCc + "|[']).)+\\'|" +
                  "\\'(?=" + re.src_pseudo_letter + '|[-])|' +  // allow `I'm_king` if no pair found
                  '\\.{2,}[a-zA-Z0-9%/&]|' + // google has many dots in "google search" links (#66, #81).
                  // github has ... in commit range links,
                  // Restrict to
                  // - english
                  // - percent-encoded
                  // - parts of file path
                  // - params separator
                  // until more examples found.
                  '\\.(?!' + re.src_ZCc + '|[.]|$)|' +
                  (opts['---'] ?
                      '\\-(?!--(?:[^-]|$))(?:-*)|' // `---` => long dash, terminate
                      :
                      '\\-+|'
                  ) +
                  ',(?!' + re.src_ZCc + '|$)|' +       // allow `,,,` in paths
                  ';(?!' + re.src_ZCc + '|$)|' +       // allow `;` if not followed by space-like char
                  '\\!+(?!' + re.src_ZCc + '|[!]|$)|' +  // allow `!!!` in paths, but not at the end
                  '\\?(?!' + re.src_ZCc + '|[?]|$)' +
                  ')+' +
                  '|\\/' +
                  ')?';

                // Allow anything in markdown spec, forbid quote (") at the first position
                // because emails enclosed in quotes are far more common
                re.src_email_name =

                  '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*';

                re.src_xn =

                  'xn--[a-z0-9\\-]{1,59}';

                // More to read about domain names
                // http://serverfault.com/questions/638260/

                re.src_domain_root =

                  // Allow letters & digits (http://test1)
                  '(?:' +
                  re.src_xn +
                  '|' +
                  re.src_pseudo_letter + '{1,63}' +
                  ')';

                re.src_domain =

                  '(?:' +
                  re.src_xn +
                  '|' +
                  '(?:' + re.src_pseudo_letter + ')' +
                  '|' +
                  '(?:' + re.src_pseudo_letter + '(?:-|' + re.src_pseudo_letter + '){0,61}' + re.src_pseudo_letter + ')' +
                  ')';

                re.src_host =

                  '(?:' +
                  // Don't need IP check, because digits are already allowed in normal domain names
                  //   src_ip4 +
                  // '|' +
                  '(?:(?:(?:' + re.src_domain + ')\\.)*' + re.src_domain/*_root*/ + ')' +
                  ')';

                re.tpl_host_fuzzy =

                  '(?:' +
                  re.src_ip4 +
                  '|' +
                  '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))' +
                  ')';

                re.tpl_host_no_ip_fuzzy =

                  '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))';

                re.src_host_strict =

                  re.src_host + re.src_host_terminator;

                re.tpl_host_fuzzy_strict =

                  re.tpl_host_fuzzy + re.src_host_terminator;

                re.src_host_port_strict =

                  re.src_host + re.src_port + re.src_host_terminator;

                re.tpl_host_port_fuzzy_strict =

                  re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;

                re.tpl_host_port_no_ip_fuzzy_strict =

                  re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;


                ////////////////////////////////////////////////////////////////////////////////
                // Main rules

                // Rude test fuzzy links by host, for quick deny
                re.tpl_host_fuzzy_test =

                  'localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:' + re.src_ZPCc + '|>|$))';

                re.tpl_email_fuzzy =

                  '(^|' + text_separators + '|"|\\(|' + re.src_ZCc + ')' +
                  '(' + re.src_email_name + '@' + re.tpl_host_fuzzy_strict + ')';

                re.tpl_link_fuzzy =
                  // Fuzzy link can't be prepended with .:/\- and non punctuation.
                  // but can start with > (markdown blockquote)
                  '(^|(?![.:/\\-_@])(?:[$+<=>^`|\uff5c]|' + re.src_ZPCc + '))' +
                  '((?![$+<=>^`|\uff5c])' + re.tpl_host_port_fuzzy_strict + re.src_path + ')';

                re.tpl_link_no_ip_fuzzy =
                  // Fuzzy link can't be prepended with .:/\- and non punctuation.
                  // but can start with > (markdown blockquote)
                  '(^|(?![.:/\\-_@])(?:[$+<=>^`|\uff5c]|' + re.src_ZPCc + '))' +
                  '((?![$+<=>^`|\uff5c])' + re.tpl_host_port_no_ip_fuzzy_strict + re.src_path + ')';

                return re;
            };


            /***/
        }),

        /***/ 5552:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";

            var DFA = __nccwpck_require__(3467);

            module.exports = function multimd_table_plugin(md, options) {
                var defaults = {
                    multiline: false,
                    rowspan: false,
                    headerless: false,
                    multibody: true,
                    autolabel: true
                };
                options = md.utils.assign({}, defaults, options || {});

                function scan_bound_indices(state, line) {
                    /**
                     * Naming convention of positional variables
                     * - list-item
                     * ·········longtext······\n
                     *   ^head  ^start  ^end  ^max
                     */
                    var start = state.bMarks[line] + state.sCount[line],
                      head = state.bMarks[line] + state.blkIndent,
                      end = state.skipSpacesBack(state.eMarks[line], head),
                      bounds = [], pos, posjump,
                      escape = false, code = false, serial = 0;

                    /* Scan for valid pipe character position */
                    for (pos = start; pos < end; pos++) {
                        switch (state.src.charCodeAt(pos)) {
                            case 0x5c /* \ */
                            :
                                escape = true;
                                break;
                            case 0x60 /* ` */
                            :
                                posjump = state.skipChars(pos, 0x60) - 1;
                                /* make \` closes the code sequence, but not open it;
             the reason is that `\` is correct code block */
                                /* eslint-disable-next-line brace-style */
                                if (posjump > pos) {
                                    if (!code) {
                                        if (serial === 0) {
                                            serial = posjump - pos;
                                        } else if (serial === posjump - pos) {
                                            serial = 0;
                                        }
                                    }
                                    pos = posjump;
                                } else if (code || (!escape && !serial)) {
                                    code = !code;
                                }
                                escape = false;
                                break;
                            case 0x7c /* | */
                            :
                                if (!code && !escape) {
                                    bounds.push(pos);
                                }
                                escape = false;
                                break;
                            default:
                                escape = false;
                                break;
                        }
                    }
                    if (bounds.length === 0) return bounds;

                    /* Pad in newline characters on last and this line */
                    if (bounds[0] > head) {
                        bounds.unshift(head - 1);
                    }
                    if (bounds[bounds.length - 1] < end - 1) {
                        bounds.push(end);
                    }

                    return bounds;
                }

                function table_caption(state, silent, line) {
                    var meta = { text: null, label: null },
                      start = state.bMarks[line] + state.sCount[line],
                      max = state.eMarks[line],
                      /* A non-greedy qualifier allows the label to be matched */
                      capRE = /^\[(.+?)\](\[([^\[\]]+)\])?\s*$/,
                      matches = state.src.slice(start, max).match(capRE);

                    if (!matches) {
                        return false;
                    }
                    if (silent) {
                        return true;
                    }

                    meta.text = matches[1];

                    if (!options.autolabel && !matches[2]) {
                        return meta;
                    }

                    meta.label = matches[2] || matches[1];
                    meta.label = meta.label.toLowerCase().replace(/\W+/g, '');

                    return meta;
                }

                function table_row(state, silent, line) {
                    var meta = { bounds: null, multiline: null },
                      bounds = scan_bound_indices(state, line),
                      start, pos, oldMax;

                    if (bounds.length < 2) {
                        return false;
                    }
                    if (silent) {
                        return true;
                    }

                    meta.bounds = bounds;

                    /* Multiline. Scan boundaries again since it's very complicated */
                    if (options.multiline) {
                        start = state.bMarks[line] + state.sCount[line];
                        pos = state.eMarks[line] - 1; /* where backslash should be */
                        meta.multiline = (state.src.charCodeAt(pos) === 0x5C/* \ */);
                        if (meta.multiline) {
                            oldMax = state.eMarks[line];
                            state.eMarks[line] = state.skipSpacesBack(pos, start);
                            meta.bounds = scan_bound_indices(state, line);
                            state.eMarks[line] = oldMax;
                        }
                    }

                    return meta;
                }

                function table_separator(state, silent, line) {
                    var meta = { aligns: [], wraps: [] },
                      bounds = scan_bound_indices(state, line),
                      sepRE = /^:?(-+|=+):?\+?$/,
                      c, text, align;

                    /* Only separator needs to check indents */
                    if (state.sCount[line] - state.blkIndent >= 4) {
                        return false;
                    }
                    if (bounds.length === 0) {
                        return false;
                    }

                    for (c = 0; c < bounds.length - 1; c++) {
                        text = state.src.slice(bounds[c] + 1, bounds[c + 1]).trim();
                        if (!sepRE.test(text)) {
                            return false;
                        }

                        meta.wraps.push(text.charCodeAt(text.length - 1) === 0x2B/* + */);
                        align = ((text.charCodeAt(0) === 0x3A/* : */) << 4) |
                          (text.charCodeAt(text.length - 1 - meta.wraps[c]) === 0x3A);
                        switch (align) {
                            case 0x00:
                                meta.aligns.push('');
                                break;
                            case 0x01:
                                meta.aligns.push('right');
                                break;
                            case 0x10:
                                meta.aligns.push('left');
                                break;
                            case 0x11:
                                meta.aligns.push('center');
                                break;
                        }
                    }
                    if (silent) {
                        return true;
                    }
                    return meta;
                }

                function table_empty(state, silent, line) {
                    return state.isEmpty(line);
                }

                function table(state, startLine, endLine, silent) {
                    /**
                     * Regex pseudo code for table:
                     *     caption? header+ separator (data+ empty)* data+ caption?
                     *
                     * We use DFA to emulate this plugin. Types with lower precedence are
                     * set-minus from all the formers.  Noted that separator should have higher
                     * precedence than header or data.
                     *   |  state  | caption separator header data empty | --> lower precedence
                     *   | 0x10100 |    1        0       1     0     0   |
                     */
                    var tableDFA = new DFA(),
                      grp = 0x10, mtr = -1,
                      token, tableToken, trToken,
                      colspan, leftToken,
                      rowspan, upTokens = [],
                      tableLines, tgroupLines,
                      tag, text, range, r, c, b, t,
                      blockState;

                    if (startLine + 2 > endLine) {
                        return false;
                    }

                    /**
                     * First pass: validate and collect info into table token. IR is stored in
                     * markdown-it `token.meta` to be pushed later. table/tr open tokens are
                     * generated here.
                     */
                    tableToken = new state.Token('table_open', 'table', 1);
                    tableToken.meta = { sep: null, cap: null, tr: [] };

                    tableDFA.set_highest_alphabet(0x10000);
                    tableDFA.set_initial_state(0x10100);
                    tableDFA.set_accept_states([0x10010, 0x10011, 0x00000]);
                    tableDFA.set_match_alphabets({
                        0x10000: table_caption.bind(this, state, true),
                        0x01000: table_separator.bind(this, state, true),
                        0x00100: table_row.bind(this, state, true),
                        0x00010: table_row.bind(this, state, true),
                        0x00001: table_empty.bind(this, state, true)
                    });
                    tableDFA.set_transitions({
                        0x10100: { 0x10000: 0x00100, 0x00100: 0x01100 },
                        0x00100: { 0x00100: 0x01100 },
                        0x01100: { 0x01000: 0x10010, 0x00100: 0x01100 },
                        0x10010: { 0x10000: 0x00000, 0x00010: 0x10011 },
                        0x10011: { 0x10000: 0x00000, 0x00010: 0x10011, 0x00001: 0x10010 }
                    });
                    if (options.headerless) {
                        tableDFA.set_initial_state(0x11100);
                        tableDFA.update_transition(0x11100,
                          { 0x10000: 0x01100, 0x01000: 0x10010, 0x00100: 0x01100 }
                        );
                        trToken = new state.Token('tr_placeholder', 'tr', 0);
                        trToken.meta = Object();  // avoid trToken.meta.grp throws exception
                    }
                    if (!options.multibody) {
                        tableDFA.update_transition(0x10010,
                          { 0x10000: 0x00000, 0x00010: 0x10010 }  // 0x10011 is never reached
                        );
                    }
                    /* Don't mix up DFA `_state` and markdown-it `state` */
                    tableDFA.set_actions(function(_line, _state, _type) {
                        // console.log(_line, _state.toString(16), _type.toString(16))  // for test
                        switch (_type) {
                            case 0x10000:
                                if (tableToken.meta.cap) {
                                    break;
                                }
                                tableToken.meta.cap = table_caption(state, false, _line);
                                tableToken.meta.cap.map = [_line, _line + 1];
                                tableToken.meta.cap.first = (_line === startLine);
                                break;
                            case 0x01000:
                                tableToken.meta.sep = table_separator(state, false, _line);
                                tableToken.meta.sep.map = [_line, _line + 1];
                                trToken.meta.grp |= 0x01;  // previously assigned at case 0x00110
                                grp = 0x10;
                                break;
                            case 0x00100:
                            case 0x00010:
                                trToken = new state.Token('tr_open', 'tr', 1);
                                trToken.map = [_line, _line + 1];
                                trToken.meta = table_row(state, false, _line);
                                trToken.meta.type = _type;
                                trToken.meta.grp = grp;
                                grp = 0x00;
                                tableToken.meta.tr.push(trToken);
                                /* Multiline. Merge trTokens as an entire multiline trToken */
                                if (options.multiline) {
                                    if (trToken.meta.multiline && mtr < 0) {
                                        /* Start line of multiline row. mark this trToken */
                                        mtr = tableToken.meta.tr.length - 1;
                                    } else if (!trToken.meta.multiline && mtr >= 0) {
                                        /* End line of multiline row. merge forward until the marked trToken */
                                        token = tableToken.meta.tr[mtr];
                                        token.meta.mbounds = tableToken.meta.tr
                                          .slice(mtr).map(function(tk) {
                                              return tk.meta.bounds;
                                          });
                                        token.map[1] = trToken.map[1];
                                        tableToken.meta.tr = tableToken.meta.tr.slice(0, mtr + 1);
                                        mtr = -1;
                                    }
                                }
                                break;
                            case 0x00001:
                                trToken.meta.grp |= 0x01;
                                grp = 0x10;
                                break;
                        }
                    });

                    if (tableDFA.execute(startLine, endLine) === false) {
                        return false;
                    }
                    // if (!tableToken.meta.sep) { return false; } // always evaluated true
                    if (!tableToken.meta.tr.length) {
                        return false;
                    } // false under headerless corner case
                    if (silent) {
                        return true;
                    }

                    /* Last data row cannot be detected. not stored to trToken outside? */
                    tableToken.meta.tr[tableToken.meta.tr.length - 1].meta.grp |= 0x01;


                    /**
                     * Second pass: actually push the tokens into `state.tokens`.
                     * thead/tbody/th/td open tokens and all closed tokens are generated here;
                     * thead/tbody are generally called tgroup; td/th are generally called tcol.
                     */
                    tableToken.map = tableLines = [startLine, 0];
                    tableToken.block = true;
                    tableToken.level = state.level++;
                    state.tokens.push(tableToken);

                    if (tableToken.meta.cap) {
                        token = state.push('caption_open', 'caption', 1);
                        token.map = tableToken.meta.cap.map;

                        var attrs = [];
                        var capSide = tableToken.meta.cap.first ? 'top' : 'bottom';

                        /* Null is possible when disabled the option autolabel */
                        if (tableToken.meta.cap.label !== null) {
                            attrs.push(['id', tableToken.meta.cap.label]);
                        }

                        /* Add caption-side inline-CSS to <caption> tag, if caption is below the markdown table. */
                        if (capSide !== 'top') {
                            attrs.push(['style', 'caption-side: ' + capSide]);
                        }

                        token.attrs = attrs;

                        token = state.push('inline', '', 0);
                        token.content = tableToken.meta.cap.text;
                        token.map = tableToken.meta.cap.map;
                        token.children = [];

                        token = state.push('caption_close', 'caption', -1);
                    }

                    for (r = 0; r < tableToken.meta.tr.length; r++) {
                        leftToken = new state.Token('td_th_placeholder', '', 0);

                        /* Push in thead/tbody and tr open tokens */
                        trToken = tableToken.meta.tr[r];
                        // console.log(trToken.meta); // for test
                        if (trToken.meta.grp & 0x10) {
                            tag = (trToken.meta.type === 0x00100) ? 'thead' : 'tbody';
                            token = state.push(tag + '_open', tag, 1);
                            token.map = tgroupLines = [trToken.map[0], 0];  // array ref
                            upTokens = [];
                        }
                        trToken.block = true;
                        trToken.level = state.level++;
                        state.tokens.push(trToken);

                        /* Push in th/td tokens */
                        for (c = 0; c < trToken.meta.bounds.length - 1; c++) {
                            range = [trToken.meta.bounds[c] + 1, trToken.meta.bounds[c + 1]];
                            text = state.src.slice.apply(state.src, range);

                            if (text === '') {
                                colspan = leftToken.attrGet('colspan');
                                leftToken.attrSet('colspan', colspan === null ? 2 : colspan + 1);
                                continue;
                            }
                            if (options.rowspan && upTokens[c] && text.trim() === '^^') {
                                rowspan = upTokens[c].attrGet('rowspan');
                                upTokens[c].attrSet('rowspan', rowspan === null ? 2 : rowspan + 1);
                                leftToken = new state.Token('td_th_placeholder', '', 0);
                                continue;
                            }

                            tag = (trToken.meta.type === 0x00100) ? 'th' : 'td';
                            token = state.push(tag + '_open', tag, 1);
                            token.map = trToken.map;
                            token.attrs = [];
                            if (tableToken.meta.sep.aligns[c]) {
                                token.attrs.push(['style', 'text-align:' + tableToken.meta.sep.aligns[c]]);
                            }
                            if (tableToken.meta.sep.wraps[c]) {
                                token.attrs.push(['class', 'extend']);
                            }

                            leftToken = upTokens[c] = token;

                            /* Multiline. Join the text and feed into markdown-it blockParser. */
                            if (options.multiline && trToken.meta.multiline && trToken.meta.mbounds) {
                                // Pad the text with empty lines to ensure the line number mapping is correct
                                text = new Array(trToken.map[0]).fill('').concat([text.trimRight()]);
                                for (b = 1; b < trToken.meta.mbounds.length; b++) {
                                    /* Line with N bounds has cells indexed from 0 to N-2 */
                                    if (c > trToken.meta.mbounds[b].length - 2) {
                                        continue;
                                    }
                                    range = [trToken.meta.mbounds[b][c] + 1, trToken.meta.mbounds[b][c + 1]];
                                    text.push(state.src.slice.apply(state.src, range).trimRight());
                                }
                                blockState = new state.md.block.State(text.join('\n'), state.md, state.env, []);
                                blockState.level = trToken.level + 1;
                                // Start tokenizing from the actual content (trToken.map[0])
                                state.md.block.tokenize(blockState, trToken.map[0], blockState.lineMax);
                                for (t = 0; t < blockState.tokens.length; t++) {
                                    state.tokens.push(blockState.tokens[t]);
                                }
                            } else {
                                token = state.push('inline', '', 0);
                                token.content = text.trim();
                                token.map = trToken.map;
                                token.level = trToken.level + 1;
                                token.children = [];
                            }

                            token = state.push(tag + '_close', tag, -1);
                        }

                        /* Push in tr and thead/tbody closed tokens */
                        state.push('tr_close', 'tr', -1);
                        if (trToken.meta.grp & 0x01) {
                            tag = (trToken.meta.type === 0x00100) ? 'thead' : 'tbody';
                            token = state.push(tag + '_close', tag, -1);
                            tgroupLines[1] = trToken.map[1];
                        }
                    }

                    tableLines[1] = Math.max(
                      tgroupLines[1],
                      tableToken.meta.sep.map[1],
                      tableToken.meta.cap ? tableToken.meta.cap.map[1] : -1
                    );
                    token = state.push('table_close', 'table', -1);

                    state.line = tableLines[1];
                    return true;
                }

                md.block.ruler.at('table', table, { alt: ['paragraph', 'reference'] });
            };

            /* vim: set ts=2 sw=2 et: */


            /***/
        }),

        /***/ 3467:
        /***/ ((module) => {

            "use strict";


// constructor

            function DFA() {
                // alphabets are encoded by numbers in 16^N form, presenting its precedence
                this.__highest_alphabet__ = 0x0;
                this.__match_alphabets__ = {};
                // states are union (bitwise OR) of its accepted alphabets
                this.__initial_state__ = 0x0;
                this.__accept_states__ = {};
                // transitions are in the form: {prev_state: {alphabet: next_state}}
                this.__transitions__ = {};
                // actions take two parameters: step (line number), prev_state and alphabet
                this.__actions__ = {};
            }

// setters

            DFA.prototype.set_highest_alphabet = function(alphabet) {
                this.__highest_alphabet__ = alphabet;
            };

            DFA.prototype.set_match_alphabets = function(matches) {
                this.__match_alphabets__ = matches;
            };

            DFA.prototype.set_initial_state = function(initial) {
                this.__initial_state__ = initial;
            };

            DFA.prototype.set_accept_states = function(accepts) {
                for (var i = 0; i < accepts.length; i++) {
                    this.__accept_states__[accepts[i]] = true;
                }
            };

            DFA.prototype.set_transitions = function(transitions) {
                this.__transitions__ = transitions;
            };

            DFA.prototype.set_actions = function(actions) {
                this.__actions__ = actions;
            };

            DFA.prototype.update_transition = function(state, alphabets) {
                this.__transitions__[state] = Object.assign(
                  this.__transitions__[state] || Object(), alphabets
                );
            };

// methods

            DFA.prototype.execute = function(start, end) {
                var state, step, alphabet;
                for (state = this.__initial_state__, step = start; state && step < end; step++) {
                    for (alphabet = this.__highest_alphabet__; alphabet > 0x0; alphabet >>= 4) {
                        if ((state & alphabet)
                          && this.__match_alphabets__[alphabet].call(this, step, state, alphabet)) {
                            break;
                        }
                    }

                    this.__actions__(step, state, alphabet);

                    if (alphabet === 0x0) {
                        break;
                    }
                    state = this.__transitions__[state][alphabet] || 0x0;
                }
                return !!this.__accept_states__[state];
            };

            module.exports = DFA;

            /* vim: set ts=2 sw=2 et: */


            /***/
        }),

        /***/ 8561:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";


            module.exports = __nccwpck_require__(4949);


            /***/
        }),

        /***/ 9220:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// HTML5 entities map: { name -> utf16string }
//


            /*eslint quotes:0*/
            module.exports = __nccwpck_require__(9323);


            /***/
        }),

        /***/ 9035:
        /***/ ((module) => {

            "use strict";
// List of valid html blocks names, accorting to commonmark spec
// http://jgm.github.io/CommonMark/spec.html#html-blocks


            module.exports = [
                'address',
                'article',
                'aside',
                'base',
                'basefont',
                'blockquote',
                'body',
                'caption',
                'center',
                'col',
                'colgroup',
                'dd',
                'details',
                'dialog',
                'dir',
                'div',
                'dl',
                'dt',
                'fieldset',
                'figcaption',
                'figure',
                'footer',
                'form',
                'frame',
                'frameset',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'head',
                'header',
                'hr',
                'html',
                'iframe',
                'legend',
                'li',
                'link',
                'main',
                'menu',
                'menuitem',
                'nav',
                'noframes',
                'ol',
                'optgroup',
                'option',
                'p',
                'param',
                'section',
                'source',
                'summary',
                'table',
                'tbody',
                'td',
                'tfoot',
                'th',
                'thead',
                'title',
                'tr',
                'track',
                'ul'
            ];


            /***/
        }),

        /***/ 6537:
        /***/ ((module) => {

            "use strict";
// Regexps to match html elements


            var attr_name = '[a-zA-Z_:][a-zA-Z0-9:._-]*';

            var unquoted = '[^"\'=<>`\\x00-\\x20]+';
            var single_quoted = "'[^']*'";
            var double_quoted = '"[^"]*"';

            var attr_value = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';

            var attribute = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + attr_value + ')?)';

            var open_tag = '<[A-Za-z][A-Za-z0-9\\-]*' + attribute + '*\\s*\\/?>';

            var close_tag = '<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>';
            var comment = '<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->';
            var processing = '<[?][\\s\\S]*?[?]>';
            var declaration = '<![A-Z]+\\s+[^>]*>';
            var cdata = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>';

            var HTML_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + '|' + comment +
              '|' + processing + '|' + declaration + '|' + cdata + ')');
            var HTML_OPEN_CLOSE_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + ')');

            module.exports.n = HTML_TAG_RE;
            module.exports.q = HTML_OPEN_CLOSE_TAG_RE;


            /***/
        }),

        /***/ 506:
        /***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

            "use strict";
// Utilities
//


            function _class(obj) {
                return Object.prototype.toString.call(obj);
            }

            function isString(obj) {
                return _class(obj) === '[object String]';
            }

            var _hasOwnProperty = Object.prototype.hasOwnProperty;

            function has(object, key) {
                return _hasOwnProperty.call(object, key);
            }

// Merge objects
//
            function assign(obj /*from1, from2, from3, ...*/) {
                var sources = Array.prototype.slice.call(arguments, 1);

                sources.forEach(function(source) {
                    if (!source) {
                        return;
                    }

                    if (typeof source !== 'object') {
                        throw new TypeError(source + 'must be object');
                    }

                    Object.keys(source).forEach(function(key) {
                        obj[key] = source[key];
                    });
                });

                return obj;
            }

// Remove element from array and put another array at those position.
// Useful for some operations with tokens
            function arrayReplaceAt(src, pos, newElements) {
                return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
            }

////////////////////////////////////////////////////////////////////////////////

            function isValidEntityCode(c) {
                /*eslint no-bitwise:0*/
                // broken sequence
                if (c >= 0xD800 && c <= 0xDFFF) {
                    return false;
                }
                // never used
                if (c >= 0xFDD0 && c <= 0xFDEF) {
                    return false;
                }
                if ((c & 0xFFFF) === 0xFFFF || (c & 0xFFFF) === 0xFFFE) {
                    return false;
                }
                // control codes
                if (c >= 0x00 && c <= 0x08) {
                    return false;
                }
                if (c === 0x0B) {
                    return false;
                }
                if (c >= 0x0E && c <= 0x1F) {
                    return false;
                }
                if (c >= 0x7F && c <= 0x9F) {
                    return false;
                }
                // out of range
                if (c > 0x10FFFF) {
                    return false;
                }
                return true;
            }

            function fromCodePoint(c) {
                /*eslint no-bitwise:0*/
                if (c > 0xffff) {
                    c -= 0x10000;
                    var surrogate1 = 0xd800 + (c >> 10),
                      surrogate2 = 0xdc00 + (c & 0x3ff);

                    return String.fromCharCode(surrogate1, surrogate2);
                }
                return String.fromCharCode(c);
            }


            var UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g;
            var ENTITY_RE = /&([a-z#][a-z0-9]{1,31});/gi;
            var UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + '|' + ENTITY_RE.source, 'gi');

            var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;

            var entities = __nccwpck_require__(9220);

            function replaceEntityPattern(match, name) {
                var code;

                if (has(entities, name)) {
                    return entities[name];
                }

                if (name.charCodeAt(0) === 0x23/* # */ && DIGITAL_ENTITY_TEST_RE.test(name)) {
                    code = name[1].toLowerCase() === 'x' ?
                      parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);

                    if (isValidEntityCode(code)) {
                        return fromCodePoint(code);
                    }
                }

                return match;
            }

            /*function replaceEntities(str) {
  if (str.indexOf('&') < 0) { return str; }

  return str.replace(ENTITY_RE, replaceEntityPattern);
}*/

            function unescapeMd(str) {
                if (str.indexOf('\\') < 0) {
                    return str;
                }
                return str.replace(UNESCAPE_MD_RE, '$1');
            }

            function unescapeAll(str) {
                if (str.indexOf('\\') < 0 && str.indexOf('&') < 0) {
                    return str;
                }

                return str.replace(UNESCAPE_ALL_RE, function(match, escaped, entity) {
                    if (escaped) {
                        return escaped;
                    }
                    return replaceEntityPattern(match, entity);
                });
            }

////////////////////////////////////////////////////////////////////////////////

            var HTML_ESCAPE_TEST_RE = /[&<>"]/;
            var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
            var HTML_REPLACEMENTS = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            };

            function replaceUnsafeChar(ch) {
                return HTML_REPLACEMENTS[ch];
            }

            function escapeHtml(str) {
                if (HTML_ESCAPE_TEST_RE.test(str)) {
                    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
                }
                return str;
            }

////////////////////////////////////////////////////////////////////////////////

            var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;

            function escapeRE(str) {
                return str.replace(REGEXP_ESCAPE_RE, '\\$&');
            }

////////////////////////////////////////////////////////////////////////////////

            function isSpace(code) {
                switch (code) {
                    case 0x09:
                    case 0x20:
                        return true;
                }
                return false;
            }

// Zs (unicode class) || [\t\f\v\r\n]
            function isWhiteSpace(code) {
                if (code >= 0x2000 && code <= 0x200A) {
                    return true;
                }
                switch (code) {
                    case 0x09: // \t
                    case 0x0A: // \n
                    case 0x0B: // \v
                    case 0x0C: // \f
                    case 0x0D: // \r
                    case 0x20:
                    case 0xA0:
                    case 0x1680:
                    case 0x202F:
                    case 0x205F:
                    case 0x3000:
                        return true;
                }
                return false;
            }

////////////////////////////////////////////////////////////////////////////////

            /*eslint-disable max-len*/
            var UNICODE_PUNCT_RE = __nccwpck_require__(8019);

// Currently without astral characters support.
            function isPunctChar(ch) {
                return UNICODE_PUNCT_RE.test(ch);
            }


// Markdown ASCII punctuation characters.
//
// !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~
// http://spec.commonmark.org/0.15/#ascii-punctuation-character
//
// Don't confuse with unicode punctuation !!! It lacks some chars in ascii range.
//
            function isMdAsciiPunct(ch) {
                switch (ch) {
                    case 0x21/* ! */
                    :
                    case 0x22/* " */
                    :
                    case 0x23/* # */
                    :
                    case 0x24/* $ */
                    :
                    case 0x25/* % */
                    :
                    case 0x26/* & */
                    :
                    case 0x27/* ' */
                    :
                    case 0x28/* ( */
                    :
                    case 0x29/* ) */
                    :
                    case 0x2A/* * */
                    :
                    case 0x2B/* + */
                    :
                    case 0x2C/* , */
                    :
                    case 0x2D/* - */
                    :
                    case 0x2E/* . */
                    :
                    case 0x2F/* / */
                    :
                    case 0x3A/* : */
                    :
                    case 0x3B/* ; */
                    :
                    case 0x3C/* < */
                    :
                    case 0x3D/* = */
                    :
                    case 0x3E/* > */
                    :
                    case 0x3F/* ? */
                    :
                    case 0x40/* @ */
                    :
                    case 0x5B/* [ */
                    :
                    case 0x5C/* \ */
                    :
                    case 0x5D/* ] */
                    :
                    case 0x5E/* ^ */
                    :
                    case 0x5F/* _ */
                    :
                    case 0x60/* ` */
                    :
                    case 0x7B/* { */
                    :
                    case 0x7C/* | */
                    :
                    case 0x7D/* } */
                    :
                    case 0x7E/* ~ */
                    :
                        return true;
                    default:
                        return false;
                }
            }

// Hepler to unify [reference labels].
//
            function normalizeReference(str) {
                // Trim and collapse whitespace
                //
                str = str.trim().replace(/\s+/g, ' ');

                // In node v10 'ẞ'.toLowerCase() === 'Ṿ', which is presumed to be a bug
                // fixed in v12 (couldn't find any details).
                //
                // So treat this one as a special case
                // (remove this when node v10 is no longer supported).
                //
                if ('ẞ'.toLowerCase() === 'Ṿ') {
                    str = str.replace(/ẞ/g, 'ß');
                }

                // .toLowerCase().toUpperCase() should get rid of all differences
                // between letter variants.
                //
                // Simple .toLowerCase() doesn't normalize 125 code points correctly,
                // and .toUpperCase doesn't normalize 6 of them (list of exceptions:
                // İ, ϴ, ẞ, Ω, K, Å - those are already uppercased, but have differently
                // uppercased versions).
                //
                // Here's an example showing how it happens. Lets take greek letter omega:
                // uppercase U+0398 (Θ), U+03f4 (ϴ) and lowercase U+03b8 (θ), U+03d1 (ϑ)
                //
                // Unicode entries:
                // 0398;GREEK CAPITAL LETTER THETA;Lu;0;L;;;;;N;;;;03B8;
                // 03B8;GREEK SMALL LETTER THETA;Ll;0;L;;;;;N;;;0398;;0398
                // 03D1;GREEK THETA SYMBOL;Ll;0;L;<compat> 03B8;;;;N;GREEK SMALL LETTER SCRIPT THETA;;0398;;0398
                // 03F4;GREEK CAPITAL THETA SYMBOL;Lu;0;L;<compat> 0398;;;;N;;;;03B8;
                //
                // Case-insensitive comparison should treat all of them as equivalent.
                //
                // But .toLowerCase() doesn't change ϑ (it's already lowercase),
                // and .toUpperCase() doesn't change ϴ (already uppercase).
                //
                // Applying first lower then upper case normalizes any character:
                // '\u0398\u03f4\u03b8\u03d1'.toLowerCase().toUpperCase() === '\u0398\u0398\u0398\u0398'
                //
                // Note: this is equivalent to unicode case folding; unicode normalization
                // is a different step that is not required here.
                //
                // Final result should be uppercased, because it's later stored in an object
                // (this avoid a conflict with Object.prototype members,
                // most notably, `__proto__`)
                //
                return str.toLowerCase().toUpperCase();
            }

////////////////////////////////////////////////////////////////////////////////

// Re-export libraries commonly used in both markdown-it and its plugins,
// so plugins won't have to depend on them explicitly, which reduces their
// bundled size (e.g. a browser build).
//
            exports.lib = {};
            exports.lib.mdurl = __nccwpck_require__(114);
            exports.lib.ucmicro = __nccwpck_require__(5649);

            exports.assign = assign;
            exports.isString = isString;
            exports.has = has;
            exports.unescapeMd = unescapeMd;
            exports.unescapeAll = unescapeAll;
            exports.isValidEntityCode = isValidEntityCode;
            exports.fromCodePoint = fromCodePoint;
// exports.replaceEntities     = replaceEntities;
            exports.escapeHtml = escapeHtml;
            exports.arrayReplaceAt = arrayReplaceAt;
            exports.isSpace = isSpace;
            exports.isWhiteSpace = isWhiteSpace;
            exports.isMdAsciiPunct = isMdAsciiPunct;
            exports.isPunctChar = isPunctChar;
            exports.escapeRE = escapeRE;
            exports.normalizeReference = normalizeReference;


            /***/
        }),

        /***/ 3380:
        /***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

            "use strict";
// Just a shortcut for bulk export


            exports.parseLinkLabel = __nccwpck_require__(7945);
            exports.parseLinkDestination = __nccwpck_require__(9914);
            exports.parseLinkTitle = __nccwpck_require__(3085);


            /***/
        }),

        /***/ 9914:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Parse link destination
//


            var unescapeAll = (__nccwpck_require__(506).unescapeAll);


            module.exports = function parseLinkDestination(str, start, max) {
                var code, level,
                  pos = start,
                  result = {
                      ok: false,
                      pos: 0,
                      lines: 0,
                      str: ''
                  };

                if (str.charCodeAt(pos) === 0x3C /* < */) {
                    pos++;
                    while (pos < max) {
                        code = str.charCodeAt(pos);
                        if (code === 0x0A /* \n */) {
                            return result;
                        }
                        if (code === 0x3C /* < */) {
                            return result;
                        }
                        if (code === 0x3E /* > */) {
                            result.pos = pos + 1;
                            result.str = unescapeAll(str.slice(start + 1, pos));
                            result.ok = true;
                            return result;
                        }
                        if (code === 0x5C /* \ */ && pos + 1 < max) {
                            pos += 2;
                            continue;
                        }

                        pos++;
                    }

                    // no closing '>'
                    return result;
                }

                // this should be ... } else { ... branch

                level = 0;
                while (pos < max) {
                    code = str.charCodeAt(pos);

                    if (code === 0x20) {
                        break;
                    }

                    // ascii control characters
                    if (code < 0x20 || code === 0x7F) {
                        break;
                    }

                    if (code === 0x5C /* \ */ && pos + 1 < max) {
                        if (str.charCodeAt(pos + 1) === 0x20) {
                            break;
                        }
                        pos += 2;
                        continue;
                    }

                    if (code === 0x28 /* ( */) {
                        level++;
                        if (level > 32) {
                            return result;
                        }
                    }

                    if (code === 0x29 /* ) */) {
                        if (level === 0) {
                            break;
                        }
                        level--;
                    }

                    pos++;
                }

                if (start === pos) {
                    return result;
                }
                if (level !== 0) {
                    return result;
                }

                result.str = unescapeAll(str.slice(start, pos));
                result.pos = pos;
                result.ok = true;
                return result;
            };


            /***/
        }),

        /***/ 7945:
        /***/ ((module) => {

            "use strict";
// Parse link label
//
// this function assumes that first character ("[") already matches;
// returns the end of the label
//


            module.exports = function parseLinkLabel(state, start, disableNested) {
                var level, found, marker, prevPos,
                  labelEnd = -1,
                  max = state.posMax,
                  oldPos = state.pos;

                state.pos = start + 1;
                level = 1;

                while (state.pos < max) {
                    marker = state.src.charCodeAt(state.pos);
                    if (marker === 0x5D /* ] */) {
                        level--;
                        if (level === 0) {
                            found = true;
                            break;
                        }
                    }

                    prevPos = state.pos;
                    state.md.inline.skipToken(state);
                    if (marker === 0x5B /* [ */) {
                        if (prevPos === state.pos - 1) {
                            // increase level if we find text `[`, which is not a part of any token
                            level++;
                        } else if (disableNested) {
                            state.pos = oldPos;
                            return -1;
                        }
                    }
                }

                if (found) {
                    labelEnd = state.pos;
                }

                // restore old state
                state.pos = oldPos;

                return labelEnd;
            };


            /***/
        }),

        /***/ 3085:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Parse link title
//


            var unescapeAll = (__nccwpck_require__(506).unescapeAll);


            module.exports = function parseLinkTitle(str, start, max) {
                var code,
                  marker,
                  lines = 0,
                  pos = start,
                  result = {
                      ok: false,
                      pos: 0,
                      lines: 0,
                      str: ''
                  };

                if (pos >= max) {
                    return result;
                }

                marker = str.charCodeAt(pos);

                if (marker !== 0x22 /* " */ && marker !== 0x27 /* ' */ && marker !== 0x28 /* ( */) {
                    return result;
                }

                pos++;

                // if opening marker is "(", switch it to closing marker ")"
                if (marker === 0x28) {
                    marker = 0x29;
                }

                while (pos < max) {
                    code = str.charCodeAt(pos);
                    if (code === marker) {
                        result.pos = pos + 1;
                        result.lines = lines;
                        result.str = unescapeAll(str.slice(start + 1, pos));
                        result.ok = true;
                        return result;
                    } else if (code === 0x28 /* ( */ && marker === 0x29 /* ) */) {
                        return result;
                    } else if (code === 0x0A) {
                        lines++;
                    } else if (code === 0x5C /* \ */ && pos + 1 < max) {
                        pos++;
                        if (str.charCodeAt(pos) === 0x0A) {
                            lines++;
                        }
                    }

                    pos++;
                }

                return result;
            };


            /***/
        }),

        /***/ 4949:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Main parser class


            var utils = __nccwpck_require__(506);
            var helpers = __nccwpck_require__(3380);
            var Renderer = __nccwpck_require__(3041);
            var ParserCore = __nccwpck_require__(4004);
            var ParserBlock = __nccwpck_require__(8007);
            var ParserInline = __nccwpck_require__(6031);
            var LinkifyIt = __nccwpck_require__(6786);
            var mdurl = __nccwpck_require__(114);
            var punycode = __nccwpck_require__(5477);


            var config = {
                default: __nccwpck_require__(1007),
                zero: __nccwpck_require__(6719),
                commonmark: __nccwpck_require__(3084)
            };

////////////////////////////////////////////////////////////////////////////////
//
// This validator can prohibit more than really needed to prevent XSS. It's a
// tradeoff to keep code simple and to be secure by default.
//
// If you need different setup - override validator method as you wish. Or
// replace it with dummy function and use external sanitizer.
//

            var BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
            var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;

            function validateLink(url) {
                // url should be normalized at this point, and existing entities are decoded
                var str = url.trim().toLowerCase();

                return BAD_PROTO_RE.test(str) ? (GOOD_DATA_RE.test(str) ? true : false) : true;
            }

////////////////////////////////////////////////////////////////////////////////


            var RECODE_HOSTNAME_FOR = ['http:', 'https:', 'mailto:'];

            function normalizeLink(url) {
                var parsed = mdurl.parse(url, true);

                if (parsed.hostname) {
                    // Encode hostnames in urls like:
                    // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
                    //
                    // We don't encode unknown schemas, because it's likely that we encode
                    // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
                    //
                    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
                        try {
                            parsed.hostname = punycode.toASCII(parsed.hostname);
                        } catch (er) { /**/
                        }
                    }
                }

                return mdurl.encode(mdurl.format(parsed));
            }

            function normalizeLinkText(url) {
                var parsed = mdurl.parse(url, true);

                if (parsed.hostname) {
                    // Encode hostnames in urls like:
                    // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
                    //
                    // We don't encode unknown schemas, because it's likely that we encode
                    // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
                    //
                    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
                        try {
                            parsed.hostname = punycode.toUnicode(parsed.hostname);
                        } catch (er) { /**/
                        }
                    }
                }

                // add '%' to exclude list because of https://github.com/markdown-it/markdown-it/issues/720
                return mdurl.decode(mdurl.format(parsed), mdurl.decode.defaultChars + '%');
            }


            /**
             * class MarkdownIt
             *
             * Main parser/renderer class.
             *
             * ##### Usage
             *
             * ```javascript
             * // node.js, "classic" way:
             * var MarkdownIt = require('markdown-it'),
             *     md = new MarkdownIt();
             * var result = md.render('# markdown-it rulezz!');
             *
             * // node.js, the same, but with sugar:
             * var md = require('markdown-it')();
             * var result = md.render('# markdown-it rulezz!');
             *
             * // browser without AMD, added to "window" on script load
             * // Note, there are no dash.
             * var md = window.markdownit();
             * var result = md.render('# markdown-it rulezz!');
             * ```
             *
             * Single line rendering, without paragraph wrap:
             *
             * ```javascript
             * var md = require('markdown-it')();
             * var result = md.renderInline('__markdown-it__ rulezz!');
             * ```
             **/

            /**
             * new MarkdownIt([presetName, options])
             * - presetName (String): optional, `commonmark` / `zero`
             * - options (Object)
             *
             * Creates parser instanse with given config. Can be called without `new`.
             *
             * ##### presetName
             *
             * MarkdownIt provides named presets as a convenience to quickly
             * enable/disable active syntax rules and options for common use cases.
             *
             * - ["commonmark"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/commonmark.js) -
             *   configures parser to strict [CommonMark](http://commonmark.org/) mode.
             * - [default](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/default.js) -
             *   similar to GFM, used when no preset name given. Enables all available rules,
             *   but still without html, typographer & autolinker.
             * - ["zero"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/zero.js) -
             *   all rules disabled. Useful to quickly setup your config via `.enable()`.
             *   For example, when you need only `bold` and `italic` markup and nothing else.
             *
             * ##### options:
             *
             * - __html__ - `false`. Set `true` to enable HTML tags in source. Be careful!
             *   That's not safe! You may need external sanitizer to protect output from XSS.
             *   It's better to extend features via plugins, instead of enabling HTML.
             * - __xhtmlOut__ - `false`. Set `true` to add '/' when closing single tags
             *   (`<br />`). This is needed only for full CommonMark compatibility. In real
             *   world you will need HTML output.
             * - __breaks__ - `false`. Set `true` to convert `\n` in paragraphs into `<br>`.
             * - __langPrefix__ - `language-`. CSS language class prefix for fenced blocks.
             *   Can be useful for external highlighters.
             * - __linkify__ - `false`. Set `true` to autoconvert URL-like text to links.
             * - __typographer__  - `false`. Set `true` to enable [some language-neutral
             *   replacement](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js) +
             *   quotes beautification (smartquotes).
             * - __quotes__ - `“”‘’`, String or Array. Double + single quotes replacement
             *   pairs, when typographer enabled and smartquotes on. For example, you can
             *   use `'«»„“'` for Russian, `'„“‚‘'` for German, and
             *   `['«\xA0', '\xA0»', '‹\xA0', '\xA0›']` for French (including nbsp).
             * - __highlight__ - `null`. Highlighter function for fenced code blocks.
             *   Highlighter `function (str, lang)` should return escaped HTML. It can also
             *   return empty string if the source was not changed and should be escaped
             *   externaly. If result starts with <pre... internal wrapper is skipped.
             *
             * ##### Example
             *
             * ```javascript
             * // commonmark mode
             * var md = require('markdown-it')('commonmark');
             *
             * // default mode
             * var md = require('markdown-it')();
             *
             * // enable everything
             * var md = require('markdown-it')({
             *   html: true,
             *   linkify: true,
             *   typographer: true
             * });
             * ```
             *
             * ##### Syntax highlighting
             *
             * ```js
             * var hljs = require('highlight.js') // https://highlightjs.org/
             *
             * var md = require('markdown-it')({
             *   highlight: function (str, lang) {
             *     if (lang && hljs.getLanguage(lang)) {
             *       try {
             *         return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
             *       } catch (__) {}
             *     }
             *
             *     return ''; // use external default escaping
             *   }
             * });
             * ```
             *
             * Or with full wrapper override (if you need assign class to `<pre>`):
             *
             * ```javascript
             * var hljs = require('highlight.js') // https://highlightjs.org/
             *
             * // Actual default values
             * var md = require('markdown-it')({
             *   highlight: function (str, lang) {
             *     if (lang && hljs.getLanguage(lang)) {
             *       try {
             *         return '<pre class="hljs"><code>' +
             *                hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
             *                '</code></pre>';
             *       } catch (__) {}
             *     }
             *
             *     return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
             *   }
             * });
             * ```
             *
             **/
            function MarkdownIt(presetName, options) {
                if (!(this instanceof MarkdownIt)) {
                    return new MarkdownIt(presetName, options);
                }

                if (!options) {
                    if (!utils.isString(presetName)) {
                        options = presetName || {};
                        presetName = 'default';
                    }
                }

                /**
                 * MarkdownIt#inline -> ParserInline
                 *
                 * Instance of [[ParserInline]]. You may need it to add new rules when
                 * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
                 * [[MarkdownIt.enable]].
                 **/
                this.inline = new ParserInline();

                /**
                 * MarkdownIt#block -> ParserBlock
                 *
                 * Instance of [[ParserBlock]]. You may need it to add new rules when
                 * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
                 * [[MarkdownIt.enable]].
                 **/
                this.block = new ParserBlock();

                /**
                 * MarkdownIt#core -> Core
                 *
                 * Instance of [[Core]] chain executor. You may need it to add new rules when
                 * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
                 * [[MarkdownIt.enable]].
                 **/
                this.core = new ParserCore();

                /**
                 * MarkdownIt#renderer -> Renderer
                 *
                 * Instance of [[Renderer]]. Use it to modify output look. Or to add rendering
                 * rules for new token types, generated by plugins.
                 *
                 * ##### Example
                 *
                 * ```javascript
                 * var md = require('markdown-it')();
                 *
                 * function myToken(tokens, idx, options, env, self) {
                 *   //...
                 *   return result;
                 * };
                 *
                 * md.renderer.rules['my_token'] = myToken
                 * ```
                 *
                 * See [[Renderer]] docs and [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js).
                 **/
                this.renderer = new Renderer();

                /**
                 * MarkdownIt#linkify -> LinkifyIt
                 *
                 * [linkify-it](https://github.com/markdown-it/linkify-it) instance.
                 * Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/linkify.js)
                 * rule.
                 **/
                this.linkify = new LinkifyIt();

                /**
                 * MarkdownIt#validateLink(url) -> Boolean
                 *
                 * Link validation function. CommonMark allows too much in links. By default
                 * we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
                 * except some embedded image types.
                 *
                 * You can change this behaviour:
                 *
                 * ```javascript
                 * var md = require('markdown-it')();
                 * // enable everything
                 * md.validateLink = function () { return true; }
                 * ```
                 **/
                this.validateLink = validateLink;

                /**
                 * MarkdownIt#normalizeLink(url) -> String
                 *
                 * Function used to encode link url to a machine-readable format,
                 * which includes url-encoding, punycode, etc.
                 **/
                this.normalizeLink = normalizeLink;

                /**
                 * MarkdownIt#normalizeLinkText(url) -> String
                 *
                 * Function used to decode link url to a human-readable format`
                 **/
                this.normalizeLinkText = normalizeLinkText;


                // Expose utils & helpers for easy acces from plugins

                /**
                 * MarkdownIt#utils -> utils
                 *
                 * Assorted utility functions, useful to write plugins. See details
                 * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/common/utils.js).
                 **/
                this.utils = utils;

                /**
                 * MarkdownIt#helpers -> helpers
                 *
                 * Link components parser functions, useful to write plugins. See details
                 * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/helpers).
                 **/
                this.helpers = utils.assign({}, helpers);


                this.options = {};
                this.configure(presetName);

                if (options) {
                    this.set(options);
                }
            }


            /** chainable
             * MarkdownIt.set(options)
             *
             * Set parser options (in the same format as in constructor). Probably, you
             * will never need it, but you can change options after constructor call.
             *
             * ##### Example
             *
             * ```javascript
             * var md = require('markdown-it')()
             *             .set({ html: true, breaks: true })
             *             .set({ typographer, true });
             * ```
             *
             * __Note:__ To achieve the best possible performance, don't modify a
             * `markdown-it` instance options on the fly. If you need multiple configurations
             * it's best to create multiple instances and initialize each with separate
             * config.
             **/
            MarkdownIt.prototype.set = function(options) {
                utils.assign(this.options, options);
                return this;
            };


            /** chainable, internal
             * MarkdownIt.configure(presets)
             *
             * Batch load of all options and compenent settings. This is internal method,
             * and you probably will not need it. But if you will - see available presets
             * and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/lib/presets)
             *
             * We strongly recommend to use presets instead of direct config loads. That
             * will give better compatibility with next versions.
             **/
            MarkdownIt.prototype.configure = function(presets) {
                var self = this, presetName;

                if (utils.isString(presets)) {
                    presetName = presets;
                    presets = config[presetName];
                    if (!presets) {
                        throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name');
                    }
                }

                if (!presets) {
                    throw new Error('Wrong `markdown-it` preset, can\'t be empty');
                }

                if (presets.options) {
                    self.set(presets.options);
                }

                if (presets.components) {
                    Object.keys(presets.components).forEach(function(name) {
                        if (presets.components[name].rules) {
                            self[name].ruler.enableOnly(presets.components[name].rules);
                        }
                        if (presets.components[name].rules2) {
                            self[name].ruler2.enableOnly(presets.components[name].rules2);
                        }
                    });
                }
                return this;
            };


            /** chainable
             * MarkdownIt.enable(list, ignoreInvalid)
             * - list (String|Array): rule name or list of rule names to enable
             * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
             *
             * Enable list or rules. It will automatically find appropriate components,
             * containing rules with given names. If rule not found, and `ignoreInvalid`
             * not set - throws exception.
             *
             * ##### Example
             *
             * ```javascript
             * var md = require('markdown-it')()
             *             .enable(['sub', 'sup'])
             *             .disable('smartquotes');
             * ```
             **/
            MarkdownIt.prototype.enable = function(list, ignoreInvalid) {
                var result = [];

                if (!Array.isArray(list)) {
                    list = [list];
                }

                ['core', 'block', 'inline'].forEach(function(chain) {
                    result = result.concat(this[chain].ruler.enable(list, true));
                }, this);

                result = result.concat(this.inline.ruler2.enable(list, true));

                var missed = list.filter(function(name) {
                    return result.indexOf(name) < 0;
                });

                if (missed.length && !ignoreInvalid) {
                    throw new Error('MarkdownIt. Failed to enable unknown rule(s): ' + missed);
                }

                return this;
            };


            /** chainable
             * MarkdownIt.disable(list, ignoreInvalid)
             * - list (String|Array): rule name or list of rule names to disable.
             * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
             *
             * The same as [[MarkdownIt.enable]], but turn specified rules off.
             **/
            MarkdownIt.prototype.disable = function(list, ignoreInvalid) {
                var result = [];

                if (!Array.isArray(list)) {
                    list = [list];
                }

                ['core', 'block', 'inline'].forEach(function(chain) {
                    result = result.concat(this[chain].ruler.disable(list, true));
                }, this);

                result = result.concat(this.inline.ruler2.disable(list, true));

                var missed = list.filter(function(name) {
                    return result.indexOf(name) < 0;
                });

                if (missed.length && !ignoreInvalid) {
                    throw new Error('MarkdownIt. Failed to disable unknown rule(s): ' + missed);
                }
                return this;
            };


            /** chainable
             * MarkdownIt.use(plugin, params)
             *
             * Load specified plugin with given params into current parser instance.
             * It's just a sugar to call `plugin(md, params)` with curring.
             *
             * ##### Example
             *
             * ```javascript
             * var iterator = require('markdown-it-for-inline');
             * var md = require('markdown-it')()
             *             .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
             *               tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar');
             *             });
             * ```
             **/
            MarkdownIt.prototype.use = function(plugin /*, params, ... */) {
                var args = [this].concat(Array.prototype.slice.call(arguments, 1));
                plugin.apply(plugin, args);
                return this;
            };


            /** internal
             * MarkdownIt.parse(src, env) -> Array
             * - src (String): source string
             * - env (Object): environment sandbox
             *
             * Parse input string and return list of block tokens (special token type
             * "inline" will contain list of inline tokens). You should not call this
             * method directly, until you write custom renderer (for example, to produce
             * AST).
             *
             * `env` is used to pass data between "distributed" rules and return additional
             * metadata like reference info, needed for the renderer. It also can be used to
             * inject data in specific cases. Usually, you will be ok to pass `{}`,
             * and then pass updated object to renderer.
             **/
            MarkdownIt.prototype.parse = function(src, env) {
                if (typeof src !== 'string') {
                    throw new Error('Input data should be a String');
                }

                var state = new this.core.State(src, this, env);

                this.core.process(state);

                return state.tokens;
            };


            /**
             * MarkdownIt.render(src [, env]) -> String
             * - src (String): source string
             * - env (Object): environment sandbox
             *
             * Render markdown string into html. It does all magic for you :).
             *
             * `env` can be used to inject additional metadata (`{}` by default).
             * But you will not need it with high probability. See also comment
             * in [[MarkdownIt.parse]].
             **/
            MarkdownIt.prototype.render = function(src, env) {
                env = env || {};

                return this.renderer.render(this.parse(src, env), this.options, env);
            };


            /** internal
             * MarkdownIt.parseInline(src, env) -> Array
             * - src (String): source string
             * - env (Object): environment sandbox
             *
             * The same as [[MarkdownIt.parse]] but skip all block rules. It returns the
             * block tokens list with the single `inline` element, containing parsed inline
             * tokens in `children` property. Also updates `env` object.
             **/
            MarkdownIt.prototype.parseInline = function(src, env) {
                var state = new this.core.State(src, this, env);

                state.inlineMode = true;
                this.core.process(state);

                return state.tokens;
            };


            /**
             * MarkdownIt.renderInline(src [, env]) -> String
             * - src (String): source string
             * - env (Object): environment sandbox
             *
             * Similar to [[MarkdownIt.render]] but for single paragraph content. Result
             * will NOT be wrapped into `<p>` tags.
             **/
            MarkdownIt.prototype.renderInline = function(src, env) {
                env = env || {};

                return this.renderer.render(this.parseInline(src, env), this.options, env);
            };


            module.exports = MarkdownIt;


            /***/
        }),

        /***/ 8007:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
            /** internal
             * class ParserBlock
             *
             * Block-level tokenizer.
             **/



            var Ruler = __nccwpck_require__(2093);


            var _rules = [
                // First 2 params - rule name & source. Secondary array - list of rules,
                // which can be terminated by this one.
                ['table', __nccwpck_require__(7722), ['paragraph', 'reference']],
                ['code', __nccwpck_require__(7693)],
                ['fence', __nccwpck_require__(7749), ['paragraph', 'reference', 'blockquote', 'list']],
                ['blockquote', __nccwpck_require__(6888), ['paragraph', 'reference', 'blockquote', 'list']],
                ['hr', __nccwpck_require__(3514), ['paragraph', 'reference', 'blockquote', 'list']],
                ['list', __nccwpck_require__(2050), ['paragraph', 'reference', 'blockquote']],
                ['reference', __nccwpck_require__(2235)],
                ['html_block', __nccwpck_require__(5732), ['paragraph', 'reference', 'blockquote']],
                ['heading', __nccwpck_require__(2702), ['paragraph', 'reference', 'blockquote']],
                ['lheading', __nccwpck_require__(3551)],
                ['paragraph', __nccwpck_require__(9450)]
            ];


            /**
             * new ParserBlock()
             **/
            function ParserBlock() {
                /**
                 * ParserBlock#ruler -> Ruler
                 *
                 * [[Ruler]] instance. Keep configuration of block rules.
                 **/
                this.ruler = new Ruler();

                for (var i = 0; i < _rules.length; i++) {
                    this.ruler.push(_rules[i][0], _rules[i][1], { alt: (_rules[i][2] || []).slice() });
                }
            }


// Generate tokens for input range
//
            ParserBlock.prototype.tokenize = function(state, startLine, endLine) {
                var ok, i, prevLine,
                  rules = this.ruler.getRules(''),
                  len = rules.length,
                  line = startLine,
                  hasEmptyLines = false,
                  maxNesting = state.md.options.maxNesting;

                while (line < endLine) {
                    state.line = line = state.skipEmptyLines(line);
                    if (line >= endLine) {
                        break;
                    }

                    // Termination condition for nested calls.
                    // Nested calls currently used for blockquotes & lists
                    if (state.sCount[line] < state.blkIndent) {
                        break;
                    }

                    // If nesting level exceeded - skip tail to the end. That's not ordinary
                    // situation and we should not care about content.
                    if (state.level >= maxNesting) {
                        state.line = endLine;
                        break;
                    }

                    // Try all possible rules.
                    // On success, rule should:
                    //
                    // - update `state.line`
                    // - update `state.tokens`
                    // - return true
                    prevLine = state.line;

                    for (i = 0; i < len; i++) {
                        ok = rules[i](state, line, endLine, false);
                        if (ok) {
                            if (prevLine >= state.line) {
                                throw new Error("block rule didn't increment state.line");
                            }
                            break;
                        }
                    }

                    // this can only happen if user disables paragraph rule
                    if (!ok) throw new Error('none of the block rules matched');

                    // set state.tight if we had an empty line before current tag
                    // i.e. latest empty line should not count
                    state.tight = !hasEmptyLines;

                    // paragraph might "eat" one newline after it in nested lists
                    if (state.isEmpty(state.line - 1)) {
                        hasEmptyLines = true;
                    }

                    line = state.line;

                    if (line < endLine && state.isEmpty(line)) {
                        hasEmptyLines = true;
                        line++;
                        state.line = line;
                    }
                }
            };


            /**
             * ParserBlock.parse(str, md, env, outTokens)
             *
             * Process input string and push block tokens into `outTokens`
             **/
            ParserBlock.prototype.parse = function(src, md, env, outTokens) {
                var state;

                if (!src) {
                    return;
                }

                state = new this.State(src, md, env, outTokens);

                this.tokenize(state, state.line, state.lineMax);
            };


            ParserBlock.prototype.State = __nccwpck_require__(9497);


            module.exports = ParserBlock;


            /***/
        }),

        /***/ 4004:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
            /** internal
             * class Core
             *
             * Top-level rules executor. Glues block/inline parsers and does intermediate
             * transformations.
             **/



            var Ruler = __nccwpck_require__(2093);


            var _rules = [
                ['normalize', __nccwpck_require__(2764)],
                ['block', __nccwpck_require__(31)],
                ['inline', __nccwpck_require__(1951)],
                ['linkify', __nccwpck_require__(5462)],
                ['replacements', __nccwpck_require__(8373)],
                ['smartquotes', __nccwpck_require__(2178)],
                // `text_join` finds `text_special` tokens (for escape sequences)
                // and joins them with the rest of the text
                ['text_join', __nccwpck_require__(7502)]
            ];


            /**
             * new Core()
             **/
            function Core() {
                /**
                 * Core#ruler -> Ruler
                 *
                 * [[Ruler]] instance. Keep configuration of core rules.
                 **/
                this.ruler = new Ruler();

                for (var i = 0; i < _rules.length; i++) {
                    this.ruler.push(_rules[i][0], _rules[i][1]);
                }
            }


            /**
             * Core.process(state)
             *
             * Executes core chain rules.
             **/
            Core.prototype.process = function(state) {
                var i, l, rules;

                rules = this.ruler.getRules('');

                for (i = 0, l = rules.length; i < l; i++) {
                    rules[i](state);
                }
            };

            Core.prototype.State = __nccwpck_require__(9052);


            module.exports = Core;


            /***/
        }),

        /***/ 6031:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
            /** internal
             * class ParserInline
             *
             * Tokenizes paragraph content.
             **/



            var Ruler = __nccwpck_require__(2093);


////////////////////////////////////////////////////////////////////////////////
// Parser rules

            var _rules = [
                ['text', __nccwpck_require__(1117)],
                ['linkify', __nccwpck_require__(1783)],
                ['newline', __nccwpck_require__(8774)],
                ['escape', __nccwpck_require__(1836)],
                ['backticks', __nccwpck_require__(8520)],
                ['strikethrough', (__nccwpck_require__(3015)/* .tokenize */.w)],
                ['emphasis', (__nccwpck_require__(1677)/* .tokenize */.w)],
                ['link', __nccwpck_require__(8798)],
                ['image', __nccwpck_require__(9998)],
                ['autolink', __nccwpck_require__(3939)],
                ['html_inline', __nccwpck_require__(7753)],
                ['entity', __nccwpck_require__(973)]
            ];

// `rule2` ruleset was created specifically for emphasis/strikethrough
// post-processing and may be changed in the future.
//
// Don't use this for anything except pairs (plugins working with `balance_pairs`).
//
            var _rules2 = [
                ['balance_pairs', __nccwpck_require__(9418)],
                ['strikethrough', (__nccwpck_require__(3015)/* .postProcess */.g)],
                ['emphasis', (__nccwpck_require__(1677)/* .postProcess */.g)],
                // rules for pairs separate '**' into its own text tokens, which may be left unused,
                // rule below merges unused segments back with the rest of the text
                ['fragments_join', __nccwpck_require__(3807)]
            ];


            /**
             * new ParserInline()
             **/
            function ParserInline() {
                var i;

                /**
                 * ParserInline#ruler -> Ruler
                 *
                 * [[Ruler]] instance. Keep configuration of inline rules.
                 **/
                this.ruler = new Ruler();

                for (i = 0; i < _rules.length; i++) {
                    this.ruler.push(_rules[i][0], _rules[i][1]);
                }

                /**
                 * ParserInline#ruler2 -> Ruler
                 *
                 * [[Ruler]] instance. Second ruler used for post-processing
                 * (e.g. in emphasis-like rules).
                 **/
                this.ruler2 = new Ruler();

                for (i = 0; i < _rules2.length; i++) {
                    this.ruler2.push(_rules2[i][0], _rules2[i][1]);
                }
            }


// Skip single token by running all rules in validation mode;
// returns `true` if any rule reported success
//
            ParserInline.prototype.skipToken = function(state) {
                var ok, i, pos = state.pos,
                  rules = this.ruler.getRules(''),
                  len = rules.length,
                  maxNesting = state.md.options.maxNesting,
                  cache = state.cache;


                if (typeof cache[pos] !== 'undefined') {
                    state.pos = cache[pos];
                    return;
                }

                if (state.level < maxNesting) {
                    for (i = 0; i < len; i++) {
                        // Increment state.level and decrement it later to limit recursion.
                        // It's harmless to do here, because no tokens are created. But ideally,
                        // we'd need a separate private state variable for this purpose.
                        //
                        state.level++;
                        ok = rules[i](state, true);
                        state.level--;

                        if (ok) {
                            if (pos >= state.pos) {
                                throw new Error("inline rule didn't increment state.pos");
                            }
                            break;
                        }
                    }
                } else {
                    // Too much nesting, just skip until the end of the paragraph.
                    //
                    // NOTE: this will cause links to behave incorrectly in the following case,
                    //       when an amount of `[` is exactly equal to `maxNesting + 1`:
                    //
                    //       [[[[[[[[[[[[[[[[[[[[[foo]()
                    //
                    // TODO: remove this workaround when CM standard will allow nested links
                    //       (we can replace it by preventing links from being parsed in
                    //       validation mode)
                    //
                    state.pos = state.posMax;
                }

                if (!ok) {
                    state.pos++;
                }
                cache[pos] = state.pos;
            };


// Generate tokens for input range
//
            ParserInline.prototype.tokenize = function(state) {
                var ok, i, prevPos,
                  rules = this.ruler.getRules(''),
                  len = rules.length,
                  end = state.posMax,
                  maxNesting = state.md.options.maxNesting;

                while (state.pos < end) {
                    // Try all possible rules.
                    // On success, rule should:
                    //
                    // - update `state.pos`
                    // - update `state.tokens`
                    // - return true
                    prevPos = state.pos;

                    if (state.level < maxNesting) {
                        for (i = 0; i < len; i++) {
                            ok = rules[i](state, false);
                            if (ok) {
                                if (prevPos >= state.pos) {
                                    throw new Error("inline rule didn't increment state.pos");
                                }
                                break;
                            }
                        }
                    }

                    if (ok) {
                        if (state.pos >= end) {
                            break;
                        }
                        continue;
                    }

                    state.pending += state.src[state.pos++];
                }

                if (state.pending) {
                    state.pushPending();
                }
            };


            /**
             * ParserInline.parse(str, md, env, outTokens)
             *
             * Process input string and push inline tokens into `outTokens`
             **/
            ParserInline.prototype.parse = function(str, md, env, outTokens) {
                var i, rules, len;
                var state = new this.State(str, md, env, outTokens);

                this.tokenize(state);

                rules = this.ruler2.getRules('');
                len = rules.length;

                for (i = 0; i < len; i++) {
                    rules[i](state);
                }
            };


            ParserInline.prototype.State = __nccwpck_require__(1247);


            module.exports = ParserInline;


            /***/
        }),

        /***/ 3084:
        /***/ ((module) => {

            "use strict";
// Commonmark default options


            module.exports = {
                options: {
                    html: true,         // Enable HTML tags in source
                    xhtmlOut: true,         // Use '/' to close single tags (<br />)
                    breaks: false,        // Convert '\n' in paragraphs into <br>
                    langPrefix: 'language-',  // CSS language prefix for fenced blocks
                    linkify: false,        // autoconvert URL-like texts to links

                    // Enable some language-neutral replacements + quotes beautification
                    typographer: false,

                    // Double + single quotes replacement pairs, when typographer enabled,
                    // and smartquotes on. Could be either a String or an Array.
                    //
                    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
                    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
                    quotes: '\u201c\u201d\u2018\u2019', /* “”‘’ */

                    // Highlighter function. Should return escaped HTML,
                    // or '' if the source string is not changed and should be escaped externaly.
                    // If result starts with <pre... internal wrapper is skipped.
                    //
                    // function (/*str, lang*/) { return ''; }
                    //
                    highlight: null,

                    maxNesting: 20            // Internal protection, recursion limit
                },

                components: {

                    core: {
                        rules: [
                            'normalize',
                            'block',
                            'inline',
                            'text_join'
                        ]
                    },

                    block: {
                        rules: [
                            'blockquote',
                            'code',
                            'fence',
                            'heading',
                            'hr',
                            'html_block',
                            'lheading',
                            'list',
                            'reference',
                            'paragraph'
                        ]
                    },

                    inline: {
                        rules: [
                            'autolink',
                            'backticks',
                            'emphasis',
                            'entity',
                            'escape',
                            'html_inline',
                            'image',
                            'link',
                            'newline',
                            'text'
                        ],
                        rules2: [
                            'balance_pairs',
                            'emphasis',
                            'fragments_join'
                        ]
                    }
                }
            };


            /***/
        }),

        /***/ 1007:
        /***/ ((module) => {

            "use strict";
// markdown-it default options


            module.exports = {
                options: {
                    html: false,        // Enable HTML tags in source
                    xhtmlOut: false,        // Use '/' to close single tags (<br />)
                    breaks: false,        // Convert '\n' in paragraphs into <br>
                    langPrefix: 'language-',  // CSS language prefix for fenced blocks
                    linkify: false,        // autoconvert URL-like texts to links

                    // Enable some language-neutral replacements + quotes beautification
                    typographer: false,

                    // Double + single quotes replacement pairs, when typographer enabled,
                    // and smartquotes on. Could be either a String or an Array.
                    //
                    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
                    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
                    quotes: '\u201c\u201d\u2018\u2019', /* “”‘’ */

                    // Highlighter function. Should return escaped HTML,
                    // or '' if the source string is not changed and should be escaped externaly.
                    // If result starts with <pre... internal wrapper is skipped.
                    //
                    // function (/*str, lang*/) { return ''; }
                    //
                    highlight: null,

                    maxNesting: 100            // Internal protection, recursion limit
                },

                components: {

                    core: {},
                    block: {},
                    inline: {}
                }
            };


            /***/
        }),

        /***/ 6719:
        /***/ ((module) => {

            "use strict";
// "Zero" preset, with nothing enabled. Useful for manual configuring of simple
// modes. For example, to parse bold/italic only.


            module.exports = {
                options: {
                    html: false,        // Enable HTML tags in source
                    xhtmlOut: false,        // Use '/' to close single tags (<br />)
                    breaks: false,        // Convert '\n' in paragraphs into <br>
                    langPrefix: 'language-',  // CSS language prefix for fenced blocks
                    linkify: false,        // autoconvert URL-like texts to links

                    // Enable some language-neutral replacements + quotes beautification
                    typographer: false,

                    // Double + single quotes replacement pairs, when typographer enabled,
                    // and smartquotes on. Could be either a String or an Array.
                    //
                    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
                    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
                    quotes: '\u201c\u201d\u2018\u2019', /* “”‘’ */

                    // Highlighter function. Should return escaped HTML,
                    // or '' if the source string is not changed and should be escaped externaly.
                    // If result starts with <pre... internal wrapper is skipped.
                    //
                    // function (/*str, lang*/) { return ''; }
                    //
                    highlight: null,

                    maxNesting: 20            // Internal protection, recursion limit
                },

                components: {

                    core: {
                        rules: [
                            'normalize',
                            'block',
                            'inline',
                            'text_join'
                        ]
                    },

                    block: {
                        rules: [
                            'paragraph'
                        ]
                    },

                    inline: {
                        rules: [
                            'text'
                        ],
                        rules2: [
                            'balance_pairs',
                            'fragments_join'
                        ]
                    }
                }
            };


            /***/
        }),

        /***/ 3041:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
            /**
             * class Renderer
             *
             * Generates HTML from parsed token stream. Each instance has independent
             * copy of rules. Those can be rewritten with ease. Also, you can add new
             * rules if you create plugin and adds new token types.
             **/



            var assign = (__nccwpck_require__(506).assign);
            var unescapeAll = (__nccwpck_require__(506).unescapeAll);
            var escapeHtml = (__nccwpck_require__(506).escapeHtml);


////////////////////////////////////////////////////////////////////////////////

            var default_rules = {};


            default_rules.code_inline = function(tokens, idx, options, env, slf) {
                var token = tokens[idx];

                return '<code' + slf.renderAttrs(token) + '>' +
                  escapeHtml(token.content) +
                  '</code>';
            };


            default_rules.code_block = function(tokens, idx, options, env, slf) {
                var token = tokens[idx];

                return '<pre' + slf.renderAttrs(token) + '><code>' +
                  escapeHtml(tokens[idx].content) +
                  '</code></pre>\n';
            };


            default_rules.fence = function(tokens, idx, options, env, slf) {
                var token = tokens[idx],
                  info = token.info ? unescapeAll(token.info).trim() : '',
                  langName = '',
                  langAttrs = '',
                  highlighted, i, arr, tmpAttrs, tmpToken;

                if (info) {
                    arr = info.split(/(\s+)/g);
                    langName = arr[0];
                    langAttrs = arr.slice(2).join('');
                }

                if (options.highlight) {
                    highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml(token.content);
                } else {
                    highlighted = escapeHtml(token.content);
                }

                if (highlighted.indexOf('<pre') === 0) {
                    return highlighted + '\n';
                }

                // If language exists, inject class gently, without modifying original token.
                // May be, one day we will add .deepClone() for token and simplify this part, but
                // now we prefer to keep things local.
                if (info) {
                    i = token.attrIndex('class');
                    tmpAttrs = token.attrs ? token.attrs.slice() : [];

                    if (i < 0) {
                        tmpAttrs.push(['class', options.langPrefix + langName]);
                    } else {
                        tmpAttrs[i] = tmpAttrs[i].slice();
                        tmpAttrs[i][1] += ' ' + options.langPrefix + langName;
                    }

                    // Fake token just to render attributes
                    tmpToken = {
                        attrs: tmpAttrs
                    };

                    return '<pre><code' + slf.renderAttrs(tmpToken) + '>'
                      + highlighted
                      + '</code></pre>\n';
                }


                return '<pre><code' + slf.renderAttrs(token) + '>'
                  + highlighted
                  + '</code></pre>\n';
            };


            default_rules.image = function(tokens, idx, options, env, slf) {
                var token = tokens[idx];

                // "alt" attr MUST be set, even if empty. Because it's mandatory and
                // should be placed on proper position for tests.
                //
                // Replace content with actual value

                token.attrs[token.attrIndex('alt')][1] =
                  slf.renderInlineAsText(token.children, options, env);

                return slf.renderToken(tokens, idx, options);
            };


            default_rules.hardbreak = function(tokens, idx, options /*, env */) {
                return options.xhtmlOut ? '<br />\n' : '<br>\n';
            };
            default_rules.softbreak = function(tokens, idx, options /*, env */) {
                return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
            };


            default_rules.text = function(tokens, idx /*, options, env */) {
                return escapeHtml(tokens[idx].content);
            };


            default_rules.html_block = function(tokens, idx /*, options, env */) {
                return tokens[idx].content;
            };
            default_rules.html_inline = function(tokens, idx /*, options, env */) {
                return tokens[idx].content;
            };


            /**
             * new Renderer()
             *
             * Creates new [[Renderer]] instance and fill [[Renderer#rules]] with defaults.
             **/
            function Renderer() {

                /**
                 * Renderer#rules -> Object
                 *
                 * Contains render rules for tokens. Can be updated and extended.
                 *
                 * ##### Example
                 *
                 * ```javascript
                 * var md = require('markdown-it')();
                 *
                 * md.renderer.rules.strong_open  = function () { return '<b>'; };
                 * md.renderer.rules.strong_close = function () { return '</b>'; };
                 *
                 * var result = md.renderInline(...);
                 * ```
                 *
                 * Each rule is called as independent static function with fixed signature:
                 *
                 * ```javascript
                 * function my_token_render(tokens, idx, options, env, renderer) {
                 *   // ...
                 *   return renderedHTML;
                 * }
                 * ```
                 *
                 * See [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js)
                 * for more details and examples.
                 **/
                this.rules = assign({}, default_rules);
            }


            /**
             * Renderer.renderAttrs(token) -> String
             *
             * Render token attributes to string.
             **/
            Renderer.prototype.renderAttrs = function renderAttrs(token) {
                var i, l, result;

                if (!token.attrs) {
                    return '';
                }

                result = '';

                for (i = 0, l = token.attrs.length; i < l; i++) {
                    result += ' ' + escapeHtml(token.attrs[i][0]) + '="' + escapeHtml(token.attrs[i][1]) + '"';
                }

                return result;
            };


            /**
             * Renderer.renderToken(tokens, idx, options) -> String
             * - tokens (Array): list of tokens
             * - idx (Numbed): token index to render
             * - options (Object): params of parser instance
             *
             * Default token renderer. Can be overriden by custom function
             * in [[Renderer#rules]].
             **/
            Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
                var nextToken,
                  result = '',
                  needLf = false,
                  token = tokens[idx];

                // Tight list paragraphs
                if (token.hidden) {
                    return '';
                }

                // Insert a newline between hidden paragraph and subsequent opening
                // block-level tag.
                //
                // For example, here we should insert a newline before blockquote:
                //  - a
                //    >
                //
                if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) {
                    result += '\n';
                }

                // Add token name, e.g. `<img`
                result += (token.nesting === -1 ? '</' : '<') + token.tag;

                // Encode attributes, e.g. `<img src="foo"`
                result += this.renderAttrs(token);

                // Add a slash for self-closing tags, e.g. `<img src="foo" /`
                if (token.nesting === 0 && options.xhtmlOut) {
                    result += ' /';
                }

                // Check if we need to add a newline after this tag
                if (token.block) {
                    needLf = true;

                    if (token.nesting === 1) {
                        if (idx + 1 < tokens.length) {
                            nextToken = tokens[idx + 1];

                            if (nextToken.type === 'inline' || nextToken.hidden) {
                                // Block-level tag containing an inline tag.
                                //
                                needLf = false;

                            } else if (nextToken.nesting === -1 && nextToken.tag === token.tag) {
                                // Opening tag + closing tag of the same type. E.g. `<li></li>`.
                                //
                                needLf = false;
                            }
                        }
                    }
                }

                result += needLf ? '>\n' : '>';

                return result;
            };


            /**
             * Renderer.renderInline(tokens, options, env) -> String
             * - tokens (Array): list on block tokens to render
             * - options (Object): params of parser instance
             * - env (Object): additional data from parsed input (references, for example)
             *
             * The same as [[Renderer.render]], but for single token of `inline` type.
             **/
            Renderer.prototype.renderInline = function(tokens, options, env) {
                var type,
                  result = '',
                  rules = this.rules;

                for (var i = 0, len = tokens.length; i < len; i++) {
                    type = tokens[i].type;

                    if (typeof rules[type] !== 'undefined') {
                        result += rules[type](tokens, i, options, env, this);
                    } else {
                        result += this.renderToken(tokens, i, options);
                    }
                }

                return result;
            };


            /** internal
             * Renderer.renderInlineAsText(tokens, options, env) -> String
             * - tokens (Array): list on block tokens to render
             * - options (Object): params of parser instance
             * - env (Object): additional data from parsed input (references, for example)
             *
             * Special kludge for image `alt` attributes to conform CommonMark spec.
             * Don't try to use it! Spec requires to show `alt` content with stripped markup,
             * instead of simple escaping.
             **/
            Renderer.prototype.renderInlineAsText = function(tokens, options, env) {
                var result = '';

                for (var i = 0, len = tokens.length; i < len; i++) {
                    if (tokens[i].type === 'text') {
                        result += tokens[i].content;
                    } else if (tokens[i].type === 'image') {
                        result += this.renderInlineAsText(tokens[i].children, options, env);
                    } else if (tokens[i].type === 'softbreak') {
                        result += '\n';
                    }
                }

                return result;
            };


            /**
             * Renderer.render(tokens, options, env) -> String
             * - tokens (Array): list on block tokens to render
             * - options (Object): params of parser instance
             * - env (Object): additional data from parsed input (references, for example)
             *
             * Takes token stream and generates HTML. Probably, you will never need to call
             * this method directly.
             **/
            Renderer.prototype.render = function(tokens, options, env) {
                var i, len, type,
                  result = '',
                  rules = this.rules;

                for (i = 0, len = tokens.length; i < len; i++) {
                    type = tokens[i].type;

                    if (type === 'inline') {
                        result += this.renderInline(tokens[i].children, options, env);
                    } else if (typeof rules[type] !== 'undefined') {
                        result += rules[type](tokens, i, options, env, this);
                    } else {
                        result += this.renderToken(tokens, i, options, env);
                    }
                }

                return result;
            };

            module.exports = Renderer;


            /***/
        }),

        /***/ 2093:
        /***/ ((module) => {

            "use strict";

            /**
             * class Ruler
             *
             * Helper class, used by [[MarkdownIt#core]], [[MarkdownIt#block]] and
             * [[MarkdownIt#inline]] to manage sequences of functions (rules):
             *
             * - keep rules in defined order
             * - assign the name to each rule
             * - enable/disable rules
             * - add/replace rules
             * - allow assign rules to additional named chains (in the same)
             * - cacheing lists of active rules
             *
             * You will not need use this class directly until write plugins. For simple
             * rules control use [[MarkdownIt.disable]], [[MarkdownIt.enable]] and
             * [[MarkdownIt.use]].
             **/


            /**
             * new Ruler()
             **/
            function Ruler() {
                // List of added rules. Each element is:
                //
                // {
                //   name: XXX,
                //   enabled: Boolean,
                //   fn: Function(),
                //   alt: [ name2, name3 ]
                // }
                //
                this.__rules__ = [];

                // Cached rule chains.
                //
                // First level - chain name, '' for default.
                // Second level - diginal anchor for fast filtering by charcodes.
                //
                this.__cache__ = null;
            }

////////////////////////////////////////////////////////////////////////////////
// Helper methods, should not be used directly


// Find rule index by name
//
            Ruler.prototype.__find__ = function(name) {
                for (var i = 0; i < this.__rules__.length; i++) {
                    if (this.__rules__[i].name === name) {
                        return i;
                    }
                }
                return -1;
            };


// Build rules lookup cache
//
            Ruler.prototype.__compile__ = function() {
                var self = this;
                var chains = [''];

                // collect unique names
                self.__rules__.forEach(function(rule) {
                    if (!rule.enabled) {
                        return;
                    }

                    rule.alt.forEach(function(altName) {
                        if (chains.indexOf(altName) < 0) {
                            chains.push(altName);
                        }
                    });
                });

                self.__cache__ = {};

                chains.forEach(function(chain) {
                    self.__cache__[chain] = [];
                    self.__rules__.forEach(function(rule) {
                        if (!rule.enabled) {
                            return;
                        }

                        if (chain && rule.alt.indexOf(chain) < 0) {
                            return;
                        }

                        self.__cache__[chain].push(rule.fn);
                    });
                });
            };


            /**
             * Ruler.at(name, fn [, options])
             * - name (String): rule name to replace.
             * - fn (Function): new rule function.
             * - options (Object): new rule options (not mandatory).
             *
             * Replace rule by name with new function & options. Throws error if name not
             * found.
             *
             * ##### Options:
             *
             * - __alt__ - array with names of "alternate" chains.
             *
             * ##### Example
             *
             * Replace existing typographer replacement rule with new one:
             *
             * ```javascript
             * var md = require('markdown-it')();
             *
             * md.core.ruler.at('replacements', function replace(state) {
             *   //...
             * });
             * ```
             **/
            Ruler.prototype.at = function(name, fn, options) {
                var index = this.__find__(name);
                var opt = options || {};

                if (index === -1) {
                    throw new Error('Parser rule not found: ' + name);
                }

                this.__rules__[index].fn = fn;
                this.__rules__[index].alt = opt.alt || [];
                this.__cache__ = null;
            };


            /**
             * Ruler.before(beforeName, ruleName, fn [, options])
             * - beforeName (String): new rule will be added before this one.
             * - ruleName (String): name of added rule.
             * - fn (Function): rule function.
             * - options (Object): rule options (not mandatory).
             *
             * Add new rule to chain before one with given name. See also
             * [[Ruler.after]], [[Ruler.push]].
             *
             * ##### Options:
             *
             * - __alt__ - array with names of "alternate" chains.
             *
             * ##### Example
             *
             * ```javascript
             * var md = require('markdown-it')();
             *
             * md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
             *   //...
             * });
             * ```
             **/
            Ruler.prototype.before = function(beforeName, ruleName, fn, options) {
                var index = this.__find__(beforeName);
                var opt = options || {};

                if (index === -1) {
                    throw new Error('Parser rule not found: ' + beforeName);
                }

                this.__rules__.splice(index, 0, {
                    name: ruleName,
                    enabled: true,
                    fn: fn,
                    alt: opt.alt || []
                });

                this.__cache__ = null;
            };


            /**
             * Ruler.after(afterName, ruleName, fn [, options])
             * - afterName (String): new rule will be added after this one.
             * - ruleName (String): name of added rule.
             * - fn (Function): rule function.
             * - options (Object): rule options (not mandatory).
             *
             * Add new rule to chain after one with given name. See also
             * [[Ruler.before]], [[Ruler.push]].
             *
             * ##### Options:
             *
             * - __alt__ - array with names of "alternate" chains.
             *
             * ##### Example
             *
             * ```javascript
             * var md = require('markdown-it')();
             *
             * md.inline.ruler.after('text', 'my_rule', function replace(state) {
             *   //...
             * });
             * ```
             **/
            Ruler.prototype.after = function(afterName, ruleName, fn, options) {
                var index = this.__find__(afterName);
                var opt = options || {};

                if (index === -1) {
                    throw new Error('Parser rule not found: ' + afterName);
                }

                this.__rules__.splice(index + 1, 0, {
                    name: ruleName,
                    enabled: true,
                    fn: fn,
                    alt: opt.alt || []
                });

                this.__cache__ = null;
            };

            /**
             * Ruler.push(ruleName, fn [, options])
             * - ruleName (String): name of added rule.
             * - fn (Function): rule function.
             * - options (Object): rule options (not mandatory).
             *
             * Push new rule to the end of chain. See also
             * [[Ruler.before]], [[Ruler.after]].
             *
             * ##### Options:
             *
             * - __alt__ - array with names of "alternate" chains.
             *
             * ##### Example
             *
             * ```javascript
             * var md = require('markdown-it')();
             *
             * md.core.ruler.push('my_rule', function replace(state) {
             *   //...
             * });
             * ```
             **/
            Ruler.prototype.push = function(ruleName, fn, options) {
                var opt = options || {};

                this.__rules__.push({
                    name: ruleName,
                    enabled: true,
                    fn: fn,
                    alt: opt.alt || []
                });

                this.__cache__ = null;
            };


            /**
             * Ruler.enable(list [, ignoreInvalid]) -> Array
             * - list (String|Array): list of rule names to enable.
             * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
             *
             * Enable rules with given names. If any rule name not found - throw Error.
             * Errors can be disabled by second param.
             *
             * Returns list of found rule names (if no exception happened).
             *
             * See also [[Ruler.disable]], [[Ruler.enableOnly]].
             **/
            Ruler.prototype.enable = function(list, ignoreInvalid) {
                if (!Array.isArray(list)) {
                    list = [list];
                }

                var result = [];

                // Search by name and enable
                list.forEach(function(name) {
                    var idx = this.__find__(name);

                    if (idx < 0) {
                        if (ignoreInvalid) {
                            return;
                        }
                        throw new Error('Rules manager: invalid rule name ' + name);
                    }
                    this.__rules__[idx].enabled = true;
                    result.push(name);
                }, this);

                this.__cache__ = null;
                return result;
            };


            /**
             * Ruler.enableOnly(list [, ignoreInvalid])
             * - list (String|Array): list of rule names to enable (whitelist).
             * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
             *
             * Enable rules with given names, and disable everything else. If any rule name
             * not found - throw Error. Errors can be disabled by second param.
             *
             * See also [[Ruler.disable]], [[Ruler.enable]].
             **/
            Ruler.prototype.enableOnly = function(list, ignoreInvalid) {
                if (!Array.isArray(list)) {
                    list = [list];
                }

                this.__rules__.forEach(function(rule) {
                    rule.enabled = false;
                });

                this.enable(list, ignoreInvalid);
            };


            /**
             * Ruler.disable(list [, ignoreInvalid]) -> Array
             * - list (String|Array): list of rule names to disable.
             * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
             *
             * Disable rules with given names. If any rule name not found - throw Error.
             * Errors can be disabled by second param.
             *
             * Returns list of found rule names (if no exception happened).
             *
             * See also [[Ruler.enable]], [[Ruler.enableOnly]].
             **/
            Ruler.prototype.disable = function(list, ignoreInvalid) {
                if (!Array.isArray(list)) {
                    list = [list];
                }

                var result = [];

                // Search by name and disable
                list.forEach(function(name) {
                    var idx = this.__find__(name);

                    if (idx < 0) {
                        if (ignoreInvalid) {
                            return;
                        }
                        throw new Error('Rules manager: invalid rule name ' + name);
                    }
                    this.__rules__[idx].enabled = false;
                    result.push(name);
                }, this);

                this.__cache__ = null;
                return result;
            };


            /**
             * Ruler.getRules(chainName) -> Array
             *
             * Return array of active functions (rules) for given chain name. It analyzes
             * rules configuration, compiles caches if not exists and returns result.
             *
             * Default chain name is `''` (empty string). It can't be skipped. That's
             * done intentionally, to keep signature monomorphic for high speed.
             **/
            Ruler.prototype.getRules = function(chainName) {
                if (this.__cache__ === null) {
                    this.__compile__();
                }

                // Chain can be empty, if rules disabled. But we still have to return Array.
                return this.__cache__[chainName] || [];
            };

            module.exports = Ruler;


            /***/
        }),

        /***/ 6888:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Block quotes


            var isSpace = (__nccwpck_require__(506).isSpace);


            module.exports = function blockquote(state, startLine, endLine, silent) {
                var adjustTab,
                  ch,
                  i,
                  initial,
                  l,
                  lastLineEmpty,
                  lines,
                  nextLine,
                  offset,
                  oldBMarks,
                  oldBSCount,
                  oldIndent,
                  oldParentType,
                  oldSCount,
                  oldTShift,
                  spaceAfterMarker,
                  terminate,
                  terminatorRules,
                  token,
                  isOutdented,
                  oldLineMax = state.lineMax,
                  pos = state.bMarks[startLine] + state.tShift[startLine],
                  max = state.eMarks[startLine];

                // if it's indented more than 3 spaces, it should be a code block
                if (state.sCount[startLine] - state.blkIndent >= 4) {
                    return false;
                }

                // check the block quote marker
                if (state.src.charCodeAt(pos) !== 0x3E/* > */) {
                    return false;
                }

                // we know that it's going to be a valid blockquote,
                // so no point trying to find the end of it in silent mode
                if (silent) {
                    return true;
                }

                oldBMarks = [];
                oldBSCount = [];
                oldSCount = [];
                oldTShift = [];

                terminatorRules = state.md.block.ruler.getRules('blockquote');

                oldParentType = state.parentType;
                state.parentType = 'blockquote';

                // Search the end of the block
                //
                // Block ends with either:
                //  1. an empty line outside:
                //     ```
                //     > test
                //
                //     ```
                //  2. an empty line inside:
                //     ```
                //     >
                //     test
                //     ```
                //  3. another tag:
                //     ```
                //     > test
                //      - - -
                //     ```
                for (nextLine = startLine; nextLine < endLine; nextLine++) {
                    // check if it's outdented, i.e. it's inside list item and indented
                    // less than said list item:
                    //
                    // ```
                    // 1. anything
                    //    > current blockquote
                    // 2. checking this line
                    // ```
                    isOutdented = state.sCount[nextLine] < state.blkIndent;

                    pos = state.bMarks[nextLine] + state.tShift[nextLine];
                    max = state.eMarks[nextLine];

                    if (pos >= max) {
                        // Case 1: line is not inside the blockquote, and this line is empty.
                        break;
                    }

                    if (state.src.charCodeAt(pos++) === 0x3E/* > */ && !isOutdented) {
                        // This line is inside the blockquote.

                        // set offset past spaces and ">"
                        initial = state.sCount[nextLine] + 1;

                        // skip one optional space after '>'
                        if (state.src.charCodeAt(pos) === 0x20 /* space */) {
                            // ' >   test '
                            //     ^ -- position start of line here:
                            pos++;
                            initial++;
                            adjustTab = false;
                            spaceAfterMarker = true;
                        } else if (state.src.charCodeAt(pos) === 0x09 /* tab */) {
                            spaceAfterMarker = true;

                            if ((state.bsCount[nextLine] + initial) % 4 === 3) {
                                // '  >\t  test '
                                //       ^ -- position start of line here (tab has width===1)
                                pos++;
                                initial++;
                                adjustTab = false;
                            } else {
                                // ' >\t  test '
                                //    ^ -- position start of line here + shift bsCount slightly
                                //         to make extra space appear
                                adjustTab = true;
                            }
                        } else {
                            spaceAfterMarker = false;
                        }

                        offset = initial;
                        oldBMarks.push(state.bMarks[nextLine]);
                        state.bMarks[nextLine] = pos;

                        while (pos < max) {
                            ch = state.src.charCodeAt(pos);

                            if (isSpace(ch)) {
                                if (ch === 0x09) {
                                    offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
                                } else {
                                    offset++;
                                }
                            } else {
                                break;
                            }

                            pos++;
                        }

                        lastLineEmpty = pos >= max;

                        oldBSCount.push(state.bsCount[nextLine]);
                        state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);

                        oldSCount.push(state.sCount[nextLine]);
                        state.sCount[nextLine] = offset - initial;

                        oldTShift.push(state.tShift[nextLine]);
                        state.tShift[nextLine] = pos - state.bMarks[nextLine];
                        continue;
                    }

                    // Case 2: line is not inside the blockquote, and the last line was empty.
                    if (lastLineEmpty) {
                        break;
                    }

                    // Case 3: another tag found.
                    terminate = false;
                    for (i = 0, l = terminatorRules.length; i < l; i++) {
                        if (terminatorRules[i](state, nextLine, endLine, true)) {
                            terminate = true;
                            break;
                        }
                    }

                    if (terminate) {
                        // Quirk to enforce "hard termination mode" for paragraphs;
                        // normally if you call `tokenize(state, startLine, nextLine)`,
                        // paragraphs will look below nextLine for paragraph continuation,
                        // but if blockquote is terminated by another tag, they shouldn't
                        state.lineMax = nextLine;

                        if (state.blkIndent !== 0) {
                            // state.blkIndent was non-zero, we now set it to zero,
                            // so we need to re-calculate all offsets to appear as
                            // if indent wasn't changed
                            oldBMarks.push(state.bMarks[nextLine]);
                            oldBSCount.push(state.bsCount[nextLine]);
                            oldTShift.push(state.tShift[nextLine]);
                            oldSCount.push(state.sCount[nextLine]);
                            state.sCount[nextLine] -= state.blkIndent;
                        }

                        break;
                    }

                    oldBMarks.push(state.bMarks[nextLine]);
                    oldBSCount.push(state.bsCount[nextLine]);
                    oldTShift.push(state.tShift[nextLine]);
                    oldSCount.push(state.sCount[nextLine]);

                    // A negative indentation means that this is a paragraph continuation
                    //
                    state.sCount[nextLine] = -1;
                }

                oldIndent = state.blkIndent;
                state.blkIndent = 0;

                token = state.push('blockquote_open', 'blockquote', 1);
                token.markup = '>';
                token.map = lines = [startLine, 0];

                state.md.block.tokenize(state, startLine, nextLine);

                token = state.push('blockquote_close', 'blockquote', -1);
                token.markup = '>';

                state.lineMax = oldLineMax;
                state.parentType = oldParentType;
                lines[1] = state.line;

                // Restore original tShift; this might not be necessary since the parser
                // has already been here, but just to make sure we can do that.
                for (i = 0; i < oldTShift.length; i++) {
                    state.bMarks[i + startLine] = oldBMarks[i];
                    state.tShift[i + startLine] = oldTShift[i];
                    state.sCount[i + startLine] = oldSCount[i];
                    state.bsCount[i + startLine] = oldBSCount[i];
                }
                state.blkIndent = oldIndent;

                return true;
            };


            /***/
        }),

        /***/ 7693:
        /***/ ((module) => {

            "use strict";
// Code block (4 spaces padded)


            module.exports = function code(state, startLine, endLine/*, silent*/) {
                var nextLine, last, token;

                if (state.sCount[startLine] - state.blkIndent < 4) {
                    return false;
                }

                last = nextLine = startLine + 1;

                while (nextLine < endLine) {
                    if (state.isEmpty(nextLine)) {
                        nextLine++;
                        continue;
                    }

                    if (state.sCount[nextLine] - state.blkIndent >= 4) {
                        nextLine++;
                        last = nextLine;
                        continue;
                    }
                    break;
                }

                state.line = last;

                token = state.push('code_block', 'code', 0);
                token.content = state.getLines(startLine, last, 4 + state.blkIndent, false) + '\n';
                token.map = [startLine, state.line];

                return true;
            };


            /***/
        }),

        /***/ 7749:
        /***/ ((module) => {

            "use strict";
// fences (``` lang, ~~~ lang)


            module.exports = function fence(state, startLine, endLine, silent) {
                var marker, len, params, nextLine, mem, token, markup,
                  haveEndMarker = false,
                  pos = state.bMarks[startLine] + state.tShift[startLine],
                  max = state.eMarks[startLine];

                // if it's indented more than 3 spaces, it should be a code block
                if (state.sCount[startLine] - state.blkIndent >= 4) {
                    return false;
                }

                if (pos + 3 > max) {
                    return false;
                }

                marker = state.src.charCodeAt(pos);

                if (marker !== 0x7E/* ~ */ && marker !== 0x60 /* ` */) {
                    return false;
                }

                // scan marker length
                mem = pos;
                pos = state.skipChars(pos, marker);

                len = pos - mem;

                if (len < 3) {
                    return false;
                }

                markup = state.src.slice(mem, pos);
                params = state.src.slice(pos, max);

                if (marker === 0x60 /* ` */) {
                    if (params.indexOf(String.fromCharCode(marker)) >= 0) {
                        return false;
                    }
                }

                // Since start is found, we can report success here in validation mode
                if (silent) {
                    return true;
                }

                // search end of block
                nextLine = startLine;

                for (; ;) {
                    nextLine++;
                    if (nextLine >= endLine) {
                        // unclosed block should be autoclosed by end of document.
                        // also block seems to be autoclosed by end of parent
                        break;
                    }

                    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
                    max = state.eMarks[nextLine];

                    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
                        // non-empty line with negative indent should stop the list:
                        // - ```
                        //  test
                        break;
                    }

                    if (state.src.charCodeAt(pos) !== marker) {
                        continue;
                    }

                    if (state.sCount[nextLine] - state.blkIndent >= 4) {
                        // closing fence should be indented less than 4 spaces
                        continue;
                    }

                    pos = state.skipChars(pos, marker);

                    // closing code fence must be at least as long as the opening one
                    if (pos - mem < len) {
                        continue;
                    }

                    // make sure tail has spaces only
                    pos = state.skipSpaces(pos);

                    if (pos < max) {
                        continue;
                    }

                    haveEndMarker = true;
                    // found!
                    break;
                }

                // If a fence has heading spaces, they should be removed from its inner block
                len = state.sCount[startLine];

                state.line = nextLine + (haveEndMarker ? 1 : 0);

                token = state.push('fence', 'code', 0);
                token.info = params;
                token.content = state.getLines(startLine + 1, nextLine, len, true);
                token.markup = markup;
                token.map = [startLine, state.line];

                return true;
            };


            /***/
        }),

        /***/ 2702:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// heading (#, ##, ...)


            var isSpace = (__nccwpck_require__(506).isSpace);


            module.exports = function heading(state, startLine, endLine, silent) {
                var ch, level, tmp, token,
                  pos = state.bMarks[startLine] + state.tShift[startLine],
                  max = state.eMarks[startLine];

                // if it's indented more than 3 spaces, it should be a code block
                if (state.sCount[startLine] - state.blkIndent >= 4) {
                    return false;
                }

                ch = state.src.charCodeAt(pos);

                if (ch !== 0x23/* # */ || pos >= max) {
                    return false;
                }

                // count heading level
                level = 1;
                ch = state.src.charCodeAt(++pos);
                while (ch === 0x23/* # */ && pos < max && level <= 6) {
                    level++;
                    ch = state.src.charCodeAt(++pos);
                }

                if (level > 6 || (pos < max && !isSpace(ch))) {
                    return false;
                }

                if (silent) {
                    return true;
                }

                // Let's cut tails like '    ###  ' from the end of string

                max = state.skipSpacesBack(max, pos);
                tmp = state.skipCharsBack(max, 0x23, pos); // #
                if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
                    max = tmp;
                }

                state.line = startLine + 1;

                token = state.push('heading_open', 'h' + String(level), 1);
                token.markup = '########'.slice(0, level);
                token.map = [startLine, state.line];

                token = state.push('inline', '', 0);
                token.content = state.src.slice(pos, max).trim();
                token.map = [startLine, state.line];
                token.children = [];

                token = state.push('heading_close', 'h' + String(level), -1);
                token.markup = '########'.slice(0, level);

                return true;
            };


            /***/
        }),

        /***/ 3514:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Horizontal rule


            var isSpace = (__nccwpck_require__(506).isSpace);


            module.exports = function hr(state, startLine, endLine, silent) {
                var marker, cnt, ch, token,
                  pos = state.bMarks[startLine] + state.tShift[startLine],
                  max = state.eMarks[startLine];

                // if it's indented more than 3 spaces, it should be a code block
                if (state.sCount[startLine] - state.blkIndent >= 4) {
                    return false;
                }

                marker = state.src.charCodeAt(pos++);

                // Check hr marker
                if (marker !== 0x2A/* * */ &&
                  marker !== 0x2D/* - */ &&
                  marker !== 0x5F/* _ */) {
                    return false;
                }

                // markers can be mixed with spaces, but there should be at least 3 of them

                cnt = 1;
                while (pos < max) {
                    ch = state.src.charCodeAt(pos++);
                    if (ch !== marker && !isSpace(ch)) {
                        return false;
                    }
                    if (ch === marker) {
                        cnt++;
                    }
                }

                if (cnt < 3) {
                    return false;
                }

                if (silent) {
                    return true;
                }

                state.line = startLine + 1;

                token = state.push('hr', 'hr', 0);
                token.map = [startLine, state.line];
                token.markup = Array(cnt + 1).join(String.fromCharCode(marker));

                return true;
            };


            /***/
        }),

        /***/ 5732:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// HTML block


            var block_names = __nccwpck_require__(9035);
            var HTML_OPEN_CLOSE_TAG_RE = (__nccwpck_require__(6537)/* .HTML_OPEN_CLOSE_TAG_RE */.q);

// An array of opening and corresponding closing sequences for html tags,
// last argument defines whether it can terminate a paragraph or not
//
            var HTML_SEQUENCES = [
                [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, true],
                [/^<!--/, /-->/, true],
                [/^<\?/, /\?>/, true],
                [/^<![A-Z]/, />/, true],
                [/^<!\[CDATA\[/, /\]\]>/, true],
                [new RegExp('^</?(' + block_names.join('|') + ')(?=(\\s|/?>|$))', 'i'), /^$/, true],
                [new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + '\\s*$'), /^$/, false]
            ];


            module.exports = function html_block(state, startLine, endLine, silent) {
                var i, nextLine, token, lineText,
                  pos = state.bMarks[startLine] + state.tShift[startLine],
                  max = state.eMarks[startLine];

                // if it's indented more than 3 spaces, it should be a code block
                if (state.sCount[startLine] - state.blkIndent >= 4) {
                    return false;
                }

                if (!state.md.options.html) {
                    return false;
                }

                if (state.src.charCodeAt(pos) !== 0x3C/* < */) {
                    return false;
                }

                lineText = state.src.slice(pos, max);

                for (i = 0; i < HTML_SEQUENCES.length; i++) {
                    if (HTML_SEQUENCES[i][0].test(lineText)) {
                        break;
                    }
                }

                if (i === HTML_SEQUENCES.length) {
                    return false;
                }

                if (silent) {
                    // true if this sequence can be a terminator, false otherwise
                    return HTML_SEQUENCES[i][2];
                }

                nextLine = startLine + 1;

                // If we are here - we detected HTML block.
                // Let's roll down till block end.
                if (!HTML_SEQUENCES[i][1].test(lineText)) {
                    for (; nextLine < endLine; nextLine++) {
                        if (state.sCount[nextLine] < state.blkIndent) {
                            break;
                        }

                        pos = state.bMarks[nextLine] + state.tShift[nextLine];
                        max = state.eMarks[nextLine];
                        lineText = state.src.slice(pos, max);

                        if (HTML_SEQUENCES[i][1].test(lineText)) {
                            if (lineText.length !== 0) {
                                nextLine++;
                            }
                            break;
                        }
                    }
                }

                state.line = nextLine;

                token = state.push('html_block', '', 0);
                token.map = [startLine, nextLine];
                token.content = state.getLines(startLine, nextLine, state.blkIndent, true);

                return true;
            };


            /***/
        }),

        /***/ 3551:
        /***/ ((module) => {

            "use strict";
// lheading (---, ===)


            module.exports = function lheading(state, startLine, endLine/*, silent*/) {
                var content, terminate, i, l, token, pos, max, level, marker,
                  nextLine = startLine + 1, oldParentType,
                  terminatorRules = state.md.block.ruler.getRules('paragraph');

                // if it's indented more than 3 spaces, it should be a code block
                if (state.sCount[startLine] - state.blkIndent >= 4) {
                    return false;
                }

                oldParentType = state.parentType;
                state.parentType = 'paragraph'; // use paragraph to match terminatorRules

                // jump line-by-line until empty one or EOF
                for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
                    // this would be a code block normally, but after paragraph
                    // it's considered a lazy continuation regardless of what's there
                    if (state.sCount[nextLine] - state.blkIndent > 3) {
                        continue;
                    }

                    //
                    // Check for underline in setext header
                    //
                    if (state.sCount[nextLine] >= state.blkIndent) {
                        pos = state.bMarks[nextLine] + state.tShift[nextLine];
                        max = state.eMarks[nextLine];

                        if (pos < max) {
                            marker = state.src.charCodeAt(pos);

                            if (marker === 0x2D/* - */ || marker === 0x3D/* = */) {
                                pos = state.skipChars(pos, marker);
                                pos = state.skipSpaces(pos);

                                if (pos >= max) {
                                    level = (marker === 0x3D/* = */ ? 1 : 2);
                                    break;
                                }
                            }
                        }
                    }

                    // quirk for blockquotes, this line should already be checked by that rule
                    if (state.sCount[nextLine] < 0) {
                        continue;
                    }

                    // Some tags can terminate paragraph without empty line.
                    terminate = false;
                    for (i = 0, l = terminatorRules.length; i < l; i++) {
                        if (terminatorRules[i](state, nextLine, endLine, true)) {
                            terminate = true;
                            break;
                        }
                    }
                    if (terminate) {
                        break;
                    }
                }

                if (!level) {
                    // Didn't find valid underline
                    return false;
                }

                content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

                state.line = nextLine + 1;

                token = state.push('heading_open', 'h' + String(level), 1);
                token.markup = String.fromCharCode(marker);
                token.map = [startLine, state.line];

                token = state.push('inline', '', 0);
                token.content = content;
                token.map = [startLine, state.line - 1];
                token.children = [];

                token = state.push('heading_close', 'h' + String(level), -1);
                token.markup = String.fromCharCode(marker);

                state.parentType = oldParentType;

                return true;
            };


            /***/
        }),

        /***/ 2050:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Lists


            var isSpace = (__nccwpck_require__(506).isSpace);


// Search `[-+*][\n ]`, returns next pos after marker on success
// or -1 on fail.
            function skipBulletListMarker(state, startLine) {
                var marker, pos, max, ch;

                pos = state.bMarks[startLine] + state.tShift[startLine];
                max = state.eMarks[startLine];

                marker = state.src.charCodeAt(pos++);
                // Check bullet
                if (marker !== 0x2A/* * */ &&
                  marker !== 0x2D/* - */ &&
                  marker !== 0x2B/* + */) {
                    return -1;
                }

                if (pos < max) {
                    ch = state.src.charCodeAt(pos);

                    if (!isSpace(ch)) {
                        // " -test " - is not a list item
                        return -1;
                    }
                }

                return pos;
            }

// Search `\d+[.)][\n ]`, returns next pos after marker on success
// or -1 on fail.
            function skipOrderedListMarker(state, startLine) {
                var ch,
                  start = state.bMarks[startLine] + state.tShift[startLine],
                  pos = start,
                  max = state.eMarks[startLine];

                // List marker should have at least 2 chars (digit + dot)
                if (pos + 1 >= max) {
                    return -1;
                }

                ch = state.src.charCodeAt(pos++);

                if (ch < 0x30/* 0 */ || ch > 0x39/* 9 */) {
                    return -1;
                }

                for (; ;) {
                    // EOL -> fail
                    if (pos >= max) {
                        return -1;
                    }

                    ch = state.src.charCodeAt(pos++);

                    if (ch >= 0x30/* 0 */ && ch <= 0x39/* 9 */) {

                        // List marker should have no more than 9 digits
                        // (prevents integer overflow in browsers)
                        if (pos - start >= 10) {
                            return -1;
                        }

                        continue;
                    }

                    // found valid marker
                    if (ch === 0x29/* ) */ || ch === 0x2e/* . */) {
                        break;
                    }

                    return -1;
                }


                if (pos < max) {
                    ch = state.src.charCodeAt(pos);

                    if (!isSpace(ch)) {
                        // " 1.test " - is not a list item
                        return -1;
                    }
                }
                return pos;
            }

            function markTightParagraphs(state, idx) {
                var i, l,
                  level = state.level + 2;

                for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
                    if (state.tokens[i].level === level && state.tokens[i].type === 'paragraph_open') {
                        state.tokens[i + 2].hidden = true;
                        state.tokens[i].hidden = true;
                        i += 2;
                    }
                }
            }


            module.exports = function list(state, startLine, endLine, silent) {
                var ch,
                  contentStart,
                  i,
                  indent,
                  indentAfterMarker,
                  initial,
                  isOrdered,
                  itemLines,
                  l,
                  listLines,
                  listTokIdx,
                  markerCharCode,
                  markerValue,
                  max,
                  offset,
                  oldListIndent,
                  oldParentType,
                  oldSCount,
                  oldTShift,
                  oldTight,
                  pos,
                  posAfterMarker,
                  prevEmptyEnd,
                  start,
                  terminate,
                  terminatorRules,
                  token,
                  nextLine = startLine,
                  isTerminatingParagraph = false,
                  tight = true;

                // if it's indented more than 3 spaces, it should be a code block
                if (state.sCount[nextLine] - state.blkIndent >= 4) {
                    return false;
                }

                // Special case:
                //  - item 1
                //   - item 2
                //    - item 3
                //     - item 4
                //      - this one is a paragraph continuation
                if (state.listIndent >= 0 &&
                  state.sCount[nextLine] - state.listIndent >= 4 &&
                  state.sCount[nextLine] < state.blkIndent) {
                    return false;
                }

                // limit conditions when list can interrupt
                // a paragraph (validation mode only)
                if (silent && state.parentType === 'paragraph') {
                    // Next list item should still terminate previous list item;
                    //
                    // This code can fail if plugins use blkIndent as well as lists,
                    // but I hope the spec gets fixed long before that happens.
                    //
                    if (state.sCount[nextLine] >= state.blkIndent) {
                        isTerminatingParagraph = true;
                    }
                }

                // Detect list type and position after marker
                if ((posAfterMarker = skipOrderedListMarker(state, nextLine)) >= 0) {
                    isOrdered = true;
                    start = state.bMarks[nextLine] + state.tShift[nextLine];
                    markerValue = Number(state.src.slice(start, posAfterMarker - 1));

                    // If we're starting a new ordered list right after
                    // a paragraph, it should start with 1.
                    if (isTerminatingParagraph && markerValue !== 1) return false;

                } else if ((posAfterMarker = skipBulletListMarker(state, nextLine)) >= 0) {
                    isOrdered = false;

                } else {
                    return false;
                }

                // If we're starting a new unordered list right after
                // a paragraph, first line should not be empty.
                if (isTerminatingParagraph) {
                    if (state.skipSpaces(posAfterMarker) >= state.eMarks[nextLine]) return false;
                }

                // For validation mode we can terminate immediately
                if (silent) {
                    return true;
                }

                // We should terminate list on style change. Remember first one to compare.
                markerCharCode = state.src.charCodeAt(posAfterMarker - 1);

                // Start list
                listTokIdx = state.tokens.length;

                if (isOrdered) {
                    token = state.push('ordered_list_open', 'ol', 1);
                    if (markerValue !== 1) {
                        token.attrs = [['start', markerValue]];
                    }

                } else {
                    token = state.push('bullet_list_open', 'ul', 1);
                }

                token.map = listLines = [nextLine, 0];
                token.markup = String.fromCharCode(markerCharCode);

                //
                // Iterate list items
                //

                prevEmptyEnd = false;
                terminatorRules = state.md.block.ruler.getRules('list');

                oldParentType = state.parentType;
                state.parentType = 'list';

                while (nextLine < endLine) {
                    pos = posAfterMarker;
                    max = state.eMarks[nextLine];

                    initial = offset = state.sCount[nextLine] + posAfterMarker - (state.bMarks[nextLine] + state.tShift[nextLine]);

                    while (pos < max) {
                        ch = state.src.charCodeAt(pos);

                        if (ch === 0x09) {
                            offset += 4 - (offset + state.bsCount[nextLine]) % 4;
                        } else if (ch === 0x20) {
                            offset++;
                        } else {
                            break;
                        }

                        pos++;
                    }

                    contentStart = pos;

                    if (contentStart >= max) {
                        // trimming space in "-    \n  3" case, indent is 1 here
                        indentAfterMarker = 1;
                    } else {
                        indentAfterMarker = offset - initial;
                    }

                    // If we have more than 4 spaces, the indent is 1
                    // (the rest is just indented code block)
                    if (indentAfterMarker > 4) {
                        indentAfterMarker = 1;
                    }

                    // "  -  test"
                    //  ^^^^^ - calculating total length of this thing
                    indent = initial + indentAfterMarker;

                    // Run subparser & write tokens
                    token = state.push('list_item_open', 'li', 1);
                    token.markup = String.fromCharCode(markerCharCode);
                    token.map = itemLines = [nextLine, 0];
                    if (isOrdered) {
                        token.info = state.src.slice(start, posAfterMarker - 1);
                    }

                    // change current state, then restore it after parser subcall
                    oldTight = state.tight;
                    oldTShift = state.tShift[nextLine];
                    oldSCount = state.sCount[nextLine];

                    //  - example list
                    // ^ listIndent position will be here
                    //   ^ blkIndent position will be here
                    //
                    oldListIndent = state.listIndent;
                    state.listIndent = state.blkIndent;
                    state.blkIndent = indent;

                    state.tight = true;
                    state.tShift[nextLine] = contentStart - state.bMarks[nextLine];
                    state.sCount[nextLine] = offset;

                    if (contentStart >= max && state.isEmpty(nextLine + 1)) {
                        // workaround for this case
                        // (list item is empty, list terminates before "foo"):
                        // ~~~~~~~~
                        //   -
                        //
                        //     foo
                        // ~~~~~~~~
                        state.line = Math.min(state.line + 2, endLine);
                    } else {
                        state.md.block.tokenize(state, nextLine, endLine, true);
                    }

                    // If any of list item is tight, mark list as tight
                    if (!state.tight || prevEmptyEnd) {
                        tight = false;
                    }
                    // Item become loose if finish with empty line,
                    // but we should filter last element, because it means list finish
                    prevEmptyEnd = (state.line - nextLine) > 1 && state.isEmpty(state.line - 1);

                    state.blkIndent = state.listIndent;
                    state.listIndent = oldListIndent;
                    state.tShift[nextLine] = oldTShift;
                    state.sCount[nextLine] = oldSCount;
                    state.tight = oldTight;

                    token = state.push('list_item_close', 'li', -1);
                    token.markup = String.fromCharCode(markerCharCode);

                    nextLine = state.line;
                    itemLines[1] = nextLine;

                    if (nextLine >= endLine) {
                        break;
                    }

                    //
                    // Try to check if list is terminated or continued.
                    //
                    if (state.sCount[nextLine] < state.blkIndent) {
                        break;
                    }

                    // if it's indented more than 3 spaces, it should be a code block
                    if (state.sCount[nextLine] - state.blkIndent >= 4) {
                        break;
                    }

                    // fail if terminating block found
                    terminate = false;
                    for (i = 0, l = terminatorRules.length; i < l; i++) {
                        if (terminatorRules[i](state, nextLine, endLine, true)) {
                            terminate = true;
                            break;
                        }
                    }
                    if (terminate) {
                        break;
                    }

                    // fail if list has another type
                    if (isOrdered) {
                        posAfterMarker = skipOrderedListMarker(state, nextLine);
                        if (posAfterMarker < 0) {
                            break;
                        }
                        start = state.bMarks[nextLine] + state.tShift[nextLine];
                    } else {
                        posAfterMarker = skipBulletListMarker(state, nextLine);
                        if (posAfterMarker < 0) {
                            break;
                        }
                    }

                    if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) {
                        break;
                    }
                }

                // Finalize list
                if (isOrdered) {
                    token = state.push('ordered_list_close', 'ol', -1);
                } else {
                    token = state.push('bullet_list_close', 'ul', -1);
                }
                token.markup = String.fromCharCode(markerCharCode);

                listLines[1] = nextLine;
                state.line = nextLine;

                state.parentType = oldParentType;

                // mark paragraphs tight if needed
                if (tight) {
                    markTightParagraphs(state, listTokIdx);
                }

                return true;
            };


            /***/
        }),

        /***/ 9450:
        /***/ ((module) => {

            "use strict";
// Paragraph


            module.exports = function paragraph(state, startLine, endLine) {
                var content, terminate, i, l, token, oldParentType,
                  nextLine = startLine + 1,
                  terminatorRules = state.md.block.ruler.getRules('paragraph');

                oldParentType = state.parentType;
                state.parentType = 'paragraph';

                // jump line-by-line until empty one or EOF
                for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
                    // this would be a code block normally, but after paragraph
                    // it's considered a lazy continuation regardless of what's there
                    if (state.sCount[nextLine] - state.blkIndent > 3) {
                        continue;
                    }

                    // quirk for blockquotes, this line should already be checked by that rule
                    if (state.sCount[nextLine] < 0) {
                        continue;
                    }

                    // Some tags can terminate paragraph without empty line.
                    terminate = false;
                    for (i = 0, l = terminatorRules.length; i < l; i++) {
                        if (terminatorRules[i](state, nextLine, endLine, true)) {
                            terminate = true;
                            break;
                        }
                    }
                    if (terminate) {
                        break;
                    }
                }

                content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

                state.line = nextLine;

                token = state.push('paragraph_open', 'p', 1);
                token.map = [startLine, state.line];

                token = state.push('inline', '', 0);
                token.content = content;
                token.map = [startLine, state.line];
                token.children = [];

                token = state.push('paragraph_close', 'p', -1);

                state.parentType = oldParentType;

                return true;
            };


            /***/
        }),

        /***/ 2235:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";


            var normalizeReference = (__nccwpck_require__(506).normalizeReference);
            var isSpace = (__nccwpck_require__(506).isSpace);


            module.exports = function reference(state, startLine, _endLine, silent) {
                var ch,
                  destEndPos,
                  destEndLineNo,
                  endLine,
                  href,
                  i,
                  l,
                  label,
                  labelEnd,
                  oldParentType,
                  res,
                  start,
                  str,
                  terminate,
                  terminatorRules,
                  title,
                  lines = 0,
                  pos = state.bMarks[startLine] + state.tShift[startLine],
                  max = state.eMarks[startLine],
                  nextLine = startLine + 1;

                // if it's indented more than 3 spaces, it should be a code block
                if (state.sCount[startLine] - state.blkIndent >= 4) {
                    return false;
                }

                if (state.src.charCodeAt(pos) !== 0x5B/* [ */) {
                    return false;
                }

                // Simple check to quickly interrupt scan on [link](url) at the start of line.
                // Can be useful on practice: https://github.com/markdown-it/markdown-it/issues/54
                while (++pos < max) {
                    if (state.src.charCodeAt(pos) === 0x5D /* ] */ &&
                      state.src.charCodeAt(pos - 1) !== 0x5C/* \ */) {
                        if (pos + 1 === max) {
                            return false;
                        }
                        if (state.src.charCodeAt(pos + 1) !== 0x3A/* : */) {
                            return false;
                        }
                        break;
                    }
                }

                endLine = state.lineMax;

                // jump line-by-line until empty one or EOF
                terminatorRules = state.md.block.ruler.getRules('reference');

                oldParentType = state.parentType;
                state.parentType = 'reference';

                for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
                    // this would be a code block normally, but after paragraph
                    // it's considered a lazy continuation regardless of what's there
                    if (state.sCount[nextLine] - state.blkIndent > 3) {
                        continue;
                    }

                    // quirk for blockquotes, this line should already be checked by that rule
                    if (state.sCount[nextLine] < 0) {
                        continue;
                    }

                    // Some tags can terminate paragraph without empty line.
                    terminate = false;
                    for (i = 0, l = terminatorRules.length; i < l; i++) {
                        if (terminatorRules[i](state, nextLine, endLine, true)) {
                            terminate = true;
                            break;
                        }
                    }
                    if (terminate) {
                        break;
                    }
                }

                str = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
                max = str.length;

                for (pos = 1; pos < max; pos++) {
                    ch = str.charCodeAt(pos);
                    if (ch === 0x5B /* [ */) {
                        return false;
                    } else if (ch === 0x5D /* ] */) {
                        labelEnd = pos;
                        break;
                    } else if (ch === 0x0A /* \n */) {
                        lines++;
                    } else if (ch === 0x5C /* \ */) {
                        pos++;
                        if (pos < max && str.charCodeAt(pos) === 0x0A) {
                            lines++;
                        }
                    }
                }

                if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A/* : */) {
                    return false;
                }

                // [label]:   destination   'title'
                //         ^^^ skip optional whitespace here
                for (pos = labelEnd + 2; pos < max; pos++) {
                    ch = str.charCodeAt(pos);
                    if (ch === 0x0A) {
                        lines++;
                    } else if (isSpace(ch)) {
                        /*eslint no-empty:0*/
                    } else {
                        break;
                    }
                }

                // [label]:   destination   'title'
                //            ^^^^^^^^^^^ parse this
                res = state.md.helpers.parseLinkDestination(str, pos, max);
                if (!res.ok) {
                    return false;
                }

                href = state.md.normalizeLink(res.str);
                if (!state.md.validateLink(href)) {
                    return false;
                }

                pos = res.pos;
                lines += res.lines;

                // save cursor state, we could require to rollback later
                destEndPos = pos;
                destEndLineNo = lines;

                // [label]:   destination   'title'
                //                       ^^^ skipping those spaces
                start = pos;
                for (; pos < max; pos++) {
                    ch = str.charCodeAt(pos);
                    if (ch === 0x0A) {
                        lines++;
                    } else if (isSpace(ch)) {
                        /*eslint no-empty:0*/
                    } else {
                        break;
                    }
                }

                // [label]:   destination   'title'
                //                          ^^^^^^^ parse this
                res = state.md.helpers.parseLinkTitle(str, pos, max);
                if (pos < max && start !== pos && res.ok) {
                    title = res.str;
                    pos = res.pos;
                    lines += res.lines;
                } else {
                    title = '';
                    pos = destEndPos;
                    lines = destEndLineNo;
                }

                // skip trailing spaces until the rest of the line
                while (pos < max) {
                    ch = str.charCodeAt(pos);
                    if (!isSpace(ch)) {
                        break;
                    }
                    pos++;
                }

                if (pos < max && str.charCodeAt(pos) !== 0x0A) {
                    if (title) {
                        // garbage at the end of the line after title,
                        // but it could still be a valid reference if we roll back
                        title = '';
                        pos = destEndPos;
                        lines = destEndLineNo;
                        while (pos < max) {
                            ch = str.charCodeAt(pos);
                            if (!isSpace(ch)) {
                                break;
                            }
                            pos++;
                        }
                    }
                }

                if (pos < max && str.charCodeAt(pos) !== 0x0A) {
                    // garbage at the end of the line
                    return false;
                }

                label = normalizeReference(str.slice(1, labelEnd));
                if (!label) {
                    // CommonMark 0.20 disallows empty labels
                    return false;
                }

                // Reference can not terminate anything. This check is for safety only.
                /*istanbul ignore if*/
                if (silent) {
                    return true;
                }

                if (typeof state.env.references === 'undefined') {
                    state.env.references = {};
                }
                if (typeof state.env.references[label] === 'undefined') {
                    state.env.references[label] = { title: title, href: href };
                }

                state.parentType = oldParentType;

                state.line = startLine + lines + 1;
                return true;
            };


            /***/
        }),

        /***/ 9497:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Parser state class


            var Token = __nccwpck_require__(8622);
            var isSpace = (__nccwpck_require__(506).isSpace);


            function StateBlock(src, md, env, tokens) {
                var ch, s, start, pos, len, indent, offset, indent_found;

                this.src = src;

                // link to parser instance
                this.md = md;

                this.env = env;

                //
                // Internal state vartiables
                //

                this.tokens = tokens;

                this.bMarks = [];  // line begin offsets for fast jumps
                this.eMarks = [];  // line end offsets for fast jumps
                this.tShift = [];  // offsets of the first non-space characters (tabs not expanded)
                this.sCount = [];  // indents for each line (tabs expanded)

                // An amount of virtual spaces (tabs expanded) between beginning
                // of each line (bMarks) and real beginning of that line.
                //
                // It exists only as a hack because blockquotes override bMarks
                // losing information in the process.
                //
                // It's used only when expanding tabs, you can think about it as
                // an initial tab length, e.g. bsCount=21 applied to string `\t123`
                // means first tab should be expanded to 4-21%4 === 3 spaces.
                //
                this.bsCount = [];

                // block parser variables
                this.blkIndent = 0; // required block content indent (for example, if we are
                                    // inside a list, it would be positioned after list marker)
                this.line = 0; // line index in src
                this.lineMax = 0; // lines count
                this.tight = false;  // loose/tight mode for lists
                this.ddIndent = -1; // indent of the current dd block (-1 if there isn't any)
                this.listIndent = -1; // indent of the current list block (-1 if there isn't any)

                // can be 'blockquote', 'list', 'root', 'paragraph' or 'reference'
                // used in lists to determine if they interrupt a paragraph
                this.parentType = 'root';

                this.level = 0;

                // renderer
                this.result = '';

                // Create caches
                // Generate markers.
                s = this.src;
                indent_found = false;

                for (start = pos = indent = offset = 0, len = s.length; pos < len; pos++) {
                    ch = s.charCodeAt(pos);

                    if (!indent_found) {
                        if (isSpace(ch)) {
                            indent++;

                            if (ch === 0x09) {
                                offset += 4 - offset % 4;
                            } else {
                                offset++;
                            }
                            continue;
                        } else {
                            indent_found = true;
                        }
                    }

                    if (ch === 0x0A || pos === len - 1) {
                        if (ch !== 0x0A) {
                            pos++;
                        }
                        this.bMarks.push(start);
                        this.eMarks.push(pos);
                        this.tShift.push(indent);
                        this.sCount.push(offset);
                        this.bsCount.push(0);

                        indent_found = false;
                        indent = 0;
                        offset = 0;
                        start = pos + 1;
                    }
                }

                // Push fake entry to simplify cache bounds checks
                this.bMarks.push(s.length);
                this.eMarks.push(s.length);
                this.tShift.push(0);
                this.sCount.push(0);
                this.bsCount.push(0);

                this.lineMax = this.bMarks.length - 1; // don't count last fake line
            }

// Push new token to "stream".
//
            StateBlock.prototype.push = function(type, tag, nesting) {
                var token = new Token(type, tag, nesting);
                token.block = true;

                if (nesting < 0) this.level--; // closing tag
                token.level = this.level;
                if (nesting > 0) this.level++; // opening tag

                this.tokens.push(token);
                return token;
            };

            StateBlock.prototype.isEmpty = function isEmpty(line) {
                return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
            };

            StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
                for (var max = this.lineMax; from < max; from++) {
                    if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
                        break;
                    }
                }
                return from;
            };

// Skip spaces from given position.
            StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
                var ch;

                for (var max = this.src.length; pos < max; pos++) {
                    ch = this.src.charCodeAt(pos);
                    if (!isSpace(ch)) {
                        break;
                    }
                }
                return pos;
            };

// Skip spaces from given position in reverse.
            StateBlock.prototype.skipSpacesBack = function skipSpacesBack(pos, min) {
                if (pos <= min) {
                    return pos;
                }

                while (pos > min) {
                    if (!isSpace(this.src.charCodeAt(--pos))) {
                        return pos + 1;
                    }
                }
                return pos;
            };

// Skip char codes from given position
            StateBlock.prototype.skipChars = function skipChars(pos, code) {
                for (var max = this.src.length; pos < max; pos++) {
                    if (this.src.charCodeAt(pos) !== code) {
                        break;
                    }
                }
                return pos;
            };

// Skip char codes reverse from given position - 1
            StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
                if (pos <= min) {
                    return pos;
                }

                while (pos > min) {
                    if (code !== this.src.charCodeAt(--pos)) {
                        return pos + 1;
                    }
                }
                return pos;
            };

// cut lines range from source.
            StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
                var i, lineIndent, ch, first, last, queue, lineStart,
                  line = begin;

                if (begin >= end) {
                    return '';
                }

                queue = new Array(end - begin);

                for (i = 0; line < end; line++, i++) {
                    lineIndent = 0;
                    lineStart = first = this.bMarks[line];

                    if (line + 1 < end || keepLastLF) {
                        // No need for bounds check because we have fake entry on tail.
                        last = this.eMarks[line] + 1;
                    } else {
                        last = this.eMarks[line];
                    }

                    while (first < last && lineIndent < indent) {
                        ch = this.src.charCodeAt(first);

                        if (isSpace(ch)) {
                            if (ch === 0x09) {
                                lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
                            } else {
                                lineIndent++;
                            }
                        } else if (first - lineStart < this.tShift[line]) {
                            // patched tShift masked characters to look like spaces (blockquotes, list markers)
                            lineIndent++;
                        } else {
                            break;
                        }

                        first++;
                    }

                    if (lineIndent > indent) {
                        // partially expanding tabs in code blocks, e.g '\t\tfoobar'
                        // with indent=2 becomes '  \tfoobar'
                        queue[i] = new Array(lineIndent - indent + 1).join(' ') + this.src.slice(first, last);
                    } else {
                        queue[i] = this.src.slice(first, last);
                    }
                }

                return queue.join('');
            };

// re-export Token class to use in block rules
            StateBlock.prototype.Token = Token;


            module.exports = StateBlock;


            /***/
        }),

        /***/ 7722:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// GFM table, https://github.github.com/gfm/#tables-extension-


            var isSpace = (__nccwpck_require__(506).isSpace);


            function getLine(state, line) {
                var pos = state.bMarks[line] + state.tShift[line],
                  max = state.eMarks[line];

                return state.src.slice(pos, max);
            }

            function escapedSplit(str) {
                var result = [],
                  pos = 0,
                  max = str.length,
                  ch,
                  isEscaped = false,
                  lastPos = 0,
                  current = '';

                ch = str.charCodeAt(pos);

                while (pos < max) {
                    if (ch === 0x7c/* | */) {
                        if (!isEscaped) {
                            // pipe separating cells, '|'
                            result.push(current + str.substring(lastPos, pos));
                            current = '';
                            lastPos = pos + 1;
                        } else {
                            // escaped pipe, '\|'
                            current += str.substring(lastPos, pos - 1);
                            lastPos = pos;
                        }
                    }

                    isEscaped = (ch === 0x5c/* \ */);
                    pos++;

                    ch = str.charCodeAt(pos);
                }

                result.push(current + str.substring(lastPos));

                return result;
            }


            module.exports = function table(state, startLine, endLine, silent) {
                var ch, lineText, pos, i, l, nextLine, columns, columnCount, token,
                  aligns, t, tableLines, tbodyLines, oldParentType, terminate,
                  terminatorRules, firstCh, secondCh;

                // should have at least two lines
                if (startLine + 2 > endLine) {
                    return false;
                }

                nextLine = startLine + 1;

                if (state.sCount[nextLine] < state.blkIndent) {
                    return false;
                }

                // if it's indented more than 3 spaces, it should be a code block
                if (state.sCount[nextLine] - state.blkIndent >= 4) {
                    return false;
                }

                // first character of the second line should be '|', '-', ':',
                // and no other characters are allowed but spaces;
                // basically, this is the equivalent of /^[-:|][-:|\s]*$/ regexp

                pos = state.bMarks[nextLine] + state.tShift[nextLine];
                if (pos >= state.eMarks[nextLine]) {
                    return false;
                }

                firstCh = state.src.charCodeAt(pos++);
                if (firstCh !== 0x7C/* | */ && firstCh !== 0x2D/* - */ && firstCh !== 0x3A/* : */) {
                    return false;
                }

                if (pos >= state.eMarks[nextLine]) {
                    return false;
                }

                secondCh = state.src.charCodeAt(pos++);
                if (secondCh !== 0x7C/* | */ && secondCh !== 0x2D/* - */ && secondCh !== 0x3A/* : */ && !isSpace(secondCh)) {
                    return false;
                }

                // if first character is '-', then second character must not be a space
                // (due to parsing ambiguity with list)
                if (firstCh === 0x2D/* - */ && isSpace(secondCh)) {
                    return false;
                }

                while (pos < state.eMarks[nextLine]) {
                    ch = state.src.charCodeAt(pos);

                    if (ch !== 0x7C/* | */ && ch !== 0x2D/* - */ && ch !== 0x3A/* : */ && !isSpace(ch)) {
                        return false;
                    }

                    pos++;
                }

                lineText = getLine(state, startLine + 1);

                columns = lineText.split('|');
                aligns = [];
                for (i = 0; i < columns.length; i++) {
                    t = columns[i].trim();
                    if (!t) {
                        // allow empty columns before and after table, but not in between columns;
                        // e.g. allow ` |---| `, disallow ` ---||--- `
                        if (i === 0 || i === columns.length - 1) {
                            continue;
                        } else {
                            return false;
                        }
                    }

                    if (!/^:?-+:?$/.test(t)) {
                        return false;
                    }
                    if (t.charCodeAt(t.length - 1) === 0x3A/* : */) {
                        aligns.push(t.charCodeAt(0) === 0x3A/* : */ ? 'center' : 'right');
                    } else if (t.charCodeAt(0) === 0x3A/* : */) {
                        aligns.push('left');
                    } else {
                        aligns.push('');
                    }
                }

                lineText = getLine(state, startLine).trim();
                if (lineText.indexOf('|') === -1) {
                    return false;
                }
                if (state.sCount[startLine] - state.blkIndent >= 4) {
                    return false;
                }
                columns = escapedSplit(lineText);
                if (columns.length && columns[0] === '') columns.shift();
                if (columns.length && columns[columns.length - 1] === '') columns.pop();

                // header row will define an amount of columns in the entire table,
                // and align row should be exactly the same (the rest of the rows can differ)
                columnCount = columns.length;
                if (columnCount === 0 || columnCount !== aligns.length) {
                    return false;
                }

                if (silent) {
                    return true;
                }

                oldParentType = state.parentType;
                state.parentType = 'table';

                // use 'blockquote' lists for termination because it's
                // the most similar to tables
                terminatorRules = state.md.block.ruler.getRules('blockquote');

                token = state.push('table_open', 'table', 1);
                token.map = tableLines = [startLine, 0];

                token = state.push('thead_open', 'thead', 1);
                token.map = [startLine, startLine + 1];

                token = state.push('tr_open', 'tr', 1);
                token.map = [startLine, startLine + 1];

                for (i = 0; i < columns.length; i++) {
                    token = state.push('th_open', 'th', 1);
                    if (aligns[i]) {
                        token.attrs = [['style', 'text-align:' + aligns[i]]];
                    }

                    token = state.push('inline', '', 0);
                    token.content = columns[i].trim();
                    token.children = [];

                    token = state.push('th_close', 'th', -1);
                }

                token = state.push('tr_close', 'tr', -1);
                token = state.push('thead_close', 'thead', -1);

                for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
                    if (state.sCount[nextLine] < state.blkIndent) {
                        break;
                    }

                    terminate = false;
                    for (i = 0, l = terminatorRules.length; i < l; i++) {
                        if (terminatorRules[i](state, nextLine, endLine, true)) {
                            terminate = true;
                            break;
                        }
                    }

                    if (terminate) {
                        break;
                    }
                    lineText = getLine(state, nextLine).trim();
                    if (!lineText) {
                        break;
                    }
                    if (state.sCount[nextLine] - state.blkIndent >= 4) {
                        break;
                    }
                    columns = escapedSplit(lineText);
                    if (columns.length && columns[0] === '') columns.shift();
                    if (columns.length && columns[columns.length - 1] === '') columns.pop();

                    if (nextLine === startLine + 2) {
                        token = state.push('tbody_open', 'tbody', 1);
                        token.map = tbodyLines = [startLine + 2, 0];
                    }

                    token = state.push('tr_open', 'tr', 1);
                    token.map = [nextLine, nextLine + 1];

                    for (i = 0; i < columnCount; i++) {
                        token = state.push('td_open', 'td', 1);
                        if (aligns[i]) {
                            token.attrs = [['style', 'text-align:' + aligns[i]]];
                        }

                        token = state.push('inline', '', 0);
                        token.content = columns[i] ? columns[i].trim() : '';
                        token.children = [];

                        token = state.push('td_close', 'td', -1);
                    }
                    token = state.push('tr_close', 'tr', -1);
                }

                if (tbodyLines) {
                    token = state.push('tbody_close', 'tbody', -1);
                    tbodyLines[1] = nextLine;
                }

                token = state.push('table_close', 'table', -1);
                tableLines[1] = nextLine;

                state.parentType = oldParentType;
                state.line = nextLine;
                return true;
            };


            /***/
        }),

        /***/ 31:
        /***/ ((module) => {

            "use strict";


            module.exports = function block(state) {
                var token;

                if (state.inlineMode) {
                    token = new state.Token('inline', '', 0);
                    token.content = state.src;
                    token.map = [0, 1];
                    token.children = [];
                    state.tokens.push(token);
                } else {
                    state.md.block.parse(state.src, state.md, state.env, state.tokens);
                }
            };


            /***/
        }),

        /***/ 1951:
        /***/ ((module) => {

            "use strict";


            module.exports = function inline(state) {
                var tokens = state.tokens, tok, i, l;

                // Parse inlines
                for (i = 0, l = tokens.length; i < l; i++) {
                    tok = tokens[i];
                    if (tok.type === 'inline') {
                        state.md.inline.parse(tok.content, state.md, state.env, tok.children);
                    }
                }
            };


            /***/
        }),

        /***/ 5462:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Replace link-like texts with link nodes.
//
// Currently restricted by `md.validateLink()` to http/https/ftp
//


            var arrayReplaceAt = (__nccwpck_require__(506).arrayReplaceAt);


            function isLinkOpen(str) {
                return /^<a[>\s]/i.test(str);
            }

            function isLinkClose(str) {
                return /^<\/a\s*>/i.test(str);
            }


            module.exports = function linkify(state) {
                var i, j, l, tokens, token, currentToken, nodes, ln, text, pos, lastPos,
                  level, htmlLinkLevel, url, fullUrl, urlText,
                  blockTokens = state.tokens,
                  links;

                if (!state.md.options.linkify) {
                    return;
                }

                for (j = 0, l = blockTokens.length; j < l; j++) {
                    if (blockTokens[j].type !== 'inline' ||
                      !state.md.linkify.pretest(blockTokens[j].content)) {
                        continue;
                    }

                    tokens = blockTokens[j].children;

                    htmlLinkLevel = 0;

                    // We scan from the end, to keep position when new tags added.
                    // Use reversed logic in links start/end match
                    for (i = tokens.length - 1; i >= 0; i--) {
                        currentToken = tokens[i];

                        // Skip content of markdown links
                        if (currentToken.type === 'link_close') {
                            i--;
                            while (tokens[i].level !== currentToken.level && tokens[i].type !== 'link_open') {
                                i--;
                            }
                            continue;
                        }

                        // Skip content of html tag links
                        if (currentToken.type === 'html_inline') {
                            if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
                                htmlLinkLevel--;
                            }
                            if (isLinkClose(currentToken.content)) {
                                htmlLinkLevel++;
                            }
                        }
                        if (htmlLinkLevel > 0) {
                            continue;
                        }

                        if (currentToken.type === 'text' && state.md.linkify.test(currentToken.content)) {

                            text = currentToken.content;
                            links = state.md.linkify.match(text);

                            // Now split string to nodes
                            nodes = [];
                            level = currentToken.level;
                            lastPos = 0;

                            // forbid escape sequence at the start of the string,
                            // this avoids http\://example.com/ from being linkified as
                            // http:<a href="//example.com/">//example.com/</a>
                            if (links.length > 0 &&
                              links[0].index === 0 &&
                              i > 0 &&
                              tokens[i - 1].type === 'text_special') {
                                links = links.slice(1);
                            }

                            for (ln = 0; ln < links.length; ln++) {
                                url = links[ln].url;
                                fullUrl = state.md.normalizeLink(url);
                                if (!state.md.validateLink(fullUrl)) {
                                    continue;
                                }

                                urlText = links[ln].text;

                                // Linkifier might send raw hostnames like "example.com", where url
                                // starts with domain name. So we prepend http:// in those cases,
                                // and remove it afterwards.
                                //
                                if (!links[ln].schema) {
                                    urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
                                } else if (links[ln].schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
                                    urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
                                } else {
                                    urlText = state.md.normalizeLinkText(urlText);
                                }

                                pos = links[ln].index;

                                if (pos > lastPos) {
                                    token = new state.Token('text', '', 0);
                                    token.content = text.slice(lastPos, pos);
                                    token.level = level;
                                    nodes.push(token);
                                }

                                token = new state.Token('link_open', 'a', 1);
                                token.attrs = [['href', fullUrl]];
                                token.level = level++;
                                token.markup = 'linkify';
                                token.info = 'auto';
                                nodes.push(token);

                                token = new state.Token('text', '', 0);
                                token.content = urlText;
                                token.level = level;
                                nodes.push(token);

                                token = new state.Token('link_close', 'a', -1);
                                token.level = --level;
                                token.markup = 'linkify';
                                token.info = 'auto';
                                nodes.push(token);

                                lastPos = links[ln].lastIndex;
                            }
                            if (lastPos < text.length) {
                                token = new state.Token('text', '', 0);
                                token.content = text.slice(lastPos);
                                token.level = level;
                                nodes.push(token);
                            }

                            // replace current node
                            blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
                        }
                    }
                }
            };


            /***/
        }),

        /***/ 2764:
        /***/ ((module) => {

            "use strict";
// Normalize input string


// https://spec.commonmark.org/0.29/#line-ending
            var NEWLINES_RE = /\r\n?|\n/g;
            var NULL_RE = /\0/g;


            module.exports = function normalize(state) {
                var str;

                // Normalize newlines
                str = state.src.replace(NEWLINES_RE, '\n');

                // Replace NULL characters
                str = str.replace(NULL_RE, '\uFFFD');

                state.src = str;
            };


            /***/
        }),

        /***/ 8373:
        /***/ ((module) => {

            "use strict";
// Simple typographic replacements
//
// (c) (C) → ©
// (tm) (TM) → ™
// (r) (R) → ®
// +- → ±
// ... → … (also ?.... → ?.., !.... → !..)
// ???????? → ???, !!!!! → !!!, `,,` → `,`
// -- → &ndash;, --- → &mdash;
//


// TODO:
// - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
// - multiplications 2 x 4 -> 2 × 4

            var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;

// Workaround for phantomjs - need regex without /g flag,
// or root check will fail every second time
            var SCOPED_ABBR_TEST_RE = /\((c|tm|r)\)/i;

            var SCOPED_ABBR_RE = /\((c|tm|r)\)/ig;
            var SCOPED_ABBR = {
                c: '©',
                r: '®',
                tm: '™'
            };

            function replaceFn(match, name) {
                return SCOPED_ABBR[name.toLowerCase()];
            }

            function replace_scoped(inlineTokens) {
                var i, token, inside_autolink = 0;

                for (i = inlineTokens.length - 1; i >= 0; i--) {
                    token = inlineTokens[i];

                    if (token.type === 'text' && !inside_autolink) {
                        token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
                    }

                    if (token.type === 'link_open' && token.info === 'auto') {
                        inside_autolink--;
                    }

                    if (token.type === 'link_close' && token.info === 'auto') {
                        inside_autolink++;
                    }
                }
            }

            function replace_rare(inlineTokens) {
                var i, token, inside_autolink = 0;

                for (i = inlineTokens.length - 1; i >= 0; i--) {
                    token = inlineTokens[i];

                    if (token.type === 'text' && !inside_autolink) {
                        if (RARE_RE.test(token.content)) {
                            token.content = token.content
                              .replace(/\+-/g, '±')
                              // .., ..., ....... -> …
                              // but ?..... & !..... -> ?.. & !..
                              .replace(/\.{2,}/g, '…').replace(/([?!])…/g, '$1..')
                              .replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',')
                              // em-dash
                              .replace(/(^|[^-])---(?=[^-]|$)/mg, '$1\u2014')
                              // en-dash
                              .replace(/(^|\s)--(?=\s|$)/mg, '$1\u2013')
                              .replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, '$1\u2013');
                        }
                    }

                    if (token.type === 'link_open' && token.info === 'auto') {
                        inside_autolink--;
                    }

                    if (token.type === 'link_close' && token.info === 'auto') {
                        inside_autolink++;
                    }
                }
            }


            module.exports = function replace(state) {
                var blkIdx;

                if (!state.md.options.typographer) {
                    return;
                }

                for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

                    if (state.tokens[blkIdx].type !== 'inline') {
                        continue;
                    }

                    if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
                        replace_scoped(state.tokens[blkIdx].children);
                    }

                    if (RARE_RE.test(state.tokens[blkIdx].content)) {
                        replace_rare(state.tokens[blkIdx].children);
                    }

                }
            };


            /***/
        }),

        /***/ 2178:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Convert straight quotation marks to typographic ones
//


            var isWhiteSpace = (__nccwpck_require__(506).isWhiteSpace);
            var isPunctChar = (__nccwpck_require__(506).isPunctChar);
            var isMdAsciiPunct = (__nccwpck_require__(506).isMdAsciiPunct);

            var QUOTE_TEST_RE = /['"]/;
            var QUOTE_RE = /['"]/g;
            var APOSTROPHE = '\u2019'; /* ’ */


            function replaceAt(str, index, ch) {
                return str.slice(0, index) + ch + str.slice(index + 1);
            }

            function process_inlines(tokens, state) {
                var i, token, text, t, pos, max, thisLevel, item, lastChar, nextChar,
                  isLastPunctChar, isNextPunctChar, isLastWhiteSpace, isNextWhiteSpace,
                  canOpen, canClose, j, isSingle, stack, openQuote, closeQuote;

                stack = [];

                for (i = 0; i < tokens.length; i++) {
                    token = tokens[i];

                    thisLevel = tokens[i].level;

                    for (j = stack.length - 1; j >= 0; j--) {
                        if (stack[j].level <= thisLevel) {
                            break;
                        }
                    }
                    stack.length = j + 1;

                    if (token.type !== 'text') {
                        continue;
                    }

                    text = token.content;
                    pos = 0;
                    max = text.length;

                    /*eslint no-labels:0,block-scoped-var:0*/
                    OUTER:
                      while (pos < max) {
                          QUOTE_RE.lastIndex = pos;
                          t = QUOTE_RE.exec(text);
                          if (!t) {
                              break;
                          }

                          canOpen = canClose = true;
                          pos = t.index + 1;
                          isSingle = (t[0] === "'");

                          // Find previous character,
                          // default to space if it's the beginning of the line
                          //
                          lastChar = 0x20;

                          if (t.index - 1 >= 0) {
                              lastChar = text.charCodeAt(t.index - 1);
                          } else {
                              for (j = i - 1; j >= 0; j--) {
                                  if (tokens[j].type === 'softbreak' || tokens[j].type === 'hardbreak') break; // lastChar defaults to 0x20
                                  if (!tokens[j].content) continue; // should skip all tokens except 'text', 'html_inline' or 'code_inline'

                                  lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
                                  break;
                              }
                          }

                          // Find next character,
                          // default to space if it's the end of the line
                          //
                          nextChar = 0x20;

                          if (pos < max) {
                              nextChar = text.charCodeAt(pos);
                          } else {
                              for (j = i + 1; j < tokens.length; j++) {
                                  if (tokens[j].type === 'softbreak' || tokens[j].type === 'hardbreak') break; // nextChar defaults to 0x20
                                  if (!tokens[j].content) continue; // should skip all tokens except 'text', 'html_inline' or 'code_inline'

                                  nextChar = tokens[j].content.charCodeAt(0);
                                  break;
                              }
                          }

                          isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
                          isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

                          isLastWhiteSpace = isWhiteSpace(lastChar);
                          isNextWhiteSpace = isWhiteSpace(nextChar);

                          if (isNextWhiteSpace) {
                              canOpen = false;
                          } else if (isNextPunctChar) {
                              if (!(isLastWhiteSpace || isLastPunctChar)) {
                                  canOpen = false;
                              }
                          }

                          if (isLastWhiteSpace) {
                              canClose = false;
                          } else if (isLastPunctChar) {
                              if (!(isNextWhiteSpace || isNextPunctChar)) {
                                  canClose = false;
                              }
                          }

                          if (nextChar === 0x22 /* " */ && t[0] === '"') {
                              if (lastChar >= 0x30 /* 0 */ && lastChar <= 0x39 /* 9 */) {
                                  // special case: 1"" - count first quote as an inch
                                  canClose = canOpen = false;
                              }
                          }

                          if (canOpen && canClose) {
                              // Replace quotes in the middle of punctuation sequence, but not
                              // in the middle of the words, i.e.:
                              //
                              // 1. foo " bar " baz - not replaced
                              // 2. foo-"-bar-"-baz - replaced
                              // 3. foo"bar"baz     - not replaced
                              //
                              canOpen = isLastPunctChar;
                              canClose = isNextPunctChar;
                          }

                          if (!canOpen && !canClose) {
                              // middle of word
                              if (isSingle) {
                                  token.content = replaceAt(token.content, t.index, APOSTROPHE);
                              }
                              continue;
                          }

                          if (canClose) {
                              // this could be a closing quote, rewind the stack to get a match
                              for (j = stack.length - 1; j >= 0; j--) {
                                  item = stack[j];
                                  if (stack[j].level < thisLevel) {
                                      break;
                                  }
                                  if (item.single === isSingle && stack[j].level === thisLevel) {
                                      item = stack[j];

                                      if (isSingle) {
                                          openQuote = state.md.options.quotes[2];
                                          closeQuote = state.md.options.quotes[3];
                                      } else {
                                          openQuote = state.md.options.quotes[0];
                                          closeQuote = state.md.options.quotes[1];
                                      }

                                      // replace token.content *before* tokens[item.token].content,
                                      // because, if they are pointing at the same token, replaceAt
                                      // could mess up indices when quote length != 1
                                      token.content = replaceAt(token.content, t.index, closeQuote);
                                      tokens[item.token].content = replaceAt(
                                        tokens[item.token].content, item.pos, openQuote);

                                      pos += closeQuote.length - 1;
                                      if (item.token === i) {
                                          pos += openQuote.length - 1;
                                      }

                                      text = token.content;
                                      max = text.length;

                                      stack.length = j;
                                      continue OUTER;
                                  }
                              }
                          }

                          if (canOpen) {
                              stack.push({
                                  token: i,
                                  pos: t.index,
                                  single: isSingle,
                                  level: thisLevel
                              });
                          } else if (canClose && isSingle) {
                              token.content = replaceAt(token.content, t.index, APOSTROPHE);
                          }
                      }
                }
            }


            module.exports = function smartquotes(state) {
                /*eslint max-depth:0*/
                var blkIdx;

                if (!state.md.options.typographer) {
                    return;
                }

                for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

                    if (state.tokens[blkIdx].type !== 'inline' ||
                      !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
                        continue;
                    }

                    process_inlines(state.tokens[blkIdx].children, state);
                }
            };


            /***/
        }),

        /***/ 9052:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Core state object
//


            var Token = __nccwpck_require__(8622);


            function StateCore(src, md, env) {
                this.src = src;
                this.env = env;
                this.tokens = [];
                this.inlineMode = false;
                this.md = md; // link to parser instance
            }

// re-export Token class to use in core rules
            StateCore.prototype.Token = Token;


            module.exports = StateCore;


            /***/
        }),

        /***/ 7502:
        /***/ ((module) => {

            "use strict";
// Join raw text tokens with the rest of the text
//
// This is set as a separate rule to provide an opportunity for plugins
// to run text replacements after text join, but before escape join.
//
// For example, `\:)` shouldn't be replaced with an emoji.
//


            module.exports = function text_join(state) {
                var j, l, tokens, curr, max, last,
                  blockTokens = state.tokens;

                for (j = 0, l = blockTokens.length; j < l; j++) {
                    if (blockTokens[j].type !== 'inline') continue;

                    tokens = blockTokens[j].children;
                    max = tokens.length;

                    for (curr = 0; curr < max; curr++) {
                        if (tokens[curr].type === 'text_special') {
                            tokens[curr].type = 'text';
                        }
                    }

                    for (curr = last = 0; curr < max; curr++) {
                        if (tokens[curr].type === 'text' &&
                          curr + 1 < max &&
                          tokens[curr + 1].type === 'text') {

                            // collapse two adjacent text nodes
                            tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
                        } else {
                            if (curr !== last) {
                                tokens[last] = tokens[curr];
                            }

                            last++;
                        }
                    }

                    if (curr !== last) {
                        tokens.length = last;
                    }
                }
            };


            /***/
        }),

        /***/ 3939:
        /***/ ((module) => {

            "use strict";
// Process autolinks '<protocol:...>'


            /*eslint max-len:0*/
            var EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
            var AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)$/;


            module.exports = function autolink(state, silent) {
                var url, fullUrl, token, ch, start, max,
                  pos = state.pos;

                if (state.src.charCodeAt(pos) !== 0x3C/* < */) {
                    return false;
                }

                start = state.pos;
                max = state.posMax;

                for (; ;) {
                    if (++pos >= max) return false;

                    ch = state.src.charCodeAt(pos);

                    if (ch === 0x3C /* < */) return false;
                    if (ch === 0x3E /* > */) break;
                }

                url = state.src.slice(start + 1, pos);

                if (AUTOLINK_RE.test(url)) {
                    fullUrl = state.md.normalizeLink(url);
                    if (!state.md.validateLink(fullUrl)) {
                        return false;
                    }

                    if (!silent) {
                        token = state.push('link_open', 'a', 1);
                        token.attrs = [['href', fullUrl]];
                        token.markup = 'autolink';
                        token.info = 'auto';

                        token = state.push('text', '', 0);
                        token.content = state.md.normalizeLinkText(url);

                        token = state.push('link_close', 'a', -1);
                        token.markup = 'autolink';
                        token.info = 'auto';
                    }

                    state.pos += url.length + 2;
                    return true;
                }

                if (EMAIL_RE.test(url)) {
                    fullUrl = state.md.normalizeLink('mailto:' + url);
                    if (!state.md.validateLink(fullUrl)) {
                        return false;
                    }

                    if (!silent) {
                        token = state.push('link_open', 'a', 1);
                        token.attrs = [['href', fullUrl]];
                        token.markup = 'autolink';
                        token.info = 'auto';

                        token = state.push('text', '', 0);
                        token.content = state.md.normalizeLinkText(url);

                        token = state.push('link_close', 'a', -1);
                        token.markup = 'autolink';
                        token.info = 'auto';
                    }

                    state.pos += url.length + 2;
                    return true;
                }

                return false;
            };


            /***/
        }),

        /***/ 8520:
        /***/ ((module) => {

            "use strict";
// Parse backticks


            module.exports = function backtick(state, silent) {
                var start, max, marker, token, matchStart, matchEnd, openerLength, closerLength,
                  pos = state.pos,
                  ch = state.src.charCodeAt(pos);

                if (ch !== 0x60/* ` */) {
                    return false;
                }

                start = pos;
                pos++;
                max = state.posMax;

                // scan marker length
                while (pos < max && state.src.charCodeAt(pos) === 0x60/* ` */) {
                    pos++;
                }

                marker = state.src.slice(start, pos);
                openerLength = marker.length;

                if (state.backticksScanned && (state.backticks[openerLength] || 0) <= start) {
                    if (!silent) state.pending += marker;
                    state.pos += openerLength;
                    return true;
                }

                matchEnd = pos;

                // Nothing found in the cache, scan until the end of the line (or until marker is found)
                while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
                    matchEnd = matchStart + 1;

                    // scan marker length
                    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60/* ` */) {
                        matchEnd++;
                    }

                    closerLength = matchEnd - matchStart;

                    if (closerLength === openerLength) {
                        // Found matching closer length.
                        if (!silent) {
                            token = state.push('code_inline', 'code', 0);
                            token.markup = marker;
                            token.content = state.src.slice(pos, matchStart)
                              .replace(/\n/g, ' ')
                              .replace(/^ (.+) $/, '$1');
                        }
                        state.pos = matchEnd;
                        return true;
                    }

                    // Some different length found, put it in cache as upper limit of where closer can be found
                    state.backticks[closerLength] = matchStart;
                }

                // Scanned through the end, didn't find anything
                state.backticksScanned = true;

                if (!silent) state.pending += marker;
                state.pos += openerLength;
                return true;
            };


            /***/
        }),

        /***/ 9418:
        /***/ ((module) => {

            "use strict";
// For each opening emphasis-like marker find a matching closing one
//


            function processDelimiters(delimiters) {
                var closerIdx, openerIdx, closer, opener, minOpenerIdx, newMinOpenerIdx,
                  isOddMatch, lastJump,
                  openersBottom = {},
                  max = delimiters.length;

                if (!max) return;

                // headerIdx is the first delimiter of the current (where closer is) delimiter run
                var headerIdx = 0;
                var lastTokenIdx = -2; // needs any value lower than -1
                var jumps = [];

                for (closerIdx = 0; closerIdx < max; closerIdx++) {
                    closer = delimiters[closerIdx];

                    jumps.push(0);

                    // markers belong to same delimiter run if:
                    //  - they have adjacent tokens
                    //  - AND markers are the same
                    //
                    if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) {
                        headerIdx = closerIdx;
                    }

                    lastTokenIdx = closer.token;

                    // Length is only used for emphasis-specific "rule of 3",
                    // if it's not defined (in strikethrough or 3rd party plugins),
                    // we can default it to 0 to disable those checks.
                    //
                    closer.length = closer.length || 0;

                    if (!closer.close) continue;

                    // Previously calculated lower bounds (previous fails)
                    // for each marker, each delimiter length modulo 3,
                    // and for whether this closer can be an opener;
                    // https://github.com/commonmark/cmark/commit/34250e12ccebdc6372b8b49c44fab57c72443460
                    if (!openersBottom.hasOwnProperty(closer.marker)) {
                        openersBottom[closer.marker] = [-1, -1, -1, -1, -1, -1];
                    }

                    minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length % 3)];

                    openerIdx = headerIdx - jumps[headerIdx] - 1;

                    newMinOpenerIdx = openerIdx;

                    for (; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1) {
                        opener = delimiters[openerIdx];

                        if (opener.marker !== closer.marker) continue;

                        if (opener.open && opener.end < 0) {

                            isOddMatch = false;

                            // from spec:
                            //
                            // If one of the delimiters can both open and close emphasis, then the
                            // sum of the lengths of the delimiter runs containing the opening and
                            // closing delimiters must not be a multiple of 3 unless both lengths
                            // are multiples of 3.
                            //
                            if (opener.close || closer.open) {
                                if ((opener.length + closer.length) % 3 === 0) {
                                    if (opener.length % 3 !== 0 || closer.length % 3 !== 0) {
                                        isOddMatch = true;
                                    }
                                }
                            }

                            if (!isOddMatch) {
                                // If previous delimiter cannot be an opener, we can safely skip
                                // the entire sequence in future checks. This is required to make
                                // sure algorithm has linear complexity (see *_*_*_*_*_... case).
                                //
                                lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ?
                                  jumps[openerIdx - 1] + 1 :
                                  0;

                                jumps[closerIdx] = closerIdx - openerIdx + lastJump;
                                jumps[openerIdx] = lastJump;

                                closer.open = false;
                                opener.end = closerIdx;
                                opener.close = false;
                                newMinOpenerIdx = -1;
                                // treat next token as start of run,
                                // it optimizes skips in **<...>**a**<...>** pathological case
                                lastTokenIdx = -2;
                                break;
                            }
                        }
                    }

                    if (newMinOpenerIdx !== -1) {
                        // If match for this delimiter run failed, we want to set lower bound for
                        // future lookups. This is required to make sure algorithm has linear
                        // complexity.
                        //
                        // See details here:
                        // https://github.com/commonmark/cmark/issues/178#issuecomment-270417442
                        //
                        openersBottom[closer.marker][(closer.open ? 3 : 0) + ((closer.length || 0) % 3)] = newMinOpenerIdx;
                    }
                }
            }


            module.exports = function link_pairs(state) {
                var curr,
                  tokens_meta = state.tokens_meta,
                  max = state.tokens_meta.length;

                processDelimiters(state.delimiters);

                for (curr = 0; curr < max; curr++) {
                    if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
                        processDelimiters(tokens_meta[curr].delimiters);
                    }
                }
            };


            /***/
        }),

        /***/ 1677:
        /***/ ((module) => {

            "use strict";
// Process *this* and _that_
//



// Insert each marker as a separate text token, and add it to delimiter list
//
            module.exports.w = function emphasis(state, silent) {
                var i, scanned, token,
                  start = state.pos,
                  marker = state.src.charCodeAt(start);

                if (silent) {
                    return false;
                }

                if (marker !== 0x5F /* _ */ && marker !== 0x2A /* * */) {
                    return false;
                }

                scanned = state.scanDelims(state.pos, marker === 0x2A);

                for (i = 0; i < scanned.length; i++) {
                    token = state.push('text', '', 0);
                    token.content = String.fromCharCode(marker);

                    state.delimiters.push({
                        // Char code of the starting marker (number).
                        //
                        marker: marker,

                        // Total length of these series of delimiters.
                        //
                        length: scanned.length,

                        // A position of the token this delimiter corresponds to.
                        //
                        token: state.tokens.length - 1,

                        // If this delimiter is matched as a valid opener, `end` will be
                        // equal to its position, otherwise it's `-1`.
                        //
                        end: -1,

                        // Boolean flags that determine if this delimiter could open or close
                        // an emphasis.
                        //
                        open: scanned.can_open,
                        close: scanned.can_close
                    });
                }

                state.pos += scanned.length;

                return true;
            };


            function postProcess(state, delimiters) {
                var i,
                  startDelim,
                  endDelim,
                  token,
                  ch,
                  isStrong,
                  max = delimiters.length;

                for (i = max - 1; i >= 0; i--) {
                    startDelim = delimiters[i];

                    if (startDelim.marker !== 0x5F/* _ */ && startDelim.marker !== 0x2A/* * */) {
                        continue;
                    }

                    // Process only opening markers
                    if (startDelim.end === -1) {
                        continue;
                    }

                    endDelim = delimiters[startDelim.end];

                    // If the previous delimiter has the same marker and is adjacent to this one,
                    // merge those into one strong delimiter.
                    //
                    // `<em><em>whatever</em></em>` -> `<strong>whatever</strong>`
                    //
                    isStrong = i > 0 &&
                      delimiters[i - 1].end === startDelim.end + 1 &&
                      // check that first two markers match and adjacent
                      delimiters[i - 1].marker === startDelim.marker &&
                      delimiters[i - 1].token === startDelim.token - 1 &&
                      // check that last two markers are adjacent (we can safely assume they match)
                      delimiters[startDelim.end + 1].token === endDelim.token + 1;

                    ch = String.fromCharCode(startDelim.marker);

                    token = state.tokens[startDelim.token];
                    token.type = isStrong ? 'strong_open' : 'em_open';
                    token.tag = isStrong ? 'strong' : 'em';
                    token.nesting = 1;
                    token.markup = isStrong ? ch + ch : ch;
                    token.content = '';

                    token = state.tokens[endDelim.token];
                    token.type = isStrong ? 'strong_close' : 'em_close';
                    token.tag = isStrong ? 'strong' : 'em';
                    token.nesting = -1;
                    token.markup = isStrong ? ch + ch : ch;
                    token.content = '';

                    if (isStrong) {
                        state.tokens[delimiters[i - 1].token].content = '';
                        state.tokens[delimiters[startDelim.end + 1].token].content = '';
                        i--;
                    }
                }
            }


// Walk through delimiter list and replace text tokens with tags
//
            module.exports.g = function emphasis(state) {
                var curr,
                  tokens_meta = state.tokens_meta,
                  max = state.tokens_meta.length;

                postProcess(state, state.delimiters);

                for (curr = 0; curr < max; curr++) {
                    if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
                        postProcess(state, tokens_meta[curr].delimiters);
                    }
                }
            };


            /***/
        }),

        /***/ 973:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Process html entity - &#123;, &#xAF;, &quot;, ...


            var entities = __nccwpck_require__(9220);
            var has = (__nccwpck_require__(506).has);
            var isValidEntityCode = (__nccwpck_require__(506).isValidEntityCode);
            var fromCodePoint = (__nccwpck_require__(506).fromCodePoint);


            var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
            var NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;


            module.exports = function entity(state, silent) {
                var ch, code, match, token, pos = state.pos, max = state.posMax;

                if (state.src.charCodeAt(pos) !== 0x26/* & */) return false;

                if (pos + 1 >= max) return false;

                ch = state.src.charCodeAt(pos + 1);

                if (ch === 0x23 /* # */) {
                    match = state.src.slice(pos).match(DIGITAL_RE);
                    if (match) {
                        if (!silent) {
                            code = match[1][0].toLowerCase() === 'x' ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);

                            token = state.push('text_special', '', 0);
                            token.content = isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(0xFFFD);
                            token.markup = match[0];
                            token.info = 'entity';
                        }
                        state.pos += match[0].length;
                        return true;
                    }
                } else {
                    match = state.src.slice(pos).match(NAMED_RE);
                    if (match) {
                        if (has(entities, match[1])) {
                            if (!silent) {
                                token = state.push('text_special', '', 0);
                                token.content = entities[match[1]];
                                token.markup = match[0];
                                token.info = 'entity';
                            }
                            state.pos += match[0].length;
                            return true;
                        }
                    }
                }

                return false;
            };


            /***/
        }),

        /***/ 1836:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Process escaped chars and hardbreaks


            var isSpace = (__nccwpck_require__(506).isSpace);

            var ESCAPED = [];

            for (var i = 0; i < 256; i++) {
                ESCAPED.push(0);
            }

            '\\!"#$%&\'()*+,./:;<=>?@[]^_`{|}~-'
              .split('').forEach(function(ch) {
                ESCAPED[ch.charCodeAt(0)] = 1;
            });


            module.exports = function escape(state, silent) {
                var ch1, ch2, origStr, escapedStr, token, pos = state.pos, max = state.posMax;

                if (state.src.charCodeAt(pos) !== 0x5C/* \ */) return false;
                pos++;

                // '\' at the end of the inline block
                if (pos >= max) return false;

                ch1 = state.src.charCodeAt(pos);

                if (ch1 === 0x0A) {
                    if (!silent) {
                        state.push('hardbreak', 'br', 0);
                    }

                    pos++;
                    // skip leading whitespaces from next line
                    while (pos < max) {
                        ch1 = state.src.charCodeAt(pos);
                        if (!isSpace(ch1)) break;
                        pos++;
                    }

                    state.pos = pos;
                    return true;
                }

                escapedStr = state.src[pos];

                if (ch1 >= 0xD800 && ch1 <= 0xDBFF && pos + 1 < max) {
                    ch2 = state.src.charCodeAt(pos + 1);

                    if (ch2 >= 0xDC00 && ch2 <= 0xDFFF) {
                        escapedStr += state.src[pos + 1];
                        pos++;
                    }
                }

                origStr = '\\' + escapedStr;

                if (!silent) {
                    token = state.push('text_special', '', 0);

                    if (ch1 < 256 && ESCAPED[ch1] !== 0) {
                        token.content = escapedStr;
                    } else {
                        token.content = origStr;
                    }

                    token.markup = origStr;
                    token.info = 'escape';
                }

                state.pos = pos + 1;
                return true;
            };


            /***/
        }),

        /***/ 3807:
        /***/ ((module) => {

            "use strict";
// Clean up tokens after emphasis and strikethrough postprocessing:
// merge adjacent text nodes into one and re-calculate all token levels
//
// This is necessary because initially emphasis delimiter markers (*, _, ~)
// are treated as their own separate text tokens. Then emphasis rule either
// leaves them as text (needed to merge with adjacent text) or turns them
// into opening/closing tags (which messes up levels inside).
//


            module.exports = function fragments_join(state) {
                var curr, last,
                  level = 0,
                  tokens = state.tokens,
                  max = state.tokens.length;

                for (curr = last = 0; curr < max; curr++) {
                    // re-calculate levels after emphasis/strikethrough turns some text nodes
                    // into opening/closing tags
                    if (tokens[curr].nesting < 0) level--; // closing tag
                    tokens[curr].level = level;
                    if (tokens[curr].nesting > 0) level++; // opening tag

                    if (tokens[curr].type === 'text' &&
                      curr + 1 < max &&
                      tokens[curr + 1].type === 'text') {

                        // collapse two adjacent text nodes
                        tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
                    } else {
                        if (curr !== last) {
                            tokens[last] = tokens[curr];
                        }

                        last++;
                    }
                }

                if (curr !== last) {
                    tokens.length = last;
                }
            };


            /***/
        }),

        /***/ 7753:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Process html tags


            var HTML_TAG_RE = (__nccwpck_require__(6537)/* .HTML_TAG_RE */.n);


            function isLinkOpen(str) {
                return /^<a[>\s]/i.test(str);
            }

            function isLinkClose(str) {
                return /^<\/a\s*>/i.test(str);
            }


            function isLetter(ch) {
                /*eslint no-bitwise:0*/
                var lc = ch | 0x20; // to lower case
                return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
            }


            module.exports = function html_inline(state, silent) {
                var ch, match, max, token,
                  pos = state.pos;

                if (!state.md.options.html) {
                    return false;
                }

                // Check start
                max = state.posMax;
                if (state.src.charCodeAt(pos) !== 0x3C/* < */ ||
                  pos + 2 >= max) {
                    return false;
                }

                // Quick fail on second char
                ch = state.src.charCodeAt(pos + 1);
                if (ch !== 0x21/* ! */ &&
                  ch !== 0x3F/* ? */ &&
                  ch !== 0x2F/* / */ &&
                  !isLetter(ch)) {
                    return false;
                }

                match = state.src.slice(pos).match(HTML_TAG_RE);
                if (!match) {
                    return false;
                }

                if (!silent) {
                    token = state.push('html_inline', '', 0);
                    token.content = match[0];

                    if (isLinkOpen(token.content)) state.linkLevel++;
                    if (isLinkClose(token.content)) state.linkLevel--;
                }
                state.pos += match[0].length;
                return true;
            };


            /***/
        }),

        /***/ 9998:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Process ![image](<src> "title")


            var normalizeReference = (__nccwpck_require__(506).normalizeReference);
            var isSpace = (__nccwpck_require__(506).isSpace);


            module.exports = function image(state, silent) {
                var attrs,
                  code,
                  content,
                  label,
                  labelEnd,
                  labelStart,
                  pos,
                  ref,
                  res,
                  title,
                  token,
                  tokens,
                  start,
                  href = '',
                  oldPos = state.pos,
                  max = state.posMax;

                if (state.src.charCodeAt(state.pos) !== 0x21/* ! */) {
                    return false;
                }
                if (state.src.charCodeAt(state.pos + 1) !== 0x5B/* [ */) {
                    return false;
                }

                labelStart = state.pos + 2;
                labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);

                // parser failed to find ']', so it's not a valid link
                if (labelEnd < 0) {
                    return false;
                }

                pos = labelEnd + 1;
                if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
                    //
                    // Inline link
                    //

                    // [link](  <href>  "title"  )
                    //        ^^ skipping these spaces
                    pos++;
                    for (; pos < max; pos++) {
                        code = state.src.charCodeAt(pos);
                        if (!isSpace(code) && code !== 0x0A) {
                            break;
                        }
                    }
                    if (pos >= max) {
                        return false;
                    }

                    // [link](  <href>  "title"  )
                    //          ^^^^^^ parsing link destination
                    start = pos;
                    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
                    if (res.ok) {
                        href = state.md.normalizeLink(res.str);
                        if (state.md.validateLink(href)) {
                            pos = res.pos;
                        } else {
                            href = '';
                        }
                    }

                    // [link](  <href>  "title"  )
                    //                ^^ skipping these spaces
                    start = pos;
                    for (; pos < max; pos++) {
                        code = state.src.charCodeAt(pos);
                        if (!isSpace(code) && code !== 0x0A) {
                            break;
                        }
                    }

                    // [link](  <href>  "title"  )
                    //                  ^^^^^^^ parsing link title
                    res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
                    if (pos < max && start !== pos && res.ok) {
                        title = res.str;
                        pos = res.pos;

                        // [link](  <href>  "title"  )
                        //                         ^^ skipping these spaces
                        for (; pos < max; pos++) {
                            code = state.src.charCodeAt(pos);
                            if (!isSpace(code) && code !== 0x0A) {
                                break;
                            }
                        }
                    } else {
                        title = '';
                    }

                    if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
                        state.pos = oldPos;
                        return false;
                    }
                    pos++;
                } else {
                    //
                    // Link reference
                    //
                    if (typeof state.env.references === 'undefined') {
                        return false;
                    }

                    if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
                        start = pos + 1;
                        pos = state.md.helpers.parseLinkLabel(state, pos);
                        if (pos >= 0) {
                            label = state.src.slice(start, pos++);
                        } else {
                            pos = labelEnd + 1;
                        }
                    } else {
                        pos = labelEnd + 1;
                    }

                    // covers label === '' and label === undefined
                    // (collapsed reference link and shortcut reference link respectively)
                    if (!label) {
                        label = state.src.slice(labelStart, labelEnd);
                    }

                    ref = state.env.references[normalizeReference(label)];
                    if (!ref) {
                        state.pos = oldPos;
                        return false;
                    }
                    href = ref.href;
                    title = ref.title;
                }

                //
                // We found the end of the link, and know for a fact it's a valid link;
                // so all that's left to do is to call tokenizer.
                //
                if (!silent) {
                    content = state.src.slice(labelStart, labelEnd);

                    state.md.inline.parse(
                      content,
                      state.md,
                      state.env,
                      tokens = []
                    );

                    token = state.push('image', 'img', 0);
                    token.attrs = attrs = [['src', href], ['alt', '']];
                    token.children = tokens;
                    token.content = content;

                    if (title) {
                        attrs.push(['title', title]);
                    }
                }

                state.pos = pos;
                state.posMax = max;
                return true;
            };


            /***/
        }),

        /***/ 8798:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Process [link](<to> "stuff")


            var normalizeReference = (__nccwpck_require__(506).normalizeReference);
            var isSpace = (__nccwpck_require__(506).isSpace);


            module.exports = function link(state, silent) {
                var attrs,
                  code,
                  label,
                  labelEnd,
                  labelStart,
                  pos,
                  res,
                  ref,
                  token,
                  href = '',
                  title = '',
                  oldPos = state.pos,
                  max = state.posMax,
                  start = state.pos,
                  parseReference = true;

                if (state.src.charCodeAt(state.pos) !== 0x5B/* [ */) {
                    return false;
                }

                labelStart = state.pos + 1;
                labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);

                // parser failed to find ']', so it's not a valid link
                if (labelEnd < 0) {
                    return false;
                }

                pos = labelEnd + 1;
                if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
                    //
                    // Inline link
                    //

                    // might have found a valid shortcut link, disable reference parsing
                    parseReference = false;

                    // [link](  <href>  "title"  )
                    //        ^^ skipping these spaces
                    pos++;
                    for (; pos < max; pos++) {
                        code = state.src.charCodeAt(pos);
                        if (!isSpace(code) && code !== 0x0A) {
                            break;
                        }
                    }
                    if (pos >= max) {
                        return false;
                    }

                    // [link](  <href>  "title"  )
                    //          ^^^^^^ parsing link destination
                    start = pos;
                    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
                    if (res.ok) {
                        href = state.md.normalizeLink(res.str);
                        if (state.md.validateLink(href)) {
                            pos = res.pos;
                        } else {
                            href = '';
                        }

                        // [link](  <href>  "title"  )
                        //                ^^ skipping these spaces
                        start = pos;
                        for (; pos < max; pos++) {
                            code = state.src.charCodeAt(pos);
                            if (!isSpace(code) && code !== 0x0A) {
                                break;
                            }
                        }

                        // [link](  <href>  "title"  )
                        //                  ^^^^^^^ parsing link title
                        res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
                        if (pos < max && start !== pos && res.ok) {
                            title = res.str;
                            pos = res.pos;

                            // [link](  <href>  "title"  )
                            //                         ^^ skipping these spaces
                            for (; pos < max; pos++) {
                                code = state.src.charCodeAt(pos);
                                if (!isSpace(code) && code !== 0x0A) {
                                    break;
                                }
                            }
                        }
                    }

                    if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
                        // parsing a valid shortcut link failed, fallback to reference
                        parseReference = true;
                    }
                    pos++;
                }

                if (parseReference) {
                    //
                    // Link reference
                    //
                    if (typeof state.env.references === 'undefined') {
                        return false;
                    }

                    if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
                        start = pos + 1;
                        pos = state.md.helpers.parseLinkLabel(state, pos);
                        if (pos >= 0) {
                            label = state.src.slice(start, pos++);
                        } else {
                            pos = labelEnd + 1;
                        }
                    } else {
                        pos = labelEnd + 1;
                    }

                    // covers label === '' and label === undefined
                    // (collapsed reference link and shortcut reference link respectively)
                    if (!label) {
                        label = state.src.slice(labelStart, labelEnd);
                    }

                    ref = state.env.references[normalizeReference(label)];
                    if (!ref) {
                        state.pos = oldPos;
                        return false;
                    }
                    href = ref.href;
                    title = ref.title;
                }

                //
                // We found the end of the link, and know for a fact it's a valid link;
                // so all that's left to do is to call tokenizer.
                //
                if (!silent) {
                    state.pos = labelStart;
                    state.posMax = labelEnd;

                    token = state.push('link_open', 'a', 1);
                    token.attrs = attrs = [['href', href]];
                    if (title) {
                        attrs.push(['title', title]);
                    }

                    state.linkLevel++;
                    state.md.inline.tokenize(state);
                    state.linkLevel--;

                    token = state.push('link_close', 'a', -1);
                }

                state.pos = pos;
                state.posMax = max;
                return true;
            };


            /***/
        }),

        /***/ 1783:
        /***/ ((module) => {

            "use strict";
// Process links like https://example.org/


// RFC3986: scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
            var SCHEME_RE = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;


            module.exports = function linkify(state, silent) {
                var pos, max, match, proto, link, url, fullUrl, token;

                if (!state.md.options.linkify) return false;
                if (state.linkLevel > 0) return false;

                pos = state.pos;
                max = state.posMax;

                if (pos + 3 > max) return false;
                if (state.src.charCodeAt(pos) !== 0x3A/* : */) return false;
                if (state.src.charCodeAt(pos + 1) !== 0x2F/* / */) return false;
                if (state.src.charCodeAt(pos + 2) !== 0x2F/* / */) return false;

                match = state.pending.match(SCHEME_RE);
                if (!match) return false;

                proto = match[1];

                link = state.md.linkify.matchAtStart(state.src.slice(pos - proto.length));
                if (!link) return false;

                url = link.url;

                // invalid link, but still detected by linkify somehow;
                // need to check to prevent infinite loop below
                if (url.length <= proto.length) return false;

                // disallow '*' at the end of the link (conflicts with emphasis)
                url = url.replace(/\*+$/, '');

                fullUrl = state.md.normalizeLink(url);
                if (!state.md.validateLink(fullUrl)) return false;

                if (!silent) {
                    state.pending = state.pending.slice(0, -proto.length);

                    token = state.push('link_open', 'a', 1);
                    token.attrs = [['href', fullUrl]];
                    token.markup = 'linkify';
                    token.info = 'auto';

                    token = state.push('text', '', 0);
                    token.content = state.md.normalizeLinkText(url);

                    token = state.push('link_close', 'a', -1);
                    token.markup = 'linkify';
                    token.info = 'auto';
                }

                state.pos += url.length - proto.length;
                return true;
            };


            /***/
        }),

        /***/ 8774:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Proceess '\n'


            var isSpace = (__nccwpck_require__(506).isSpace);


            module.exports = function newline(state, silent) {
                var pmax, max, ws, pos = state.pos;

                if (state.src.charCodeAt(pos) !== 0x0A/* \n */) {
                    return false;
                }

                pmax = state.pending.length - 1;
                max = state.posMax;

                // '  \n' -> hardbreak
                // Lookup in pending chars is bad practice! Don't copy to other rules!
                // Pending string is stored in concat mode, indexed lookups will cause
                // convertion to flat mode.
                if (!silent) {
                    if (pmax >= 0 && state.pending.charCodeAt(pmax) === 0x20) {
                        if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 0x20) {
                            // Find whitespaces tail of pending chars.
                            ws = pmax - 1;
                            while (ws >= 1 && state.pending.charCodeAt(ws - 1) === 0x20) ws--;

                            state.pending = state.pending.slice(0, ws);
                            state.push('hardbreak', 'br', 0);
                        } else {
                            state.pending = state.pending.slice(0, -1);
                            state.push('softbreak', 'br', 0);
                        }

                    } else {
                        state.push('softbreak', 'br', 0);
                    }
                }

                pos++;

                // skip heading spaces for next line
                while (pos < max && isSpace(state.src.charCodeAt(pos))) {
                    pos++;
                }

                state.pos = pos;
                return true;
            };


            /***/
        }),

        /***/ 1247:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";
// Inline parser state


            var Token = __nccwpck_require__(8622);
            var isWhiteSpace = (__nccwpck_require__(506).isWhiteSpace);
            var isPunctChar = (__nccwpck_require__(506).isPunctChar);
            var isMdAsciiPunct = (__nccwpck_require__(506).isMdAsciiPunct);


            function StateInline(src, md, env, outTokens) {
                this.src = src;
                this.env = env;
                this.md = md;
                this.tokens = outTokens;
                this.tokens_meta = Array(outTokens.length);

                this.pos = 0;
                this.posMax = this.src.length;
                this.level = 0;
                this.pending = '';
                this.pendingLevel = 0;

                // Stores { start: end } pairs. Useful for backtrack
                // optimization of pairs parse (emphasis, strikes).
                this.cache = {};

                // List of emphasis-like delimiters for current tag
                this.delimiters = [];

                // Stack of delimiter lists for upper level tags
                this._prev_delimiters = [];

                // backtick length => last seen position
                this.backticks = {};
                this.backticksScanned = false;

                // Counter used to disable inline linkify-it execution
                // inside <a> and markdown links
                this.linkLevel = 0;
            }


// Flush pending text
//
            StateInline.prototype.pushPending = function() {
                var token = new Token('text', '', 0);
                token.content = this.pending;
                token.level = this.pendingLevel;
                this.tokens.push(token);
                this.pending = '';
                return token;
            };


// Push new token to "stream".
// If pending text exists - flush it as text token
//
            StateInline.prototype.push = function(type, tag, nesting) {
                if (this.pending) {
                    this.pushPending();
                }

                var token = new Token(type, tag, nesting);
                var token_meta = null;

                if (nesting < 0) {
                    // closing tag
                    this.level--;
                    this.delimiters = this._prev_delimiters.pop();
                }

                token.level = this.level;

                if (nesting > 0) {
                    // opening tag
                    this.level++;
                    this._prev_delimiters.push(this.delimiters);
                    this.delimiters = [];
                    token_meta = { delimiters: this.delimiters };
                }

                this.pendingLevel = this.level;
                this.tokens.push(token);
                this.tokens_meta.push(token_meta);
                return token;
            };


// Scan a sequence of emphasis-like markers, and determine whether
// it can start an emphasis sequence or end an emphasis sequence.
//
//  - start - position to scan from (it should point at a valid marker);
//  - canSplitWord - determine if these markers can be found inside a word
//
            StateInline.prototype.scanDelims = function(start, canSplitWord) {
                var pos = start, lastChar, nextChar, count, can_open, can_close,
                  isLastWhiteSpace, isLastPunctChar,
                  isNextWhiteSpace, isNextPunctChar,
                  left_flanking = true,
                  right_flanking = true,
                  max = this.posMax,
                  marker = this.src.charCodeAt(start);

                // treat beginning of the line as a whitespace
                lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 0x20;

                while (pos < max && this.src.charCodeAt(pos) === marker) {
                    pos++;
                }

                count = pos - start;

                // treat end of the line as a whitespace
                nextChar = pos < max ? this.src.charCodeAt(pos) : 0x20;

                isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
                isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

                isLastWhiteSpace = isWhiteSpace(lastChar);
                isNextWhiteSpace = isWhiteSpace(nextChar);

                if (isNextWhiteSpace) {
                    left_flanking = false;
                } else if (isNextPunctChar) {
                    if (!(isLastWhiteSpace || isLastPunctChar)) {
                        left_flanking = false;
                    }
                }

                if (isLastWhiteSpace) {
                    right_flanking = false;
                } else if (isLastPunctChar) {
                    if (!(isNextWhiteSpace || isNextPunctChar)) {
                        right_flanking = false;
                    }
                }

                if (!canSplitWord) {
                    can_open = left_flanking && (!right_flanking || isLastPunctChar);
                    can_close = right_flanking && (!left_flanking || isNextPunctChar);
                } else {
                    can_open = left_flanking;
                    can_close = right_flanking;
                }

                return {
                    can_open: can_open,
                    can_close: can_close,
                    length: count
                };
            };


// re-export Token class to use in block rules
            StateInline.prototype.Token = Token;


            module.exports = StateInline;


            /***/
        }),

        /***/ 3015:
        /***/ ((module) => {

            "use strict";
// ~~strike through~~
//



// Insert each marker as a separate text token, and add it to delimiter list
//
            module.exports.w = function strikethrough(state, silent) {
                var i, scanned, token, len, ch,
                  start = state.pos,
                  marker = state.src.charCodeAt(start);

                if (silent) {
                    return false;
                }

                if (marker !== 0x7E/* ~ */) {
                    return false;
                }

                scanned = state.scanDelims(state.pos, true);
                len = scanned.length;
                ch = String.fromCharCode(marker);

                if (len < 2) {
                    return false;
                }

                if (len % 2) {
                    token = state.push('text', '', 0);
                    token.content = ch;
                    len--;
                }

                for (i = 0; i < len; i += 2) {
                    token = state.push('text', '', 0);
                    token.content = ch + ch;

                    state.delimiters.push({
                        marker: marker,
                        length: 0,     // disable "rule of 3" length checks meant for emphasis
                        token: state.tokens.length - 1,
                        end: -1,
                        open: scanned.can_open,
                        close: scanned.can_close
                    });
                }

                state.pos += scanned.length;

                return true;
            };


            function postProcess(state, delimiters) {
                var i, j,
                  startDelim,
                  endDelim,
                  token,
                  loneMarkers = [],
                  max = delimiters.length;

                for (i = 0; i < max; i++) {
                    startDelim = delimiters[i];

                    if (startDelim.marker !== 0x7E/* ~ */) {
                        continue;
                    }

                    if (startDelim.end === -1) {
                        continue;
                    }

                    endDelim = delimiters[startDelim.end];

                    token = state.tokens[startDelim.token];
                    token.type = 's_open';
                    token.tag = 's';
                    token.nesting = 1;
                    token.markup = '~~';
                    token.content = '';

                    token = state.tokens[endDelim.token];
                    token.type = 's_close';
                    token.tag = 's';
                    token.nesting = -1;
                    token.markup = '~~';
                    token.content = '';

                    if (state.tokens[endDelim.token - 1].type === 'text' &&
                      state.tokens[endDelim.token - 1].content === '~') {

                        loneMarkers.push(endDelim.token - 1);
                    }
                }

                // If a marker sequence has an odd number of characters, it's splitted
                // like this: `~~~~~` -> `~` + `~~` + `~~`, leaving one marker at the
                // start of the sequence.
                //
                // So, we have to move all those markers after subsequent s_close tags.
                //
                while (loneMarkers.length) {
                    i = loneMarkers.pop();
                    j = i + 1;

                    while (j < state.tokens.length && state.tokens[j].type === 's_close') {
                        j++;
                    }

                    j--;

                    if (i !== j) {
                        token = state.tokens[j];
                        state.tokens[j] = state.tokens[i];
                        state.tokens[i] = token;
                    }
                }
            }


// Walk through delimiter list and replace text tokens with tags
//
            module.exports.g = function strikethrough(state) {
                var curr,
                  tokens_meta = state.tokens_meta,
                  max = state.tokens_meta.length;

                postProcess(state, state.delimiters);

                for (curr = 0; curr < max; curr++) {
                    if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
                        postProcess(state, tokens_meta[curr].delimiters);
                    }
                }
            };


            /***/
        }),

        /***/ 1117:
        /***/ ((module) => {

            "use strict";
// Skip text characters for text token, place those to pending buffer
// and increment current pos


// Rule to skip pure text
// '{}$%@~+=:' reserved for extentions

// !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~

// !!!! Don't confuse with "Markdown ASCII Punctuation" chars
// http://spec.commonmark.org/0.15/#ascii-punctuation-character
            function isTerminatorChar(ch) {
                switch (ch) {
                    case 0x0A/* \n */
                    :
                    case 0x21/* ! */
                    :
                    case 0x23/* # */
                    :
                    case 0x24/* $ */
                    :
                    case 0x25/* % */
                    :
                    case 0x26/* & */
                    :
                    case 0x2A/* * */
                    :
                    case 0x2B/* + */
                    :
                    case 0x2D/* - */
                    :
                    case 0x3A/* : */
                    :
                    case 0x3C/* < */
                    :
                    case 0x3D/* = */
                    :
                    case 0x3E/* > */
                    :
                    case 0x40/* @ */
                    :
                    case 0x5B/* [ */
                    :
                    case 0x5C/* \ */
                    :
                    case 0x5D/* ] */
                    :
                    case 0x5E/* ^ */
                    :
                    case 0x5F/* _ */
                    :
                    case 0x60/* ` */
                    :
                    case 0x7B/* { */
                    :
                    case 0x7D/* } */
                    :
                    case 0x7E/* ~ */
                    :
                        return true;
                    default:
                        return false;
                }
            }

            module.exports = function text(state, silent) {
                var pos = state.pos;

                while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
                    pos++;
                }

                if (pos === state.pos) {
                    return false;
                }

                if (!silent) {
                    state.pending += state.src.slice(state.pos, pos);
                }

                state.pos = pos;

                return true;
            };

// Alternative implementation, for memory.
//
// It costs 10% of performance, but allows extend terminators list, if place it
// to `ParcerInline` property. Probably, will switch to it sometime, such
// flexibility required.

            /*
var TERMINATOR_RE = /[\n!#$%&*+\-:<=>@[\\\]^_`{}~]/;

module.exports = function text(state, silent) {
  var pos = state.pos,
      idx = state.src.slice(pos).search(TERMINATOR_RE);

  // first char is terminator -> empty text
  if (idx === 0) { return false; }

  // no terminator -> text till end of string
  if (idx < 0) {
    if (!silent) { state.pending += state.src.slice(pos); }
    state.pos = state.src.length;
    return true;
  }

  if (!silent) { state.pending += state.src.slice(pos, pos + idx); }

  state.pos += idx;

  return true;
};*/


            /***/
        }),

        /***/ 8622:
        /***/ ((module) => {

            "use strict";
// Token class


            /**
             * class Token
             **/

            /**
             * new Token(type, tag, nesting)
             *
             * Create new token and fill passed properties.
             **/
            function Token(type, tag, nesting) {
                /**
                 * Token#type -> String
                 *
                 * Type of the token (string, e.g. "paragraph_open")
                 **/
                this.type = type;

                /**
                 * Token#tag -> String
                 *
                 * html tag name, e.g. "p"
                 **/
                this.tag = tag;

                /**
                 * Token#attrs -> Array
                 *
                 * Html attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
                 **/
                this.attrs = null;

                /**
                 * Token#map -> Array
                 *
                 * Source map info. Format: `[ line_begin, line_end ]`
                 **/
                this.map = null;

                /**
                 * Token#nesting -> Number
                 *
                 * Level change (number in {-1, 0, 1} set), where:
                 *
                 * -  `1` means the tag is opening
                 * -  `0` means the tag is self-closing
                 * - `-1` means the tag is closing
                 **/
                this.nesting = nesting;

                /**
                 * Token#level -> Number
                 *
                 * nesting level, the same as `state.level`
                 **/
                this.level = 0;

                /**
                 * Token#children -> Array
                 *
                 * An array of child nodes (inline and img tokens)
                 **/
                this.children = null;

                /**
                 * Token#content -> String
                 *
                 * In a case of self-closing tag (code, html, fence, etc.),
                 * it has contents of this tag.
                 **/
                this.content = '';

                /**
                 * Token#markup -> String
                 *
                 * '*' or '_' for emphasis, fence string for fence, etc.
                 **/
                this.markup = '';

                /**
                 * Token#info -> String
                 *
                 * Additional information:
                 *
                 * - Info string for "fence" tokens
                 * - The value "auto" for autolink "link_open" and "link_close" tokens
                 * - The string value of the item marker for ordered-list "list_item_open" tokens
                 **/
                this.info = '';

                /**
                 * Token#meta -> Object
                 *
                 * A place for plugins to store an arbitrary data
                 **/
                this.meta = null;

                /**
                 * Token#block -> Boolean
                 *
                 * True for block-level tokens, false for inline tokens.
                 * Used in renderer to calculate line breaks
                 **/
                this.block = false;

                /**
                 * Token#hidden -> Boolean
                 *
                 * If it's true, ignore this element when rendering. Used for tight lists
                 * to hide paragraphs.
                 **/
                this.hidden = false;
            }


            /**
             * Token.attrIndex(name) -> Number
             *
             * Search attribute index by name.
             **/
            Token.prototype.attrIndex = function attrIndex(name) {
                var attrs, i, len;

                if (!this.attrs) {
                    return -1;
                }

                attrs = this.attrs;

                for (i = 0, len = attrs.length; i < len; i++) {
                    if (attrs[i][0] === name) {
                        return i;
                    }
                }
                return -1;
            };


            /**
             * Token.attrPush(attrData)
             *
             * Add `[ name, value ]` attribute to list. Init attrs if necessary
             **/
            Token.prototype.attrPush = function attrPush(attrData) {
                if (this.attrs) {
                    this.attrs.push(attrData);
                } else {
                    this.attrs = [attrData];
                }
            };


            /**
             * Token.attrSet(name, value)
             *
             * Set `name` attribute to `value`. Override old value if exists.
             **/
            Token.prototype.attrSet = function attrSet(name, value) {
                var idx = this.attrIndex(name),
                  attrData = [name, value];

                if (idx < 0) {
                    this.attrPush(attrData);
                } else {
                    this.attrs[idx] = attrData;
                }
            };


            /**
             * Token.attrGet(name)
             *
             * Get the value of attribute `name`, or null if it does not exist.
             **/
            Token.prototype.attrGet = function attrGet(name) {
                var idx = this.attrIndex(name), value = null;
                if (idx >= 0) {
                    value = this.attrs[idx][1];
                }
                return value;
            };


            /**
             * Token.attrJoin(name, value)
             *
             * Join value to existing attribute via space. Or create new attribute if not
             * exists. Useful to operate with token classes.
             **/
            Token.prototype.attrJoin = function attrJoin(name, value) {
                var idx = this.attrIndex(name);

                if (idx < 0) {
                    this.attrPush([name, value]);
                } else {
                    this.attrs[idx][1] = this.attrs[idx][1] + ' ' + value;
                }
            };


            module.exports = Token;


/***/ }),

        /***/ 6023:
        /***/ ((module) => {

            "use strict";


            /* eslint-disable no-bitwise */

            var decodeCache = {};

            function getDecodeCache(exclude) {
                var i, ch, cache = decodeCache[exclude];
                if (cache) {
                    return cache;
                }

                cache = decodeCache[exclude] = [];

                for (i = 0; i < 128; i++) {
                    ch = String.fromCharCode(i);
                    cache.push(ch);
                }

                for (i = 0; i < exclude.length; i++) {
                    ch = exclude.charCodeAt(i);
                    cache[ch] = '%' + ('0' + ch.toString(16).toUpperCase()).slice(-2);
                }

                return cache;
            }


// Decode percent-encoded string.
//
            function decode(string, exclude) {
                var cache;

                if (typeof exclude !== 'string') {
                    exclude = decode.defaultChars;
                }

                cache = getDecodeCache(exclude);

                return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
                    var i, l, b1, b2, b3, b4, chr,
                      result = '';

                    for (i = 0, l = seq.length; i < l; i += 3) {
                        b1 = parseInt(seq.slice(i + 1, i + 3), 16);

                        if (b1 < 0x80) {
                            result += cache[b1];
                            continue;
                        }

                        if ((b1 & 0xE0) === 0xC0 && (i + 3 < l)) {
                            // 110xxxxx 10xxxxxx
                            b2 = parseInt(seq.slice(i + 4, i + 6), 16);

                            if ((b2 & 0xC0) === 0x80) {
                                chr = ((b1 << 6) & 0x7C0) | (b2 & 0x3F);

                                if (chr < 0x80) {
                                    result += '\ufffd\ufffd';
                                } else {
                                    result += String.fromCharCode(chr);
                                }

                                i += 3;
                                continue;
                            }
                        }

                        if ((b1 & 0xF0) === 0xE0 && (i + 6 < l)) {
                            // 1110xxxx 10xxxxxx 10xxxxxx
                            b2 = parseInt(seq.slice(i + 4, i + 6), 16);
                            b3 = parseInt(seq.slice(i + 7, i + 9), 16);

                            if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
                                chr = ((b1 << 12) & 0xF000) | ((b2 << 6) & 0xFC0) | (b3 & 0x3F);

                                if (chr < 0x800 || (chr >= 0xD800 && chr <= 0xDFFF)) {
                                    result += '\ufffd\ufffd\ufffd';
                                } else {
                                    result += String.fromCharCode(chr);
                                }

                                i += 6;
                                continue;
                            }
                        }

                        if ((b1 & 0xF8) === 0xF0 && (i + 9 < l)) {
                            // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx
                            b2 = parseInt(seq.slice(i + 4, i + 6), 16);
                            b3 = parseInt(seq.slice(i + 7, i + 9), 16);
                            b4 = parseInt(seq.slice(i + 10, i + 12), 16);

                            if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80 && (b4 & 0xC0) === 0x80) {
                                chr = ((b1 << 18) & 0x1C0000) | ((b2 << 12) & 0x3F000) | ((b3 << 6) & 0xFC0) | (b4 & 0x3F);

                                if (chr < 0x10000 || chr > 0x10FFFF) {
                                    result += '\ufffd\ufffd\ufffd\ufffd';
                                } else {
                                    chr -= 0x10000;
                                    result += String.fromCharCode(0xD800 + (chr >> 10), 0xDC00 + (chr & 0x3FF));
                                }

                                i += 9;
                                continue;
                            }
                        }

                        result += '\ufffd';
                    }

                    return result;
                });
            }


            decode.defaultChars = ';/?:@&=+$,#';
            decode.componentChars = '';


            module.exports = decode;


            /***/
        }),

        /***/ 6756:
        /***/ ((module) => {

            "use strict";


            var encodeCache = {};


// Create a lookup array where anything but characters in `chars` string
// and alphanumeric chars is percent-encoded.
//
            function getEncodeCache(exclude) {
                var i, ch, cache = encodeCache[exclude];
                if (cache) {
                    return cache;
                }

                cache = encodeCache[exclude] = [];

                for (i = 0; i < 128; i++) {
                    ch = String.fromCharCode(i);

                    if (/^[0-9a-z]$/i.test(ch)) {
                        // always allow unencoded alphanumeric characters
                        cache.push(ch);
                    } else {
                        cache.push('%' + ('0' + i.toString(16).toUpperCase()).slice(-2));
                    }
                }

                for (i = 0; i < exclude.length; i++) {
                    cache[exclude.charCodeAt(i)] = exclude[i];
                }

                return cache;
            }


// Encode unsafe characters with percent-encoding, skipping already
// encoded sequences.
//
//  - string       - string to encode
//  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
//  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
//
            function encode(string, exclude, keepEscaped) {
                var i, l, code, nextCode, cache,
                  result = '';

                if (typeof exclude !== 'string') {
                    // encode(string, keepEscaped)
                    keepEscaped = exclude;
                    exclude = encode.defaultChars;
                }

                if (typeof keepEscaped === 'undefined') {
                    keepEscaped = true;
                }

                cache = getEncodeCache(exclude);

                for (i = 0, l = string.length; i < l; i++) {
                    code = string.charCodeAt(i);

                    if (keepEscaped && code === 0x25 /* % */ && i + 2 < l) {
                        if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
                            result += string.slice(i, i + 3);
                            i += 2;
                            continue;
                        }
                    }

                    if (code < 128) {
                        result += cache[code];
                        continue;
                    }

                    if (code >= 0xD800 && code <= 0xDFFF) {
                        if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
                            nextCode = string.charCodeAt(i + 1);
                            if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                                result += encodeURIComponent(string[i] + string[i + 1]);
                                i++;
                                continue;
                            }
                        }
                        result += '%EF%BF%BD';
                        continue;
                    }

                    result += encodeURIComponent(string[i]);
                }

                return result;
            }

            encode.defaultChars = ";/?:@&=+$,-_.!~*'()#";
            encode.componentChars = "-_.!~*'()";


            module.exports = encode;


            /***/
        }),

        /***/ 8612:
        /***/ ((module) => {

            "use strict";


            module.exports = function format(url) {
                var result = '';

                result += url.protocol || '';
                result += url.slashes ? '//' : '';
                result += url.auth ? url.auth + '@' : '';

                if (url.hostname && url.hostname.indexOf(':') !== -1) {
                    // ipv6 address
                    result += '[' + url.hostname + ']';
                } else {
                    result += url.hostname || '';
                }

                result += url.port ? ':' + url.port : '';
                result += url.pathname || '';
                result += url.search || '';
                result += url.hash || '';

                return result;
            };


            /***/
        }),

        /***/ 114:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            "use strict";


            module.exports.encode = __nccwpck_require__(6756);
            module.exports.decode = __nccwpck_require__(6023);
            module.exports.format = __nccwpck_require__(8612);
            module.exports.parse = __nccwpck_require__(8062);


            /***/
        }),

        /***/ 8062:
        /***/ ((module) => {

            "use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



//
// Changes from joyent/node:
//
// 1. No leading slash in paths,
//    e.g. in `url.parse('http://foo?bar')` pathname is ``, not `/`
//
// 2. Backslashes are not replaced with slashes,
//    so `http:\\example.org\` is treated like a relative path
//
// 3. Trailing colon is treated like a part of the path,
//    i.e. in `http://example.org:foo` pathname is `:foo`
//
// 4. Nothing is URL-encoded in the resulting object,
//    (in joyent/node some chars in auth and paths are encoded)
//
// 5. `url.parse()` does not have `parseQueryString` argument
//
// 6. Removed extraneous result properties: `host`, `path`, `query`, etc.,
//    which can be constructed using other parts of the url.
//


            function Url() {
                this.protocol = null;
                this.slashes = null;
                this.auth = null;
                this.port = null;
                this.hostname = null;
                this.hash = null;
                this.search = null;
                this.pathname = null;
            }

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
            var protocolPattern = /^([a-z0-9.+-]+:)/i,
              portPattern = /:[0-9]*$/,

              // Special case for a simple path URL
              simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

              // RFC 2396: characters reserved for delimiting URLs.
              // We actually just auto-escape these.
              delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

              // RFC 2396: characters not allowed for various reasons.
              unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

              // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
              autoEscape = ['\''].concat(unwise),
              // Characters that are never ever allowed in a hostname.
              // Note that any invalid chars are also handled, but these
              // are the ones that are *expected* to be seen, so we fast-path
              // them.
              nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
              hostEndingChars = ['/', '?', '#'],
              hostnameMaxLen = 255,
              hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
              hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
              // protocols that can allow "unsafe" and "unwise" chars.
              /* eslint-disable no-script-url */
              // protocols that never have a hostname.
              hostlessProtocol = {
                  'javascript': true,
                  'javascript:': true
              },
              // protocols that always contain a // bit.
              slashedProtocol = {
                  'http': true,
                  'https': true,
                  'ftp': true,
                  'gopher': true,
                  'file': true,
                  'http:': true,
                  'https:': true,
                  'ftp:': true,
                  'gopher:': true,
                  'file:': true
              };

            /* eslint-enable no-script-url */

            function urlParse(url, slashesDenoteHost) {
                if (url && url instanceof Url) {
                    return url;
                }

                var u = new Url();
                u.parse(url, slashesDenoteHost);
                return u;
            }

            Url.prototype.parse = function(url, slashesDenoteHost) {
                var i, l, lowerProto, hec, slashes,
                  rest = url;

                // trim before proceeding.
                // This is to support parse stuff like "  http://foo.com  \n"
                rest = rest.trim();

                if (!slashesDenoteHost && url.split('#').length === 1) {
                    // Try fast path regexp
                    var simplePath = simplePathPattern.exec(rest);
                    if (simplePath) {
                        this.pathname = simplePath[1];
                        if (simplePath[2]) {
                            this.search = simplePath[2];
                        }
                        return this;
                    }
                }

                var proto = protocolPattern.exec(rest);
                if (proto) {
                    proto = proto[0];
                    lowerProto = proto.toLowerCase();
                    this.protocol = proto;
                    rest = rest.substr(proto.length);
                }

                // figure out if it's got a host
                // user@server is *always* interpreted as a hostname, and url
                // resolution will treat //foo/bar as host=foo,path=bar because that's
                // how the browser resolves relative URLs.
                if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                    slashes = rest.substr(0, 2) === '//';
                    if (slashes && !(proto && hostlessProtocol[proto])) {
                        rest = rest.substr(2);
                        this.slashes = true;
                    }
                }

                if (!hostlessProtocol[proto] &&
                  (slashes || (proto && !slashedProtocol[proto]))) {

                    // there's a hostname.
                    // the first instance of /, ?, ;, or # ends the host.
                    //
                    // If there is an @ in the hostname, then non-host chars *are* allowed
                    // to the left of the last @ sign, unless some host-ending character
                    // comes *before* the @-sign.
                    // URLs are obnoxious.
                    //
                    // ex:
                    // http://a@b@c/ => user:a@b host:c
                    // http://a@b?@c => user:a host:c path:/?@c

                    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
                    // Review our test case against browsers more comprehensively.

                    // find the first instance of any hostEndingChars
                    var hostEnd = -1;
                    for (i = 0; i < hostEndingChars.length; i++) {
                        hec = rest.indexOf(hostEndingChars[i]);
                        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
                            hostEnd = hec;
                        }
                    }

                    // at this point, either we have an explicit point where the
                    // auth portion cannot go past, or the last @ char is the decider.
                    var auth, atSign;
                    if (hostEnd === -1) {
                        // atSign can be anywhere.
                        atSign = rest.lastIndexOf('@');
                    } else {
                        // atSign must be in auth portion.
                        // http://a@b/c@d => host:b auth:a path:/c@d
                        atSign = rest.lastIndexOf('@', hostEnd);
                    }

                    // Now we have a portion which is definitely the auth.
                    // Pull that off.
                    if (atSign !== -1) {
                        auth = rest.slice(0, atSign);
                        rest = rest.slice(atSign + 1);
                        this.auth = auth;
                    }

                    // the host is the remaining to the left of the first non-host char
                    hostEnd = -1;
                    for (i = 0; i < nonHostChars.length; i++) {
                        hec = rest.indexOf(nonHostChars[i]);
                        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
                            hostEnd = hec;
                        }
                    }
                    // if we still have not hit it, then the entire thing is a host.
                    if (hostEnd === -1) {
                        hostEnd = rest.length;
                    }

                    if (rest[hostEnd - 1] === ':') {
                        hostEnd--;
                    }
                    var host = rest.slice(0, hostEnd);
                    rest = rest.slice(hostEnd);

                    // pull out port.
                    this.parseHost(host);

                    // we've indicated that there is a hostname,
                    // so even if it's empty, it has to be present.
                    this.hostname = this.hostname || '';

                    // if hostname begins with [ and ends with ]
                    // assume that it's an IPv6 address.
                    var ipv6Hostname = this.hostname[0] === '[' &&
                      this.hostname[this.hostname.length - 1] === ']';

                    // validate a little.
                    if (!ipv6Hostname) {
                        var hostparts = this.hostname.split(/\./);
                        for (i = 0, l = hostparts.length; i < l; i++) {
                            var part = hostparts[i];
                            if (!part) {
                                continue;
                            }
                            if (!part.match(hostnamePartPattern)) {
                                var newpart = '';
                                for (var j = 0, k = part.length; j < k; j++) {
                                    if (part.charCodeAt(j) > 127) {
                                        // we replace non-ASCII char with a temporary placeholder
                                        // we need this to make sure size of hostname is not
                                        // broken by replacing non-ASCII by nothing
                                        newpart += 'x';
                                    } else {
                                        newpart += part[j];
                                    }
                                }
                                // we test again with ASCII char only
                                if (!newpart.match(hostnamePartPattern)) {
                                    var validParts = hostparts.slice(0, i);
                                    var notHost = hostparts.slice(i + 1);
                                    var bit = part.match(hostnamePartStart);
                                    if (bit) {
                                        validParts.push(bit[1]);
                                        notHost.unshift(bit[2]);
                                    }
                                    if (notHost.length) {
                                        rest = notHost.join('.') + rest;
                                    }
                                    this.hostname = validParts.join('.');
                                    break;
                                }
                            }
                        }
                    }

                    if (this.hostname.length > hostnameMaxLen) {
                        this.hostname = '';
                    }

                    // strip [ and ] from the hostname
                    // the host field still retains them, though
                    if (ipv6Hostname) {
                        this.hostname = this.hostname.substr(1, this.hostname.length - 2);
                    }
                }

                // chop off from the tail first.
                var hash = rest.indexOf('#');
                if (hash !== -1) {
                    // got a fragment string.
                    this.hash = rest.substr(hash);
                    rest = rest.slice(0, hash);
                }
                var qm = rest.indexOf('?');
                if (qm !== -1) {
                    this.search = rest.substr(qm);
                    rest = rest.slice(0, qm);
                }
                if (rest) {
                    this.pathname = rest;
                }
                if (slashedProtocol[lowerProto] &&
                  this.hostname && !this.pathname) {
                    this.pathname = '';
                }

                return this;
            };

            Url.prototype.parseHost = function(host) {
                var port = portPattern.exec(host);
                if (port) {
                    port = port[0];
                    if (port !== ':') {
                        this.port = port.substr(1);
                    }
                    host = host.substr(0, host.length - port.length);
                }
                if (host) {
                    this.hostname = host;
                }
            };

            module.exports = urlParse;


            /***/
        }),

        /***/ 3973:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            module.exports = minimatch
            minimatch.Minimatch = Minimatch

            var path = (function() {
                try {
                    return __nccwpck_require__(1017)
                } catch (e) {
                }
            }()) || {
                sep: '/'
            }
            minimatch.sep = path.sep

            var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
            var expand = __nccwpck_require__(3717)

            var plTypes = {
                '!': { open: '(?:(?!(?:', close: '))[^/]*?)' },
                '?': { open: '(?:', close: ')?' },
                '+': { open: '(?:', close: ')+' },
                '*': { open: '(?:', close: ')*' },
                '@': { open: '(?:', close: ')' }
            }

// any single thing other than /
// don't need to escape / when using new RegExp()
            var qmark = '[^/]'

// * => any number of characters
            var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
            var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
            var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
            var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
            function charSet(s) {
                return s.split('').reduce(function(set, c) {
                    set[c] = true
                    return set
                }, {})
            }

// normalizes slashes.
            var slashSplit = /\/+/

            minimatch.filter = filter

            function filter(pattern, options) {
                options = options || {}
                return function(p, i, list) {
                    return minimatch(p, pattern, options)
                }
            }

            function ext(a, b) {
                b = b || {}
                var t = {}
                Object.keys(a).forEach(function(k) {
                    t[k] = a[k]
                })
                Object.keys(b).forEach(function(k) {
                    t[k] = b[k]
                })
                return t
            }

            minimatch.defaults = function(def) {
                if (!def || typeof def !== 'object' || !Object.keys(def).length) {
                    return minimatch
                }

                var orig = minimatch

                var m = function minimatch(p, pattern, options) {
                    return orig(p, pattern, ext(def, options))
                }

                m.Minimatch = function Minimatch(pattern, options) {
                    return new orig.Minimatch(pattern, ext(def, options))
                }
                m.Minimatch.defaults = function defaults(options) {
                    return orig.defaults(ext(def, options)).Minimatch
                }

                m.filter = function filter(pattern, options) {
                    return orig.filter(pattern, ext(def, options))
                }

                m.defaults = function defaults(options) {
                    return orig.defaults(ext(def, options))
                }

                m.makeRe = function makeRe(pattern, options) {
                    return orig.makeRe(pattern, ext(def, options))
                }

                m.braceExpand = function braceExpand(pattern, options) {
                    return orig.braceExpand(pattern, ext(def, options))
                }

                m.match = function(list, pattern, options) {
                    return orig.match(list, pattern, ext(def, options))
                }

                return m
            }

            Minimatch.defaults = function(def) {
                return minimatch.defaults(def).Minimatch
            }

            function minimatch(p, pattern, options) {
                assertValidPattern(pattern)

                if (!options) options = {}

                // shortcut: comments match nothing.
                if (!options.nocomment && pattern.charAt(0) === '#') {
                    return false
                }

                return new Minimatch(pattern, options).match(p)
            }

            function Minimatch(pattern, options) {
                if (!(this instanceof Minimatch)) {
                    return new Minimatch(pattern, options)
                }

                assertValidPattern(pattern)

                if (!options) options = {}

                pattern = pattern.trim()

                // windows support: need to use /, not \
                if (!options.allowWindowsEscape && path.sep !== '/') {
                    pattern = pattern.split(path.sep).join('/')
                }

                this.options = options
                this.set = []
                this.pattern = pattern
                this.regexp = null
                this.negate = false
                this.comment = false
                this.empty = false
                this.partial = !!options.partial

                // make the set of regexps etc.
                this.make()
            }

            Minimatch.prototype.debug = function() {
            }

            Minimatch.prototype.make = make

            function make() {
                var pattern = this.pattern
                var options = this.options

                // empty patterns and comments match nothing.
                if (!options.nocomment && pattern.charAt(0) === '#') {
                    this.comment = true
                    return
                }
                if (!pattern) {
                    this.empty = true
                    return
                }

                // step 1: figure out negation, etc.
                this.parseNegate()

                // step 2: expand braces
                var set = this.globSet = this.braceExpand()

                if (options.debug) this.debug = function debug() {
                    console.error.apply(console, arguments)
                }

                this.debug(this.pattern, set)

                // step 3: now we have a set, so turn each one into a series of path-portion
                // matching patterns.
                // These will be regexps, except in the case of "**", which is
                // set to the GLOBSTAR object for globstar behavior,
                // and will not contain any / characters
                set = this.globParts = set.map(function(s) {
                    return s.split(slashSplit)
                })

                this.debug(this.pattern, set)

                // glob --> regexps
                set = set.map(function(s, si, set) {
                    return s.map(this.parse, this)
                }, this)

                this.debug(this.pattern, set)

                // filter out everything that didn't compile properly.
                set = set.filter(function(s) {
                    return s.indexOf(false) === -1
                })

                this.debug(this.pattern, set)

                this.set = set
            }

            Minimatch.prototype.parseNegate = parseNegate

            function parseNegate() {
                var pattern = this.pattern
                var negate = false
                var options = this.options
                var negateOffset = 0

                if (options.nonegate) return

                for (var i = 0, l = pattern.length
                  ; i < l && pattern.charAt(i) === '!'
                  ; i++) {
                    negate = !negate
                    negateOffset++
                }

                if (negateOffset) this.pattern = pattern.substr(negateOffset)
                this.negate = negate
            }

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
            minimatch.braceExpand = function(pattern, options) {
                return braceExpand(pattern, options)
            }

            Minimatch.prototype.braceExpand = braceExpand

            function braceExpand(pattern, options) {
                if (!options) {
                    if (this instanceof Minimatch) {
                        options = this.options
                    } else {
                        options = {}
                    }
                }

                pattern = typeof pattern === 'undefined'
                  ? this.pattern : pattern

                assertValidPattern(pattern)

                // Thanks to Yeting Li <https://github.com/yetingli> for
                // improving this regexp to avoid a ReDOS vulnerability.
                if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
                    // shortcut. no need to expand.
                    return [pattern]
                }

                return expand(pattern)
            }

            var MAX_PATTERN_LENGTH = 1024 * 64
            var assertValidPattern = function(pattern) {
                if (typeof pattern !== 'string') {
                    throw new TypeError('invalid pattern')
                }

                if (pattern.length > MAX_PATTERN_LENGTH) {
                    throw new TypeError('pattern is too long')
                }
            }

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
            Minimatch.prototype.parse = parse
            var SUBPARSE = {}

            function parse(pattern, isSub) {
                assertValidPattern(pattern)

                var options = this.options

                // shortcuts
                if (pattern === '**') {
                    if (!options.noglobstar)
                        return GLOBSTAR
                    else
                        pattern = '*'
                }
                if (pattern === '') return ''

                var re = ''
                var hasMagic = !!options.nocase
                var escaping = false
                // ? => one single character
                var patternListStack = []
                var negativeLists = []
                var stateChar
                var inClass = false
                var reClassStart = -1
                var classStart = -1
                // . and .. never match anything that doesn't start with .,
                // even when options.dot is set.
                var patternStart = pattern.charAt(0) === '.' ? '' // anything
                  // not (start or / followed by . or .. followed by / or end)
                  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
                    : '(?!\\.)'
                var self = this

                function clearStateChar() {
                    if (stateChar) {
                        // we had some state-tracking character
                        // that wasn't consumed by this pass.
                        switch (stateChar) {
                            case '*':
                                re += star
                                hasMagic = true
                                break
                            case '?':
                                re += qmark
                                hasMagic = true
                                break
                            default:
                                re += '\\' + stateChar
                                break
                        }
                        self.debug('clearStateChar %j %j', stateChar, re)
                        stateChar = false
                    }
                }

                for (var i = 0, len = pattern.length, c
                  ; (i < len) && (c = pattern.charAt(i))
                  ; i++) {
                    this.debug('%s\t%s %s %j', pattern, i, re, c)

                    // skip over any that are escaped.
                    if (escaping && reSpecials[c]) {
                        re += '\\' + c
                        escaping = false
                        continue
                    }

                    switch (c) {
                      /* istanbul ignore next */
                        case '/': {
                            // completely not allowed, even escaped.
                            // Should already be path-split by now.
                            return false
                        }

                        case '\\':
                            clearStateChar()
                            escaping = true
                            continue

                      // the various stateChar values
                      // for the "extglob" stuff.
                        case '?':
                        case '*':
                        case '+':
                        case '@':
                        case '!':
                            this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

                            // all of those are literals inside a class, except that
                            // the glob [!a] means [^a] in regexp
                            if (inClass) {
                                this.debug('  in class')
                                if (c === '!' && i === classStart + 1) c = '^'
                                re += c
                                continue
                            }

                            // if we already have a stateChar, then it means
                            // that there was something like ** or +? in there.
                            // Handle the stateChar, then proceed with this one.
                            self.debug('call clearStateChar %j', stateChar)
                            clearStateChar()
                            stateChar = c
                            // if extglob is disabled, then +(asdf|foo) isn't a thing.
                            // just clear the statechar *now*, rather than even diving into
                            // the patternList stuff.
                            if (options.noext) clearStateChar()
                            continue

                        case '(':
                            if (inClass) {
                                re += '('
                                continue
                            }

                            if (!stateChar) {
                                re += '\\('
                                continue
                            }

                            patternListStack.push({
                                type: stateChar,
                                start: i - 1,
                                reStart: re.length,
                                open: plTypes[stateChar].open,
                                close: plTypes[stateChar].close
                            })
                            // negation is (?:(?!js)[^/]*)
                            re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
                            this.debug('plType %j %j', stateChar, re)
                            stateChar = false
                            continue

                        case ')':
                            if (inClass || !patternListStack.length) {
                                re += '\\)'
                                continue
                            }

                            clearStateChar()
                            hasMagic = true
                            var pl = patternListStack.pop()
                            // negation is (?:(?!js)[^/]*)
                            // The others are (?:<pattern>)<type>
                            re += pl.close
                            if (pl.type === '!') {
                                negativeLists.push(pl)
                            }
                            pl.reEnd = re.length
                            continue

                        case '|':
                            if (inClass || !patternListStack.length || escaping) {
                                re += '\\|'
                                escaping = false
                                continue
                            }

                            clearStateChar()
                            re += '|'
                            continue

                      // these are mostly the same in regexp and glob
                        case '[':
                            // swallow any state-tracking char before the [
                            clearStateChar()

                            if (inClass) {
                                re += '\\' + c
                                continue
                            }

                            inClass = true
                            classStart = i
                            reClassStart = re.length
                            re += c
                            continue

                        case ']':
                            //  a right bracket shall lose its special
                            //  meaning and represent itself in
                            //  a bracket expression if it occurs
                            //  first in the list.  -- POSIX.2 2.8.3.2
                            if (i === classStart + 1 || !inClass) {
                                re += '\\' + c
                                escaping = false
                                continue
                            }

                            // handle the case where we left a class open.
                            // "[z-a]" is valid, equivalent to "\[z-a\]"
                            // split where the last [ was, make sure we don't have
                            // an invalid re. if so, re-walk the contents of the
                            // would-be class to re-translate any characters that
                            // were passed through as-is
                            // TODO: It would probably be faster to determine this
                            // without a try/catch and a new RegExp, but it's tricky
                            // to do safely.  For now, this is safe and works.
                            var cs = pattern.substring(classStart + 1, i)
                            try {
                                RegExp('[' + cs + ']')
                            } catch (er) {
                                // not a valid class!
                                var sp = this.parse(cs, SUBPARSE)
                                re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
                                hasMagic = hasMagic || sp[1]
                                inClass = false
                                continue
                            }

                            // finish up the class.
                            hasMagic = true
                            inClass = false
                            re += c
                            continue

                        default:
                            // swallow any state char that wasn't consumed
                            clearStateChar()

                            if (escaping) {
                                // no need
                                escaping = false
                            } else if (reSpecials[c]
                              && !(c === '^' && inClass)) {
                                re += '\\'
                            }

                            re += c

                    } // switch
                } // for

                // handle the case where we left a class open.
                // "[abc" is valid, equivalent to "\[abc"
                if (inClass) {
                    // split where the last [ was, and escape it
                    // this is a huge pita.  We now have to re-walk
                    // the contents of the would-be class to re-translate
                    // any characters that were passed through as-is
                    cs = pattern.substr(classStart + 1)
                    sp = this.parse(cs, SUBPARSE)
                    re = re.substr(0, reClassStart) + '\\[' + sp[0]
                    hasMagic = hasMagic || sp[1]
                }

                // handle the case where we had a +( thing at the *end*
                // of the pattern.
                // each pattern list stack adds 3 chars, and we need to go through
                // and escape any | chars that were passed through as-is for the regexp.
                // Go through and escape them, taking care not to double-escape any
                // | chars that were already escaped.
                for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
                    var tail = re.slice(pl.reStart + pl.open.length)
                    this.debug('setting tail', re, pl)
                    // maybe some even number of \, then maybe 1 \, followed by a |
                    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_, $1, $2) {
                        if (!$2) {
                            // the | isn't already escaped, so escape it.
                            $2 = '\\'
                        }

                        // need to escape all those slashes *again*, without escaping the
                        // one that we need for escaping the | character.  As it works out,
                        // escaping an even number of slashes can be done by simply repeating
                        // it exactly after itself.  That's why this trick works.
                        //
                        // I am sorry that you have to see this.
                        return $1 + $1 + $2 + '|'
                    })

                    this.debug('tail=%j\n   %s', tail, tail, pl, re)
                    var t = pl.type === '*' ? star
                      : pl.type === '?' ? qmark
                        : '\\' + pl.type

                    hasMagic = true
                    re = re.slice(0, pl.reStart) + t + '\\(' + tail
                }

                // handle trailing things that only matter at the very end.
                clearStateChar()
                if (escaping) {
                    // trailing \\
                    re += '\\\\'
                }

                // only need to apply the nodot start if the re starts with
                // something that could conceivably capture a dot
                var addPatternStart = false
                switch (re.charAt(0)) {
                    case '[':
                    case '.':
                    case '(':
                        addPatternStart = true
                }

                // Hack to work around lack of negative lookbehind in JS
                // A pattern like: *.!(x).!(y|z) needs to ensure that a name
                // like 'a.xyz.yz' doesn't match.  So, the first negative
                // lookahead, has to look ALL the way ahead, to the end of
                // the pattern.
                for (var n = negativeLists.length - 1; n > -1; n--) {
                    var nl = negativeLists[n]

                    var nlBefore = re.slice(0, nl.reStart)
                    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
                    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
                    var nlAfter = re.slice(nl.reEnd)

                    nlLast += nlAfter

                    // Handle nested stuff like *(*.js|!(*.json)), where open parens
                    // mean that we should *not* include the ) in the bit that is considered
                    // "after" the negated section.
                    var openParensBefore = nlBefore.split('(').length - 1
                    var cleanAfter = nlAfter
                    for (i = 0; i < openParensBefore; i++) {
                        cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
                    }
                    nlAfter = cleanAfter

                    var dollar = ''
                    if (nlAfter === '' && isSub !== SUBPARSE) {
                        dollar = '$'
                    }
                    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
                    re = newRe
                }

                // if the re is not "" at this point, then we need to make sure
                // it doesn't match against an empty path part.
                // Otherwise a/* will match a/, which it should not.
                if (re !== '' && hasMagic) {
                    re = '(?=.)' + re
                }

                if (addPatternStart) {
                    re = patternStart + re
                }

                // parsing just a piece of a larger pattern.
                if (isSub === SUBPARSE) {
                    return [re, hasMagic]
                }

                // skip the regexp for non-magical patterns
                // unescape anything in it, though, so that it'll be
                // an exact match against a file etc.
                if (!hasMagic) {
                    return globUnescape(pattern)
                }

                var flags = options.nocase ? 'i' : ''
                try {
                    var regExp = new RegExp('^' + re + '$', flags)
                } catch (er) /* istanbul ignore next - should be impossible */ {
                    // If it was an invalid regular expression, then it can't match
                    // anything.  This trick looks for a character after the end of
                    // the string, which is of course impossible, except in multi-line
                    // mode, but it's not a /m regex.
                    return new RegExp('$.')
                }

                regExp._glob = pattern
                regExp._src = re

                return regExp
            }

            minimatch.makeRe = function(pattern, options) {
                return new Minimatch(pattern, options || {}).makeRe()
            }

            Minimatch.prototype.makeRe = makeRe

            function makeRe() {
                if (this.regexp || this.regexp === false) return this.regexp

                // at this point, this.set is a 2d array of partial
                // pattern strings, or "**".
                //
                // It's better to use .match().  This function shouldn't
                // be used, really, but it's pretty convenient sometimes,
                // when you just want to work with a regex.
                var set = this.set

                if (!set.length) {
                    this.regexp = false
                    return this.regexp
                }
                var options = this.options

                var twoStar = options.noglobstar ? star
                  : options.dot ? twoStarDot
                    : twoStarNoDot
                var flags = options.nocase ? 'i' : ''

                var re = set.map(function(pattern) {
                    return pattern.map(function(p) {
                        return (p === GLOBSTAR) ? twoStar
                          : (typeof p === 'string') ? regExpEscape(p)
                            : p._src
                    }).join('\\\/')
                }).join('|')

                // must match entire pattern
                // ending in a * or ** will make it less strict.
                re = '^(?:' + re + ')$'

                // can match anything, as long as it's not this.
                if (this.negate) re = '^(?!' + re + ').*$'

                try {
                    this.regexp = new RegExp(re, flags)
                } catch (ex) /* istanbul ignore next - should be impossible */ {
                    this.regexp = false
                }
                return this.regexp
            }

            minimatch.match = function(list, pattern, options) {
                options = options || {}
                var mm = new Minimatch(pattern, options)
                list = list.filter(function(f) {
                    return mm.match(f)
                })
                if (mm.options.nonull && !list.length) {
                    list.push(pattern)
                }
                return list
            }

            Minimatch.prototype.match = function match(f, partial) {
                if (typeof partial === 'undefined') partial = this.partial
                this.debug('match', f, this.pattern)
                // short-circuit in the case of busted things.
                // comments, etc.
                if (this.comment) return false
                if (this.empty) return f === ''

                if (f === '/' && partial) return true

                var options = this.options

                // windows: need to use /, not \
                if (path.sep !== '/') {
                    f = f.split(path.sep).join('/')
                }

                // treat the test path as a set of pathparts.
                f = f.split(slashSplit)
                this.debug(this.pattern, 'split', f)

                // just ONE of the pattern sets in this.set needs to match
                // in order for it to be valid.  If negating, then just one
                // match means that we have failed.
                // Either way, return on the first hit.

                var set = this.set
                this.debug(this.pattern, 'set', set)

                // Find the basename of the path by looking for the last non-empty segment
                var filename
                var i
                for (i = f.length - 1; i >= 0; i--) {
                    filename = f[i]
                    if (filename) break
                }

                for (i = 0; i < set.length; i++) {
                    var pattern = set[i]
                    var file = f
                    if (options.matchBase && pattern.length === 1) {
                        file = [filename]
                    }
                    var hit = this.matchOne(file, pattern, partial)
                    if (hit) {
                        if (options.flipNegate) return true
                        return !this.negate
                    }
                }

                // didn't get any hits.  this is success if it's a negative
                // pattern, failure otherwise.
                if (options.flipNegate) return false
                return this.negate
            }

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
            Minimatch.prototype.matchOne = function(file, pattern, partial) {
                var options = this.options

                this.debug('matchOne',
                  { 'this': this, file: file, pattern: pattern })

                this.debug('matchOne', file.length, pattern.length)

                for (var fi = 0,
                       pi = 0,
                       fl = file.length,
                       pl = pattern.length
                  ; (fi < fl) && (pi < pl)
                  ; fi++, pi++) {
                    this.debug('matchOne loop')
                    var p = pattern[pi]
                    var f = file[fi]

                    this.debug(pattern, p, f)

                    // should be impossible.
                    // some invalid regexp stuff in the set.
                    /* istanbul ignore if */
                    if (p === false) return false

                    if (p === GLOBSTAR) {
                        this.debug('GLOBSTAR', [pattern, p, f])

                        // "**"
                        // a/**/b/**/c would match the following:
                        // a/b/x/y/z/c
                        // a/x/y/z/b/c
                        // a/b/x/b/x/c
                        // a/b/c
                        // To do this, take the rest of the pattern after
                        // the **, and see if it would match the file remainder.
                        // If so, return success.
                        // If not, the ** "swallows" a segment, and try again.
                        // This is recursively awful.
                        //
                        // a/**/b/**/c matching a/b/x/y/z/c
                        // - a matches a
                        // - doublestar
                        //   - matchOne(b/x/y/z/c, b/**/c)
                        //     - b matches b
                        //     - doublestar
                        //       - matchOne(x/y/z/c, c) -> no
                        //       - matchOne(y/z/c, c) -> no
                        //       - matchOne(z/c, c) -> no
                        //       - matchOne(c, c) yes, hit
                        var fr = fi
                        var pr = pi + 1
                        if (pr === pl) {
                            this.debug('** at the end')
                            // a ** at the end will just swallow the rest.
                            // We have found a match.
                            // however, it will not swallow /.x, unless
                            // options.dot is set.
                            // . and .. are *never* matched by **, for explosively
                            // exponential reasons.
                            for (; fi < fl; fi++) {
                                if (file[fi] === '.' || file[fi] === '..' ||
                                  (!options.dot && file[fi].charAt(0) === '.')) return false
                            }
                            return true
                        }

                        // ok, let's see if we can swallow whatever we can.
                        while (fr < fl) {
                            var swallowee = file[fr]

                            this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

                            // XXX remove this slice.  Just pass the start index.
                            if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
                                this.debug('globstar found match!', fr, fl, swallowee)
                                // found a match.
                                return true
                            } else {
                                // can't swallow "." or ".." ever.
                                // can only swallow ".foo" when explicitly asked.
                                if (swallowee === '.' || swallowee === '..' ||
                                  (!options.dot && swallowee.charAt(0) === '.')) {
                                    this.debug('dot detected!', file, fr, pattern, pr)
                                    break
                                }

                                // ** swallows a segment, and continue.
                                this.debug('globstar swallow a segment, and continue')
                                fr++
                            }
                        }

                        // no match was found.
                        // However, in partial mode, we can't say this is necessarily over.
                        // If there's more *pattern* left, then
                        /* istanbul ignore if */
                        if (partial) {
                            // ran out of file
                            this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
                            if (fr === fl) return true
                        }
                        return false
                    }

                    // something other than **
                    // non-magic patterns just have to match exactly
                    // patterns with magic have been turned into regexps.
                    var hit
                    if (typeof p === 'string') {
                        hit = f === p
                        this.debug('string match', p, f, hit)
                    } else {
                        hit = f.match(p)
                        this.debug('pattern match', p, f, hit)
                    }

                    if (!hit) return false
                }

                // Note: ending in / means that we'll get a final ""
                // at the end of the pattern.  This can only match a
                // corresponding "" at the end of the file.
                // If the file ends in /, then it can only match a
                // a pattern that ends in /, unless the pattern just
                // doesn't have any more for it. But, a/b/ should *not*
                // match "a/b/*", even though "" matches against the
                // [^/]*? pattern, except in partial mode, where it might
                // simply not be reached yet.
                // However, a/b/ should still satisfy a/*

                // now either we fell off the end of the pattern, or we're done.
                if (fi === fl && pi === pl) {
                    // ran out of pattern and filename at the same time.
                    // an exact hit!
                    return true
                } else if (fi === fl) {
                    // ran out of file, but still had pattern left.
                    // this is ok if we're doing the match as part of
                    // a glob fs traversal.
                    return partial
                } else /* istanbul ignore else */ if (pi === pl) {
                    // ran out of pattern, still have file left.
                    // this is only acceptable if we're on the very last
                    // empty segment of a file with a trailing slash.
                    // a/* should match a/b/
                    return (fi === fl - 1) && (file[fi] === '')
                }

                // should be unreachable.
                /* istanbul ignore next */
                throw new Error('wtf?')
            }

// replace stuff like \* with *
            function globUnescape(s) {
                return s.replace(/\\(.)/g, '$1')
            }

            function regExpEscape(s) {
                return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
            }


            /***/
        }),

        /***/ 1223:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var wrappy = __nccwpck_require__(2940)
            module.exports = wrappy(once)
            module.exports.strict = wrappy(onceStrict)

            once.proto = once(function() {
                Object.defineProperty(Function.prototype, 'once', {
                    value: function() {
                        return once(this)
                    },
                    configurable: true
                })

                Object.defineProperty(Function.prototype, 'onceStrict', {
                    value: function() {
                        return onceStrict(this)
                    },
                    configurable: true
                })
            })

            function once(fn) {
                var f = function() {
                    if (f.called) return f.value
                    f.called = true
                    return f.value = fn.apply(this, arguments)
                }
                f.called = false
                return f
            }

            function onceStrict(fn) {
                var f = function() {
                    if (f.called)
                        throw new Error(f.onceError)
                    f.called = true
                    return f.value = fn.apply(this, arguments)
                }
                var name = fn.name || 'Function wrapped with `once`'
                f.onceError = name + " shouldn't be called more than once"
                f.called = false
                return f
            }


            /***/
        }),

        /***/ 8714:
        /***/ ((module) => {

            "use strict";


            function posix(path) {
                return path.charAt(0) === '/';
            }

            function win32(path) {
                // https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
                var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
                var result = splitDeviceRe.exec(path);
                var device = result[1] || '';
                var isUnc = Boolean(device && device.charAt(1) !== ':');

                // UNC paths are always absolute
                return Boolean(result[2] || isUnc);
            }

            module.exports = process.platform === 'win32' ? win32 : posix;
            module.exports.posix = posix;
            module.exports.win32 = win32;


            /***/
        }),

        /***/ 5123:
        /***/ ((module) => {

            module.exports = [
                'cat',
                'cd',
                'chmod',
                'cp',
                'dirs',
                'echo',
                'exec',
                'find',
                'grep',
                'head',
                'ln',
                'ls',
                'mkdir',
                'mv',
                'pwd',
                'rm',
                'sed',
                'set',
                'sort',
                'tail',
                'tempdir',
                'test',
                'to',
                'toEnd',
                'touch',
                'uniq',
                'which',
            ];


            /***/
        }),

        /***/ 3516:
        /***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

//
// ShellJS
// Unix shell commands on top of Node's API
//
// Copyright (c) 2012 Artur Adib
// http://github.com/shelljs/shelljs
//

            function __ncc_wildcard$0(arg) {
                if (arg === "cat.js" || arg === "cat") return __nccwpck_require__(271);
                else if (arg === "cd.js" || arg === "cd") return __nccwpck_require__(2051);
                else if (arg === "chmod.js" || arg === "chmod") return __nccwpck_require__(4975);
                else if (arg === "common.js" || arg === "common") return __nccwpck_require__(3687);
                else if (arg === "cp.js" || arg === "cp") return __nccwpck_require__(4932);
                else if (arg === "dirs.js" || arg === "dirs") return __nccwpck_require__(1178);
                else if (arg === "echo.js" || arg === "echo") return __nccwpck_require__(243);
                else if (arg === "error.js" || arg === "error") return __nccwpck_require__(232);
                else if (arg === "exec-child.js" || arg === "exec-child") return __nccwpck_require__(9607);
                else if (arg === "exec.js" || arg === "exec") return __nccwpck_require__(896);
                else if (arg === "find.js" || arg === "find") return __nccwpck_require__(7838);
                else if (arg === "grep.js" || arg === "grep") return __nccwpck_require__(7417);
                else if (arg === "head.js" || arg === "head") return __nccwpck_require__(6613);
                else if (arg === "ln.js" || arg === "ln") return __nccwpck_require__(5787);
                else if (arg === "ls.js" || arg === "ls") return __nccwpck_require__(5561);
                else if (arg === "mkdir.js" || arg === "mkdir") return __nccwpck_require__(2695);
                else if (arg === "mv.js" || arg === "mv") return __nccwpck_require__(9849);
                else if (arg === "popd.js" || arg === "popd") return __nccwpck_require__(227);
                else if (arg === "pushd.js" || arg === "pushd") return __nccwpck_require__(4177);
                else if (arg === "pwd.js" || arg === "pwd") return __nccwpck_require__(8553);
                else if (arg === "rm.js" || arg === "rm") return __nccwpck_require__(2830);
                else if (arg === "sed.js" || arg === "sed") return __nccwpck_require__(5899);
                else if (arg === "set.js" || arg === "set") return __nccwpck_require__(1411);
                else if (arg === "sort.js" || arg === "sort") return __nccwpck_require__(2116);
                else if (arg === "tail.js" || arg === "tail") return __nccwpck_require__(2284);
                else if (arg === "tempdir.js" || arg === "tempdir") return __nccwpck_require__(6150);
                else if (arg === "test.js" || arg === "test") return __nccwpck_require__(9723);
                else if (arg === "to.js" || arg === "to") return __nccwpck_require__(1961);
                else if (arg === "toEnd.js" || arg === "toEnd") return __nccwpck_require__(3736);
                else if (arg === "touch.js" || arg === "touch") return __nccwpck_require__(8358);
                else if (arg === "uniq.js" || arg === "uniq") return __nccwpck_require__(7286);
                else if (arg === "which.js" || arg === "which") return __nccwpck_require__(4766);
            }

            var common = __nccwpck_require__(3687);

//@
//@ All commands run synchronously, unless otherwise stated.
//@ All commands accept standard bash globbing characters (`*`, `?`, etc.),
//@ compatible with the [node `glob` module](https://github.com/isaacs/node-glob).
//@
//@ For less-commonly used commands and features, please check out our [wiki
//@ page](https://github.com/shelljs/shelljs/wiki).
//@

// Include the docs for all the default commands
//@commands

// Load all default commands
            (__nccwpck_require__(5123).forEach)(function(command) {
                __ncc_wildcard$0(command);
            });

//@
//@ ### exit(code)
//@
//@ Exits the current process with the given exit `code`.
            exports.exit = process.exit;

//@include ./src/error
            exports.error = __nccwpck_require__(232);

//@include ./src/common
            exports.ShellString = common.ShellString;

//@
//@ ### env['VAR_NAME']
//@
//@ Object containing environment variables (both getter and setter). Shortcut
//@ to `process.env`.
            exports.env = process.env;

//@
//@ ### Pipes
//@
//@ Examples:
//@
//@ ```javascript
//@ grep('foo', 'file1.txt', 'file2.txt').sed(/o/g, 'a').to('output.txt');
//@ echo('files with o\'s in the name:\n' + ls().grep('o'));
//@ cat('test.js').exec('node'); // pipe to exec() call
//@ ```
//@
//@ Commands can send their output to another command in a pipe-like fashion.
//@ `sed`, `grep`, `cat`, `exec`, `to`, and `toEnd` can appear on the right-hand
//@ side of a pipe. Pipes can be chained.

//@
//@ ## Configuration
//@

            exports.config = common.config;

//@
//@ ### config.silent
//@
//@ Example:
//@
//@ ```javascript
//@ var sh = require('shelljs');
//@ var silentState = sh.config.silent; // save old silent state
//@ sh.config.silent = true;
//@ /* ... */
//@ sh.config.silent = silentState; // restore old silent state
//@ ```
//@
//@ Suppresses all command output if `true`, except for `echo()` calls.
//@ Default is `false`.

//@
//@ ### config.fatal
//@
//@ Example:
//@
//@ ```javascript
//@ require('shelljs/global');
//@ config.fatal = true; // or set('-e');
//@ cp('this_file_does_not_exist', '/dev/null'); // throws Error here
//@ /* more commands... */
//@ ```
//@
//@ If `true`, the script will throw a Javascript error when any shell.js
//@ command encounters an error. Default is `false`. This is analogous to
//@ Bash's `set -e`.

//@
//@ ### config.verbose
//@
//@ Example:
//@
//@ ```javascript
//@ config.verbose = true; // or set('-v');
//@ cd('dir/');
//@ rm('-rf', 'foo.txt', 'bar.txt');
//@ exec('echo hello');
//@ ```
//@
//@ Will print each command as follows:
//@
//@ ```
//@ cd dir/
//@ rm -rf foo.txt bar.txt
//@ exec echo hello
//@ ```

//@
//@ ### config.globOptions
//@
//@ Example:
//@
//@ ```javascript
//@ config.globOptions = {nodir: true};
//@ ```
//@
//@ Use this value for calls to `glob.sync()` instead of the default options.

//@
//@ ### config.reset()
//@
//@ Example:
//@
//@ ```javascript
//@ var shell = require('shelljs');
//@ // Make changes to shell.config, and do stuff...
//@ /* ... */
//@ shell.config.reset(); // reset to original state
//@ // Do more stuff, but with original settings
//@ /* ... */
//@ ```
//@
//@ Reset `shell.config` to the defaults:
//@
//@ ```javascript
//@ {
//@   fatal: false,
//@   globOptions: {},
//@   maxdepth: 255,
//@   noglob: false,
//@   silent: false,
//@   verbose: false,
//@ }
//@ ```


            /***/
        }),

        /***/ 271:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);

            common.register('cat', _cat, {
                canReceivePipe: true,
                cmdOptions: {
                    'n': 'number',
                },
            });

//@
//@ ### cat([options,] file [, file ...])
//@ ### cat([options,] file_array)
//@
//@ Available options:
//@
//@ + `-n`: number all output lines
//@
//@ Examples:
//@
//@ ```javascript
//@ var str = cat('file*.txt');
//@ var str = cat('file1', 'file2');
//@ var str = cat(['file1', 'file2']); // same as above
//@ ```
//@
//@ Returns a string containing the given file, or a concatenated string
//@ containing the files if more than one file is given (a new line character is
//@ introduced between each file).
            function _cat(options, files) {
                var cat = common.readFromPipe();

                if (!files && !cat) common.error('no paths given');

                files = [].slice.call(arguments, 1);

                files.forEach(function(file) {
                    if (!fs.existsSync(file)) {
                        common.error('no such file or directory: ' + file);
                    } else if (common.statFollowLinks(file).isDirectory()) {
                        common.error(file + ': Is a directory');
                    }

                    cat += fs.readFileSync(file, 'utf8');
                });

                if (options.number) {
                    cat = addNumbers(cat);
                }

                return cat;
            }

            module.exports = _cat;

            function addNumbers(cat) {
                var lines = cat.split('\n');
                var lastLine = lines.pop();

                lines = lines.map(function(line, i) {
                    return numberedLine(i + 1, line);
                });

                if (lastLine.length) {
                    lastLine = numberedLine(lines.length + 1, lastLine);
                }
                lines.push(lastLine);

                return lines.join('\n');
            }

            function numberedLine(n, line) {
                // GNU cat use six pad start number + tab. See http://lingrok.org/xref/coreutils/src/cat.c#57
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
                var number = ('     ' + n).slice(-6) + '\t';
                return number + line;
            }


            /***/
        }),

        /***/ 2051:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var os = __nccwpck_require__(2037);
            var common = __nccwpck_require__(3687);

            common.register('cd', _cd, {});

//@
//@ ### cd([dir])
//@
//@ Changes to directory `dir` for the duration of the script. Changes to home
//@ directory if no argument is supplied.
            function _cd(options, dir) {
                if (!dir) dir = os.homedir();

                if (dir === '-') {
                    if (!process.env.OLDPWD) {
                        common.error('could not find previous directory');
                    } else {
                        dir = process.env.OLDPWD;
                    }
                }

                try {
                    var curDir = process.cwd();
                    process.chdir(dir);
                    process.env.OLDPWD = curDir;
                } catch (e) {
                    // something went wrong, let's figure out the error
                    var err;
                    try {
                        common.statFollowLinks(dir); // if this succeeds, it must be some sort of file
                        err = 'not a directory: ' + dir;
                    } catch (e2) {
                        err = 'no such file or directory: ' + dir;
                    }
                    if (err) common.error(err);
                }
                return '';
            }

            module.exports = _cd;


            /***/
        }),

        /***/ 4975:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);
            var path = __nccwpck_require__(1017);

            var PERMS = (function(base) {
                return {
                    OTHER_EXEC: base.EXEC,
                    OTHER_WRITE: base.WRITE,
                    OTHER_READ: base.READ,

                    GROUP_EXEC: base.EXEC << 3,
                    GROUP_WRITE: base.WRITE << 3,
                    GROUP_READ: base.READ << 3,

                    OWNER_EXEC: base.EXEC << 6,
                    OWNER_WRITE: base.WRITE << 6,
                    OWNER_READ: base.READ << 6,

                    // Literal octal numbers are apparently not allowed in "strict" javascript.
                    STICKY: parseInt('01000', 8),
                    SETGID: parseInt('02000', 8),
                    SETUID: parseInt('04000', 8),

                    TYPE_MASK: parseInt('0770000', 8),
                };
            }({
                EXEC: 1,
                WRITE: 2,
                READ: 4,
            }));

            common.register('chmod', _chmod, {});

//@
//@ ### chmod([options,] octal_mode || octal_string, file)
//@ ### chmod([options,] symbolic_mode, file)
//@
//@ Available options:
//@
//@ + `-v`: output a diagnostic for every file processed//@
//@ + `-c`: like verbose, but report only when a change is made//@
//@ + `-R`: change files and directories recursively//@
//@
//@ Examples:
//@
//@ ```javascript
//@ chmod(755, '/Users/brandon');
//@ chmod('755', '/Users/brandon'); // same as above
//@ chmod('u+x', '/Users/brandon');
//@ chmod('-R', 'a-w', '/Users/brandon');
//@ ```
//@
//@ Alters the permissions of a file or directory by either specifying the
//@ absolute permissions in octal form or expressing the changes in symbols.
//@ This command tries to mimic the POSIX behavior as much as possible.
//@ Notable exceptions:
//@
//@ + In symbolic modes, `a-r` and `-r` are identical.  No consideration is
//@   given to the `umask`.
//@ + There is no "quiet" option, since default behavior is to run silent.
            function _chmod(options, mode, filePattern) {
                if (!filePattern) {
                    if (options.length > 0 && options.charAt(0) === '-') {
                        // Special case where the specified file permissions started with - to subtract perms, which
                        // get picked up by the option parser as command flags.
                        // If we are down by one argument and options starts with -, shift everything over.
                        [].unshift.call(arguments, '');
                    } else {
                        common.error('You must specify a file.');
                    }
                }

                options = common.parseOptions(options, {
                    'R': 'recursive',
                    'c': 'changes',
                    'v': 'verbose',
                });

                filePattern = [].slice.call(arguments, 2);

                var files;

                // TODO: replace this with a call to common.expand()
                if (options.recursive) {
                    files = [];
                    filePattern.forEach(function addFile(expandedFile) {
                        var stat = common.statNoFollowLinks(expandedFile);

                        if (!stat.isSymbolicLink()) {
                            files.push(expandedFile);

                            if (stat.isDirectory()) {  // intentionally does not follow symlinks.
                                fs.readdirSync(expandedFile).forEach(function(child) {
                                    addFile(expandedFile + '/' + child);
                                });
                            }
                        }
                    });
                } else {
                    files = filePattern;
                }

                files.forEach(function innerChmod(file) {
                    file = path.resolve(file);
                    if (!fs.existsSync(file)) {
                        common.error('File not found: ' + file);
                    }

                    // When recursing, don't follow symlinks.
                    if (options.recursive && common.statNoFollowLinks(file).isSymbolicLink()) {
                        return;
                    }

                    var stat = common.statFollowLinks(file);
                    var isDir = stat.isDirectory();
                    var perms = stat.mode;
                    var type = perms & PERMS.TYPE_MASK;

                    var newPerms = perms;

                    if (isNaN(parseInt(mode, 8))) {
                        // parse options
                        mode.split(',').forEach(function(symbolicMode) {
                            var pattern = /([ugoa]*)([=\+-])([rwxXst]*)/i;
                            var matches = pattern.exec(symbolicMode);

                            if (matches) {
                                var applyTo = matches[1];
                                var operator = matches[2];
                                var change = matches[3];

                                var changeOwner = applyTo.indexOf('u') !== -1 || applyTo === 'a' || applyTo === '';
                                var changeGroup = applyTo.indexOf('g') !== -1 || applyTo === 'a' || applyTo === '';
                                var changeOther = applyTo.indexOf('o') !== -1 || applyTo === 'a' || applyTo === '';

                                var changeRead = change.indexOf('r') !== -1;
                                var changeWrite = change.indexOf('w') !== -1;
                                var changeExec = change.indexOf('x') !== -1;
                                var changeExecDir = change.indexOf('X') !== -1;
                                var changeSticky = change.indexOf('t') !== -1;
                                var changeSetuid = change.indexOf('s') !== -1;

                                if (changeExecDir && isDir) {
                                    changeExec = true;
                                }

                                var mask = 0;
                                if (changeOwner) {
                                    mask |= (changeRead ? PERMS.OWNER_READ : 0) + (changeWrite ? PERMS.OWNER_WRITE : 0) + (changeExec ? PERMS.OWNER_EXEC : 0) + (changeSetuid ? PERMS.SETUID : 0);
                                }
                                if (changeGroup) {
                                    mask |= (changeRead ? PERMS.GROUP_READ : 0) + (changeWrite ? PERMS.GROUP_WRITE : 0) + (changeExec ? PERMS.GROUP_EXEC : 0) + (changeSetuid ? PERMS.SETGID : 0);
                                }
                                if (changeOther) {
                                    mask |= (changeRead ? PERMS.OTHER_READ : 0) + (changeWrite ? PERMS.OTHER_WRITE : 0) + (changeExec ? PERMS.OTHER_EXEC : 0);
                                }

                                // Sticky bit is special - it's not tied to user, group or other.
                                if (changeSticky) {
                                    mask |= PERMS.STICKY;
                                }

                                switch (operator) {
                                    case '+':
                                        newPerms |= mask;
                                        break;

                                    case '-':
                                        newPerms &= ~mask;
                                        break;

                                    case '=':
                                        newPerms = type + mask;

                                        // According to POSIX, when using = to explicitly set the
                                        // permissions, setuid and setgid can never be cleared.
                                        if (common.statFollowLinks(file).isDirectory()) {
                                            newPerms |= (PERMS.SETUID + PERMS.SETGID) & perms;
                                        }
                                        break;
                                    default:
                                        common.error('Could not recognize operator: `' + operator + '`');
                                }

                                if (options.verbose) {
                                    console.log(file + ' -> ' + newPerms.toString(8));
                                }

                                if (perms !== newPerms) {
                                    if (!options.verbose && options.changes) {
                                        console.log(file + ' -> ' + newPerms.toString(8));
                                    }
                                    fs.chmodSync(file, newPerms);
                                    perms = newPerms; // for the next round of changes!
                                }
                            } else {
                                common.error('Invalid symbolic mode change: ' + symbolicMode);
                            }
                        });
                    } else {
                        // they gave us a full number
                        newPerms = type + parseInt(mode, 8);

                        // POSIX rules are that setuid and setgid can only be added using numeric
                        // form, but not cleared.
                        if (common.statFollowLinks(file).isDirectory()) {
                            newPerms |= (PERMS.SETUID + PERMS.SETGID) & perms;
                        }

                        fs.chmodSync(file, newPerms);
                    }
                });
                return '';
            }

            module.exports = _chmod;


            /***/
        }),

        /***/ 3687:
        /***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

            "use strict";
// Ignore warning about 'new String()'
            /* eslint no-new-wrappers: 0 */


            var os = __nccwpck_require__(2037);
            var fs = __nccwpck_require__(7147);
            var glob = __nccwpck_require__(1957);
            var shell = __nccwpck_require__(3516);

            var shellMethods = Object.create(shell);

            exports.extend = Object.assign;

// Check if we're running under electron
            var isElectron = Boolean(process.versions.electron);

// Module globals (assume no execPath by default)
            var DEFAULT_CONFIG = {
                fatal: false,
                globOptions: {},
                maxdepth: 255,
                noglob: false,
                silent: false,
                verbose: false,
                execPath: null,
                bufLength: 64 * 1024, // 64KB
            };

            var config = {
                reset: function() {
                    Object.assign(this, DEFAULT_CONFIG);
                    if (!isElectron) {
                        this.execPath = process.execPath;
                    }
                },
                resetForTesting: function() {
                    this.reset();
                    this.silent = true;
                },
            };

            config.reset();
            exports.config = config;

// Note: commands should generally consider these as read-only values.
            var state = {
                error: null,
                errorCode: 0,
                currentCmd: 'shell.js',
            };
            exports.state = state;

            delete process.env.OLDPWD; // initially, there's no previous directory

// Reliably test if something is any sort of javascript object
            function isObject(a) {
                return typeof a === 'object' && a !== null;
            }

            exports.isObject = isObject;

            function log() {
                /* istanbul ignore next */
                if (!config.silent) {
                    console.error.apply(console, arguments);
                }
            }

            exports.log = log;

// Converts strings to be equivalent across all platforms. Primarily responsible
// for making sure we use '/' instead of '\' as path separators, but this may be
// expanded in the future if necessary
            function convertErrorOutput(msg) {
                if (typeof msg !== 'string') {
                    throw new TypeError('input must be a string');
                }
                return msg.replace(/\\/g, '/');
            }

            exports.convertErrorOutput = convertErrorOutput;

// Shows error message. Throws if config.fatal is true
            function error(msg, _code, options) {
                // Validate input
                if (typeof msg !== 'string') throw new Error('msg must be a string');

                var DEFAULT_OPTIONS = {
                    continue: false,
                    code: 1,
                    prefix: state.currentCmd + ': ',
                    silent: false,
                };

                if (typeof _code === 'number' && isObject(options)) {
                    options.code = _code;
                } else if (isObject(_code)) { // no 'code'
                    options = _code;
                } else if (typeof _code === 'number') { // no 'options'
                    options = { code: _code };
                } else if (typeof _code !== 'number') { // only 'msg'
                    options = {};
                }
                options = Object.assign({}, DEFAULT_OPTIONS, options);

                if (!state.errorCode) state.errorCode = options.code;

                var logEntry = convertErrorOutput(options.prefix + msg);
                state.error = state.error ? state.error + '\n' : '';
                state.error += logEntry;

                // Throw an error, or log the entry
                if (config.fatal) throw new Error(logEntry);
                if (msg.length > 0 && !options.silent) log(logEntry);

                if (!options.continue) {
                    throw {
                        msg: 'earlyExit',
                        retValue: (new ShellString('', state.error, state.errorCode)),
                    };
                }
            }

            exports.error = error;

//@
//@ ### ShellString(str)
//@
//@ Examples:
//@
//@ ```javascript
//@ var foo = ShellString('hello world');
//@ ```
//@
//@ Turns a regular string into a string-like object similar to what each
//@ command returns. This has special methods, like `.to()` and `.toEnd()`.
            function ShellString(stdout, stderr, code) {
                var that;
                if (stdout instanceof Array) {
                    that = stdout;
                    that.stdout = stdout.join('\n');
                    if (stdout.length > 0) that.stdout += '\n';
                } else {
                    that = new String(stdout);
                    that.stdout = stdout;
                }
                that.stderr = stderr;
                that.code = code;
                // A list of all commands that can appear on the right-hand side of a pipe
                // (populated by calls to common.wrap())
                pipeMethods.forEach(function(cmd) {
                    that[cmd] = shellMethods[cmd].bind(that);
                });
                return that;
            }

            exports.ShellString = ShellString;

// Returns {'alice': true, 'bob': false} when passed a string and dictionary as follows:
//   parseOptions('-a', {'a':'alice', 'b':'bob'});
// Returns {'reference': 'string-value', 'bob': false} when passed two dictionaries of the form:
//   parseOptions({'-r': 'string-value'}, {'r':'reference', 'b':'bob'});
// Throws an error when passed a string that does not start with '-':
//   parseOptions('a', {'a':'alice'}); // throws
            function parseOptions(opt, map, errorOptions) {
                // Validate input
                if (typeof opt !== 'string' && !isObject(opt)) {
                    throw new Error('options must be strings or key-value pairs');
                } else if (!isObject(map)) {
                    throw new Error('parseOptions() internal error: map must be an object');
                } else if (errorOptions && !isObject(errorOptions)) {
                    throw new Error('parseOptions() internal error: errorOptions must be object');
                }

                if (opt === '--') {
                    // This means there are no options.
                    return {};
                }

                // All options are false by default
                var options = {};
                Object.keys(map).forEach(function(letter) {
                    var optName = map[letter];
                    if (optName[0] !== '!') {
                        options[optName] = false;
                    }
                });

                if (opt === '') return options; // defaults

                if (typeof opt === 'string') {
                    if (opt[0] !== '-') {
                        throw new Error("Options string must start with a '-'");
                    }

                    // e.g. chars = ['R', 'f']
                    var chars = opt.slice(1).split('');

                    chars.forEach(function(c) {
                        if (c in map) {
                            var optionName = map[c];
                            if (optionName[0] === '!') {
                                options[optionName.slice(1)] = false;
                            } else {
                                options[optionName] = true;
                            }
                        } else {
                            error('option not recognized: ' + c, errorOptions || {});
                        }
                    });
                } else { // opt is an Object
                    Object.keys(opt).forEach(function(key) {
                        // key is a string of the form '-r', '-d', etc.
                        var c = key[1];
                        if (c in map) {
                            var optionName = map[c];
                            options[optionName] = opt[key]; // assign the given value
                        } else {
                            error('option not recognized: ' + c, errorOptions || {});
                        }
                    });
                }
                return options;
            }

            exports.parseOptions = parseOptions;

// Expands wildcards with matching (ie. existing) file names.
// For example:
//   expand(['file*.js']) = ['file1.js', 'file2.js', ...]
//   (if the files 'file1.js', 'file2.js', etc, exist in the current dir)
            function expand(list) {
                if (!Array.isArray(list)) {
                    throw new TypeError('must be an array');
                }
                var expanded = [];
                list.forEach(function(listEl) {
                    // Don't expand non-strings
                    if (typeof listEl !== 'string') {
                        expanded.push(listEl);
                    } else {
                        var ret;
                        try {
                            ret = glob.sync(listEl, config.globOptions);
                            // if nothing matched, interpret the string literally
                            ret = ret.length > 0 ? ret : [listEl];
                        } catch (e) {
                            // if glob fails, interpret the string literally
                            ret = [listEl];
                        }
                        expanded = expanded.concat(ret);
                    }
                });
                return expanded;
            }

            exports.expand = expand;

// Normalizes Buffer creation, using Buffer.alloc if possible.
// Also provides a good default buffer length for most use cases.
            var buffer = typeof Buffer.alloc === 'function' ?
              function(len) {
                  return Buffer.alloc(len || config.bufLength);
              } :
              function(len) {
                  return new Buffer(len || config.bufLength);
              };
            exports.buffer = buffer;

// Normalizes _unlinkSync() across platforms to match Unix behavior, i.e.
// file can be unlinked even if it's read-only, see https://github.com/joyent/node/issues/3006
            function unlinkSync(file) {
                try {
                    fs.unlinkSync(file);
                } catch (e) {
                    // Try to override file permission
                    /* istanbul ignore next */
                    if (e.code === 'EPERM') {
                        fs.chmodSync(file, '0666');
                        fs.unlinkSync(file);
                    } else {
                        throw e;
                    }
                }
            }

            exports.unlinkSync = unlinkSync;

// wrappers around common.statFollowLinks and common.statNoFollowLinks that clarify intent
// and improve readability
            function statFollowLinks() {
                return fs.statSync.apply(fs, arguments);
            }

            exports.statFollowLinks = statFollowLinks;

            function statNoFollowLinks() {
                return fs.lstatSync.apply(fs, arguments);
            }

            exports.statNoFollowLinks = statNoFollowLinks;

// e.g. 'shelljs_a5f185d0443ca...'
            function randomFileName() {
                function randomHash(count) {
                    if (count === 1) {
                        return parseInt(16 * Math.random(), 10).toString(16);
                    }
                    var hash = '';
                    for (var i = 0; i < count; i++) {
                        hash += randomHash(1);
                    }
                    return hash;
                }

                return 'shelljs_' + randomHash(20);
            }

            exports.randomFileName = randomFileName;

// Common wrapper for all Unix-like commands that performs glob expansion,
// command-logging, and other nice things
            function wrap(cmd, fn, options) {
                options = options || {};
                return function() {
                    var retValue = null;

                    state.currentCmd = cmd;
                    state.error = null;
                    state.errorCode = 0;

                    try {
                        var args = [].slice.call(arguments, 0);

                        // Log the command to stderr, if appropriate
                        if (config.verbose) {
                            console.error.apply(console, [cmd].concat(args));
                        }

                        // If this is coming from a pipe, let's set the pipedValue (otherwise, set
                        // it to the empty string)
                        state.pipedValue = (this && typeof this.stdout === 'string') ? this.stdout : '';

                        if (options.unix === false) { // this branch is for exec()
                            retValue = fn.apply(this, args);
                        } else { // and this branch is for everything else
                            if (isObject(args[0]) && args[0].constructor.name === 'Object') {
                                // a no-op, allowing the syntax `touch({'-r': file}, ...)`
                            } else if (args.length === 0 || typeof args[0] !== 'string' || args[0].length <= 1 || args[0][0] !== '-') {
                                args.unshift(''); // only add dummy option if '-option' not already present
                            }

                            // flatten out arrays that are arguments, to make the syntax:
                            //    `cp([file1, file2, file3], dest);`
                            // equivalent to:
                            //    `cp(file1, file2, file3, dest);`
                            args = args.reduce(function(accum, cur) {
                                if (Array.isArray(cur)) {
                                    return accum.concat(cur);
                                }
                                accum.push(cur);
                                return accum;
                            }, []);

                            // Convert ShellStrings (basically just String objects) to regular strings
                            args = args.map(function(arg) {
                                if (isObject(arg) && arg.constructor.name === 'String') {
                                    return arg.toString();
                                }
                                return arg;
                            });

                            // Expand the '~' if appropriate
                            var homeDir = os.homedir();
                            args = args.map(function(arg) {
                                if (typeof arg === 'string' && arg.slice(0, 2) === '~/' || arg === '~') {
                                    return arg.replace(/^~/, homeDir);
                                }
                                return arg;
                            });

                            // Perform glob-expansion on all arguments after globStart, but preserve
                            // the arguments before it (like regexes for sed and grep)
                            if (!config.noglob && options.allowGlobbing === true) {
                                args = args.slice(0, options.globStart).concat(expand(args.slice(options.globStart)));
                            }

                            try {
                                // parse options if options are provided
                                if (isObject(options.cmdOptions)) {
                                    args[0] = parseOptions(args[0], options.cmdOptions);
                                }

                                retValue = fn.apply(this, args);
                            } catch (e) {
                                /* istanbul ignore else */
                                if (e.msg === 'earlyExit') {
                                    retValue = e.retValue;
                                } else {
                                    throw e; // this is probably a bug that should be thrown up the call stack
                                }
                            }
                        }
                    } catch (e) {
                        /* istanbul ignore next */
                        if (!state.error) {
                            // If state.error hasn't been set it's an error thrown by Node, not us - probably a bug...
                            e.name = 'ShellJSInternalError';
                            throw e;
                        }
                        if (config.fatal) throw e;
                    }

                    if (options.wrapOutput &&
                      (typeof retValue === 'string' || Array.isArray(retValue))) {
                        retValue = new ShellString(retValue, state.error, state.errorCode);
                    }

                    state.currentCmd = 'shell.js';
                    return retValue;
                };
            } // wrap
            exports.wrap = wrap;

// This returns all the input that is piped into the current command (or the
// empty string, if this isn't on the right-hand side of a pipe
            function _readFromPipe() {
                return state.pipedValue;
            }

            exports.readFromPipe = _readFromPipe;

            var DEFAULT_WRAP_OPTIONS = {
                allowGlobbing: true,
                canReceivePipe: false,
                cmdOptions: null,
                globStart: 1,
                pipeOnly: false,
                wrapOutput: true,
                unix: true,
            };

// This is populated during plugin registration
            var pipeMethods = [];

// Register a new ShellJS command
            function _register(name, implementation, wrapOptions) {
                wrapOptions = wrapOptions || {};

                // Validate options
                Object.keys(wrapOptions).forEach(function(option) {
                    if (!DEFAULT_WRAP_OPTIONS.hasOwnProperty(option)) {
                        throw new Error("Unknown option '" + option + "'");
                    }
                    if (typeof wrapOptions[option] !== typeof DEFAULT_WRAP_OPTIONS[option]) {
                        throw new TypeError("Unsupported type '" + typeof wrapOptions[option] +
                          "' for option '" + option + "'");
                    }
                });

                // If an option isn't specified, use the default
                wrapOptions = Object.assign({}, DEFAULT_WRAP_OPTIONS, wrapOptions);

                if (shell.hasOwnProperty(name)) {
                    throw new Error('Command `' + name + '` already exists');
                }

                if (wrapOptions.pipeOnly) {
                    wrapOptions.canReceivePipe = true;
                    shellMethods[name] = wrap(name, implementation, wrapOptions);
                } else {
                    shell[name] = wrap(name, implementation, wrapOptions);
                }

                if (wrapOptions.canReceivePipe) {
                    pipeMethods.push(name);
                }
            }

            exports.register = _register;


            /***/
        }),

        /***/ 4932:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var fs = __nccwpck_require__(7147);
            var path = __nccwpck_require__(1017);
            var common = __nccwpck_require__(3687);

            common.register('cp', _cp, {
                cmdOptions: {
                    'f': '!no_force',
                    'n': 'no_force',
                    'u': 'update',
                    'R': 'recursive',
                    'r': 'recursive',
                    'L': 'followsymlink',
                    'P': 'noFollowsymlink',
                },
                wrapOutput: false,
            });

// Buffered file copy, synchronous
// (Using readFileSync() + writeFileSync() could easily cause a memory overflow
//  with large files)
            function copyFileSync(srcFile, destFile, options) {
                if (!fs.existsSync(srcFile)) {
                    common.error('copyFileSync: no such file or directory: ' + srcFile);
                }

                var isWindows = process.platform === 'win32';

                // Check the mtimes of the files if the '-u' flag is provided
                try {
                    if (options.update && common.statFollowLinks(srcFile).mtime < fs.statSync(destFile).mtime) {
                        return;
                    }
                } catch (e) {
                    // If we're here, destFile probably doesn't exist, so just do a normal copy
                }

                if (common.statNoFollowLinks(srcFile).isSymbolicLink() && !options.followsymlink) {
                    try {
                        common.statNoFollowLinks(destFile);
                        common.unlinkSync(destFile); // re-link it
                    } catch (e) {
                        // it doesn't exist, so no work needs to be done
                    }

                    var symlinkFull = fs.readlinkSync(srcFile);
                    fs.symlinkSync(symlinkFull, destFile, isWindows ? 'junction' : null);
                } else {
                    var buf = common.buffer();
                    var bufLength = buf.length;
                    var bytesRead = bufLength;
                    var pos = 0;
                    var fdr = null;
                    var fdw = null;

                    try {
                        fdr = fs.openSync(srcFile, 'r');
                    } catch (e) {
                        /* istanbul ignore next */
                        common.error('copyFileSync: could not read src file (' + srcFile + ')');
                    }

                    try {
                        fdw = fs.openSync(destFile, 'w');
                    } catch (e) {
                        /* istanbul ignore next */
                        common.error('copyFileSync: could not write to dest file (code=' + e.code + '):' + destFile);
                    }

                    while (bytesRead === bufLength) {
                        bytesRead = fs.readSync(fdr, buf, 0, bufLength, pos);
                        fs.writeSync(fdw, buf, 0, bytesRead);
                        pos += bytesRead;
                    }

                    fs.closeSync(fdr);
                    fs.closeSync(fdw);

                    fs.chmodSync(destFile, common.statFollowLinks(srcFile).mode);
                }
            }

// Recursively copies 'sourceDir' into 'destDir'
// Adapted from https://github.com/ryanmcgrath/wrench-js
//
// Copyright (c) 2010 Ryan McGrath
// Copyright (c) 2012 Artur Adib
//
// Licensed under the MIT License
// http://www.opensource.org/licenses/mit-license.php
            function cpdirSyncRecursive(sourceDir, destDir, currentDepth, opts) {
                if (!opts) opts = {};

                // Ensure there is not a run away recursive copy
                if (currentDepth >= common.config.maxdepth) return;
                currentDepth++;

                var isWindows = process.platform === 'win32';

                // Create the directory where all our junk is moving to; read the mode of the
                // source directory and mirror it
                try {
                    fs.mkdirSync(destDir);
                } catch (e) {
                    // if the directory already exists, that's okay
                    if (e.code !== 'EEXIST') throw e;
                }

                var files = fs.readdirSync(sourceDir);

                for (var i = 0; i < files.length; i++) {
                    var srcFile = sourceDir + '/' + files[i];
                    var destFile = destDir + '/' + files[i];
                    var srcFileStat = common.statNoFollowLinks(srcFile);

                    var symlinkFull;
                    if (opts.followsymlink) {
                        if (cpcheckcycle(sourceDir, srcFile)) {
                            // Cycle link found.
                            console.error('Cycle link found.');
                            symlinkFull = fs.readlinkSync(srcFile);
                            fs.symlinkSync(symlinkFull, destFile, isWindows ? 'junction' : null);
                            continue;
                        }
                    }
                    if (srcFileStat.isDirectory()) {
                        /* recursion this thing right on back. */
                        cpdirSyncRecursive(srcFile, destFile, currentDepth, opts);
                    } else if (srcFileStat.isSymbolicLink() && !opts.followsymlink) {
                        symlinkFull = fs.readlinkSync(srcFile);
                        try {
                            common.statNoFollowLinks(destFile);
                            common.unlinkSync(destFile); // re-link it
                        } catch (e) {
                            // it doesn't exist, so no work needs to be done
                        }
                        fs.symlinkSync(symlinkFull, destFile, isWindows ? 'junction' : null);
                    } else if (srcFileStat.isSymbolicLink() && opts.followsymlink) {
                        srcFileStat = common.statFollowLinks(srcFile);
                        if (srcFileStat.isDirectory()) {
                            cpdirSyncRecursive(srcFile, destFile, currentDepth, opts);
                        } else {
                            copyFileSync(srcFile, destFile, opts);
                        }
                    } else {
                        /* At this point, we've hit a file actually worth copying... so copy it on over. */
                        if (fs.existsSync(destFile) && opts.no_force) {
                            common.log('skipping existing file: ' + files[i]);
                        } else {
                            copyFileSync(srcFile, destFile, opts);
                        }
                    }
                } // for files

                // finally change the mode for the newly created directory (otherwise, we
                // couldn't add files to a read-only directory).
                var checkDir = common.statFollowLinks(sourceDir);
                fs.chmodSync(destDir, checkDir.mode);
            } // cpdirSyncRecursive

// Checks if cureent file was created recently
            function checkRecentCreated(sources, index) {
                var lookedSource = sources[index];
                return sources.slice(0, index).some(function(src) {
                    return path.basename(src) === path.basename(lookedSource);
                });
            }

            function cpcheckcycle(sourceDir, srcFile) {
                var srcFileStat = common.statNoFollowLinks(srcFile);
                if (srcFileStat.isSymbolicLink()) {
                    // Do cycle check. For example:
                    //   $ mkdir -p 1/2/3/4
                    //   $ cd  1/2/3/4
                    //   $ ln -s ../../3 link
                    //   $ cd ../../../..
                    //   $ cp -RL 1 copy
                    var cyclecheck = common.statFollowLinks(srcFile);
                    if (cyclecheck.isDirectory()) {
                        var sourcerealpath = fs.realpathSync(sourceDir);
                        var symlinkrealpath = fs.realpathSync(srcFile);
                        var re = new RegExp(symlinkrealpath);
                        if (re.test(sourcerealpath)) {
                            return true;
                        }
                    }
                }
                return false;
            }

//@
//@ ### cp([options,] source [, source ...], dest)
//@ ### cp([options,] source_array, dest)
//@
//@ Available options:
//@
//@ + `-f`: force (default behavior)
//@ + `-n`: no-clobber
//@ + `-u`: only copy if `source` is newer than `dest`
//@ + `-r`, `-R`: recursive
//@ + `-L`: follow symlinks
//@ + `-P`: don't follow symlinks
//@
//@ Examples:
//@
//@ ```javascript
//@ cp('file1', 'dir1');
//@ cp('-R', 'path/to/dir/', '~/newCopy/');
//@ cp('-Rf', '/tmp/*', '/usr/local/*', '/home/tmp');
//@ cp('-Rf', ['/tmp/*', '/usr/local/*'], '/home/tmp'); // same as above
//@ ```
//@
//@ Copies files.
            function _cp(options, sources, dest) {
                // If we're missing -R, it actually implies -L (unless -P is explicit)
                if (options.followsymlink) {
                    options.noFollowsymlink = false;
                }
                if (!options.recursive && !options.noFollowsymlink) {
                    options.followsymlink = true;
                }

                // Get sources, dest
                if (arguments.length < 3) {
                    common.error('missing <source> and/or <dest>');
                } else {
                    sources = [].slice.call(arguments, 1, arguments.length - 1);
                    dest = arguments[arguments.length - 1];
                }

                var destExists = fs.existsSync(dest);
                var destStat = destExists && common.statFollowLinks(dest);

                // Dest is not existing dir, but multiple sources given
                if ((!destExists || !destStat.isDirectory()) && sources.length > 1) {
                    common.error('dest is not a directory (too many sources)');
                }

                // Dest is an existing file, but -n is given
                if (destExists && destStat.isFile() && options.no_force) {
                    return new common.ShellString('', '', 0);
                }

                sources.forEach(function(src, srcIndex) {
                    if (!fs.existsSync(src)) {
                        if (src === '') src = "''"; // if src was empty string, display empty string
                        common.error('no such file or directory: ' + src, { continue: true });
                        return; // skip file
                    }
                    var srcStat = common.statFollowLinks(src);
                    if (!options.noFollowsymlink && srcStat.isDirectory()) {
                        if (!options.recursive) {
                            // Non-Recursive
                            common.error("omitting directory '" + src + "'", { continue: true });
                        } else {
                            // Recursive
                            // 'cp /a/source dest' should create 'source' in 'dest'
                            var newDest = (destStat && destStat.isDirectory()) ?
                              path.join(dest, path.basename(src)) :
                              dest;

                            try {
                                common.statFollowLinks(path.dirname(dest));
                                cpdirSyncRecursive(src, newDest, 0, {
                                    no_force: options.no_force,
                                    followsymlink: options.followsymlink
                                });
                            } catch (e) {
                                /* istanbul ignore next */
                                common.error("cannot create directory '" + dest + "': No such file or directory");
                            }
                        }
                    } else {
                        // If here, src is a file

                        // When copying to '/path/dir':
                        //    thisDest = '/path/dir/file1'
                        var thisDest = dest;
                        if (destStat && destStat.isDirectory()) {
                            thisDest = path.normalize(dest + '/' + path.basename(src));
                        }

                        var thisDestExists = fs.existsSync(thisDest);
                        if (thisDestExists && checkRecentCreated(sources, srcIndex)) {
                            // cannot overwrite file created recently in current execution, but we want to continue copying other files
                            if (!options.no_force) {
                                common.error("will not overwrite just-created '" + thisDest + "' with '" + src + "'", { continue: true });
                            }
                            return;
                        }

                        if (thisDestExists && options.no_force) {
                            return; // skip file
                        }

                        if (path.relative(src, thisDest) === '') {
                            // a file cannot be copied to itself, but we want to continue copying other files
                            common.error("'" + thisDest + "' and '" + src + "' are the same file", { continue: true });
                            return;
                        }

                        copyFileSync(src, thisDest, options);
                    }
                }); // forEach(src)

                return new common.ShellString('', common.state.error, common.state.errorCode);
            }

            module.exports = _cp;


            /***/
        }),

        /***/ 1178:
        /***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var _cd = __nccwpck_require__(2051);
            var path = __nccwpck_require__(1017);

            common.register('dirs', _dirs, {
                wrapOutput: false,
            });
            common.register('pushd', _pushd, {
                wrapOutput: false,
            });
            common.register('popd', _popd, {
                wrapOutput: false,
            });

// Pushd/popd/dirs internals
            var _dirStack = [];

            function _isStackIndex(index) {
                return (/^[\-+]\d+$/).test(index);
            }

            function _parseStackIndex(index) {
                if (_isStackIndex(index)) {
                    if (Math.abs(index) < _dirStack.length + 1) { // +1 for pwd
                        return (/^-/).test(index) ? Number(index) - 1 : Number(index);
                    }
                    common.error(index + ': directory stack index out of range');
                } else {
                    common.error(index + ': invalid number');
                }
            }

            function _actualDirStack() {
                return [process.cwd()].concat(_dirStack);
            }

//@
//@ ### pushd([options,] [dir | '-N' | '+N'])
//@
//@ Available options:
//@
//@ + `-n`: Suppresses the normal change of directory when adding directories to the stack, so that only the stack is manipulated.
//@ + `-q`: Supresses output to the console.
//@
//@ Arguments:
//@
//@ + `dir`: Sets the current working directory to the top of the stack, then executes the equivalent of `cd dir`.
//@ + `+N`: Brings the Nth directory (counting from the left of the list printed by dirs, starting with zero) to the top of the list by rotating the stack.
//@ + `-N`: Brings the Nth directory (counting from the right of the list printed by dirs, starting with zero) to the top of the list by rotating the stack.
//@
//@ Examples:
//@
//@ ```javascript
//@ // process.cwd() === '/usr'
//@ pushd('/etc'); // Returns /etc /usr
//@ pushd('+1');   // Returns /usr /etc
//@ ```
//@
//@ Save the current directory on the top of the directory stack and then `cd` to `dir`. With no arguments, `pushd` exchanges the top two directories. Returns an array of paths in the stack.
            function _pushd(options, dir) {
                if (_isStackIndex(options)) {
                    dir = options;
                    options = '';
                }

                options = common.parseOptions(options, {
                    'n': 'no-cd',
                    'q': 'quiet',
                });

                var dirs = _actualDirStack();

                if (dir === '+0') {
                    return dirs; // +0 is a noop
                } else if (!dir) {
                    if (dirs.length > 1) {
                        dirs = dirs.splice(1, 1).concat(dirs);
                    } else {
                        return common.error('no other directory');
                    }
                } else if (_isStackIndex(dir)) {
                    var n = _parseStackIndex(dir);
                    dirs = dirs.slice(n).concat(dirs.slice(0, n));
                } else {
                    if (options['no-cd']) {
                        dirs.splice(1, 0, dir);
                    } else {
                        dirs.unshift(dir);
                    }
                }

                if (options['no-cd']) {
                    dirs = dirs.slice(1);
                } else {
                    dir = path.resolve(dirs.shift());
                    _cd('', dir);
                }

                _dirStack = dirs;
                return _dirs(options.quiet ? '-q' : '');
            }

            exports.pushd = _pushd;

//@
//@
//@ ### popd([options,] ['-N' | '+N'])
//@
//@ Available options:
//@
//@ + `-n`: Suppress the normal directory change when removing directories from the stack, so that only the stack is manipulated.
//@ + `-q`: Supresses output to the console.
//@
//@ Arguments:
//@
//@ + `+N`: Removes the Nth directory (counting from the left of the list printed by dirs), starting with zero.
//@ + `-N`: Removes the Nth directory (counting from the right of the list printed by dirs), starting with zero.
//@
//@ Examples:
//@
//@ ```javascript
//@ echo(process.cwd()); // '/usr'
//@ pushd('/etc');       // '/etc /usr'
//@ echo(process.cwd()); // '/etc'
//@ popd();              // '/usr'
//@ echo(process.cwd()); // '/usr'
//@ ```
//@
//@ When no arguments are given, `popd` removes the top directory from the stack and performs a `cd` to the new top directory. The elements are numbered from 0, starting at the first directory listed with dirs (i.e., `popd` is equivalent to `popd +0`). Returns an array of paths in the stack.
            function _popd(options, index) {
                if (_isStackIndex(options)) {
                    index = options;
                    options = '';
                }

                options = common.parseOptions(options, {
                    'n': 'no-cd',
                    'q': 'quiet',
                });

                if (!_dirStack.length) {
                    return common.error('directory stack empty');
                }

                index = _parseStackIndex(index || '+0');

                if (options['no-cd'] || index > 0 || _dirStack.length + index === 0) {
                    index = index > 0 ? index - 1 : index;
                    _dirStack.splice(index, 1);
                } else {
                    var dir = path.resolve(_dirStack.shift());
                    _cd('', dir);
                }

                return _dirs(options.quiet ? '-q' : '');
            }

            exports.popd = _popd;

//@
//@
//@ ### dirs([options | '+N' | '-N'])
//@
//@ Available options:
//@
//@ + `-c`: Clears the directory stack by deleting all of the elements.
//@ + `-q`: Supresses output to the console.
//@
//@ Arguments:
//@
//@ + `+N`: Displays the Nth directory (counting from the left of the list printed by dirs when invoked without options), starting with zero.
//@ + `-N`: Displays the Nth directory (counting from the right of the list printed by dirs when invoked without options), starting with zero.
//@
//@ Display the list of currently remembered directories. Returns an array of paths in the stack, or a single path if `+N` or `-N` was specified.
//@
//@ See also: `pushd`, `popd`
            function _dirs(options, index) {
                if (_isStackIndex(options)) {
                    index = options;
                    options = '';
                }

                options = common.parseOptions(options, {
                    'c': 'clear',
                    'q': 'quiet',
                });

                if (options.clear) {
                    _dirStack = [];
                    return _dirStack;
                }

                var stack = _actualDirStack();

                if (index) {
                    index = _parseStackIndex(index);

                    if (index < 0) {
                        index = stack.length + index;
                    }

                    if (!options.quiet) {
                        common.log(stack[index]);
                    }
                    return stack[index];
                }

                if (!options.quiet) {
                    common.log(stack.join(' '));
                }

                return stack;
            }

            exports.dirs = _dirs;


            /***/
        }),

        /***/ 243:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var format = (__nccwpck_require__(3837).format);

            var common = __nccwpck_require__(3687);

            common.register('echo', _echo, {
                allowGlobbing: false,
            });

//@
//@ ### echo([options,] string [, string ...])
//@
//@ Available options:
//@
//@ + `-e`: interpret backslash escapes (default)
//@ + `-n`: remove trailing newline from output
//@
//@ Examples:
//@
//@ ```javascript
//@ echo('hello world');
//@ var str = echo('hello world');
//@ echo('-n', 'no newline at end');
//@ ```
//@
//@ Prints `string` to stdout, and returns string with additional utility methods
//@ like `.to()`.
            function _echo(opts) {
                // allow strings starting with '-', see issue #20
                var messages = [].slice.call(arguments, opts ? 0 : 1);
                var options = {};

                // If the first argument starts with '-', parse it as options string.
                // If parseOptions throws, it wasn't an options string.
                try {
                    options = common.parseOptions(messages[0], {
                        'e': 'escapes',
                        'n': 'no_newline',
                    }, {
                        silent: true,
                    });

                    // Allow null to be echoed
                    if (messages[0]) {
                        messages.shift();
                    }
                } catch (_) {
                    // Clear out error if an error occurred
                    common.state.error = null;
                }

                var output = format.apply(null, messages);

                // Add newline if -n is not passed.
                if (!options.no_newline) {
                    output += '\n';
                }

                process.stdout.write(output);

                return output;
            }

            module.exports = _echo;


            /***/
        }),

        /***/ 232:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);

//@
//@ ### error()
//@
//@ Tests if error occurred in the last command. Returns a truthy value if an
//@ error returned, or a falsy value otherwise.
//@
//@ **Note**: do not rely on the
//@ return value to be an error message. If you need the last error message, use
//@ the `.stderr` attribute from the last command's return value instead.
            function error() {
                return common.state.error;
            }

            module.exports = error;


            /***/
        }),

        /***/ 9607:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            /* module decorator */
            module = __nccwpck_require__.nmd(module);
            if (require.main !== module) {
                throw new Error('This file should not be required');
            }

            var childProcess = __nccwpck_require__(2081);
            var fs = __nccwpck_require__(7147);

            var paramFilePath = process.argv[2];

            var serializedParams = fs.readFileSync(paramFilePath, 'utf8');
            var params = JSON.parse(serializedParams);

            var cmd = params.command;
            var execOptions = params.execOptions;
            var pipe = params.pipe;
            var stdoutFile = params.stdoutFile;
            var stderrFile = params.stderrFile;

            var c = childProcess.exec(cmd, execOptions, function(err) {
                if (!err) {
                    process.exitCode = 0;
                } else if (err.code === undefined) {
                    process.exitCode = 1;
                } else {
                    process.exitCode = err.code;
                }
            });

            var stdoutStream = fs.createWriteStream(stdoutFile);
            var stderrStream = fs.createWriteStream(stderrFile);

            c.stdout.pipe(stdoutStream);
            c.stderr.pipe(stderrStream);
            c.stdout.pipe(process.stdout);
            c.stderr.pipe(process.stderr);

            if (pipe) {
                c.stdin.end(pipe);
            }


            /***/
        }),

        /***/ 896:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var _tempDir = (__nccwpck_require__(6150).tempDir);
            var _pwd = __nccwpck_require__(8553);
            var path = __nccwpck_require__(1017);
            var fs = __nccwpck_require__(7147);
            var child = __nccwpck_require__(2081);

            var DEFAULT_MAXBUFFER_SIZE = 20 * 1024 * 1024;
            var DEFAULT_ERROR_CODE = 1;

            common.register('exec', _exec, {
                unix: false,
                canReceivePipe: true,
                wrapOutput: false,
            });

// We use this function to run `exec` synchronously while also providing realtime
// output.
            function execSync(cmd, opts, pipe) {
                if (!common.config.execPath) {
                    common.error('Unable to find a path to the node binary. Please manually set config.execPath');
                }

                var tempDir = _tempDir();
                var paramsFile = path.resolve(tempDir + '/' + common.randomFileName());
                var stderrFile = path.resolve(tempDir + '/' + common.randomFileName());
                var stdoutFile = path.resolve(tempDir + '/' + common.randomFileName());

                opts = common.extend({
                    silent: common.config.silent,
                    cwd: _pwd().toString(),
                    env: process.env,
                    maxBuffer: DEFAULT_MAXBUFFER_SIZE,
                    encoding: 'utf8',
                }, opts);

                if (fs.existsSync(paramsFile)) common.unlinkSync(paramsFile);
                if (fs.existsSync(stderrFile)) common.unlinkSync(stderrFile);
                if (fs.existsSync(stdoutFile)) common.unlinkSync(stdoutFile);

                opts.cwd = path.resolve(opts.cwd);

                var paramsToSerialize = {
                    command: cmd,
                    execOptions: opts,
                    pipe: pipe,
                    stdoutFile: stdoutFile,
                    stderrFile: stderrFile,
                };

                // Create the files and ensure these are locked down (for read and write) to
                // the current user. The main concerns here are:
                //
                // * If we execute a command which prints sensitive output, then
                //   stdoutFile/stderrFile must not be readable by other users.
                // * paramsFile must not be readable by other users, or else they can read it
                //   to figure out the path for stdoutFile/stderrFile and create these first
                //   (locked down to their own access), which will crash exec() when it tries
                //   to write to the files.
                function writeFileLockedDown(filePath, data) {
                    fs.writeFileSync(filePath, data, {
                        encoding: 'utf8',
                        mode: parseInt('600', 8),
                    });
                }

                writeFileLockedDown(stdoutFile, '');
                writeFileLockedDown(stderrFile, '');
                writeFileLockedDown(paramsFile, JSON.stringify(paramsToSerialize));

                var execArgs = [
                    __nccwpck_require__.ab + "exec-child.js",
                    paramsFile,
                ];

                /* istanbul ignore else */
                if (opts.silent) {
                    opts.stdio = 'ignore';
                } else {
                    opts.stdio = [0, 1, 2];
                }

                var code = 0;

                // Welcome to the future
                try {
                    // Bad things if we pass in a `shell` option to child_process.execFileSync,
                    // so we need to explicitly remove it here.
                    delete opts.shell;

                    child.execFileSync(common.config.execPath, execArgs, opts);
                } catch (e) {
                    // Commands with non-zero exit code raise an exception.
                    code = e.status || DEFAULT_ERROR_CODE;
                }

                // fs.readFileSync uses buffer encoding by default, so call
                // it without the encoding option if the encoding is 'buffer'.
                // Also, if the exec timeout is too short for node to start up,
                // the files will not be created, so these calls will throw.
                var stdout = '';
                var stderr = '';
                if (opts.encoding === 'buffer') {
                    stdout = fs.readFileSync(stdoutFile);
                    stderr = fs.readFileSync(stderrFile);
                } else {
                    stdout = fs.readFileSync(stdoutFile, opts.encoding);
                    stderr = fs.readFileSync(stderrFile, opts.encoding);
                }

                // No biggie if we can't erase the files now -- they're in a temp dir anyway
                // and we locked down permissions (see the note above).
                try {
                    common.unlinkSync(paramsFile);
                } catch (e) {
                }
                try {
                    common.unlinkSync(stderrFile);
                } catch (e) {
                }
                try {
                    common.unlinkSync(stdoutFile);
                } catch (e) {
                }

                if (code !== 0) {
                    // Note: `silent` should be unconditionally true to avoid double-printing
                    // the command's stderr, and to avoid printing any stderr when the user has
                    // set `shell.config.silent`.
                    common.error(stderr, code, { continue: true, silent: true });
                }
                var obj = common.ShellString(stdout, stderr, code);
                return obj;
            } // execSync()

// Wrapper around exec() to enable echoing output to console in real time
            function execAsync(cmd, opts, pipe, callback) {
                opts = common.extend({
                    silent: common.config.silent,
                    cwd: _pwd().toString(),
                    env: process.env,
                    maxBuffer: DEFAULT_MAXBUFFER_SIZE,
                    encoding: 'utf8',
                }, opts);

                var c = child.exec(cmd, opts, function(err, stdout, stderr) {
                    if (callback) {
                        if (!err) {
                            callback(0, stdout, stderr);
                        } else if (err.code === undefined) {
                            // See issue #536
                            /* istanbul ignore next */
                            callback(1, stdout, stderr);
                        } else {
                            callback(err.code, stdout, stderr);
                        }
                    }
                });

                if (pipe) c.stdin.end(pipe);

                if (!opts.silent) {
                    c.stdout.pipe(process.stdout);
                    c.stderr.pipe(process.stderr);
                }

                return c;
            }

//@
//@ ### exec(command [, options] [, callback])
//@
//@ Available options:
//@
//@ + `async`: Asynchronous execution. If a callback is provided, it will be set to
//@   `true`, regardless of the passed value (default: `false`).
//@ + `silent`: Do not echo program output to console (default: `false`).
//@ + `encoding`: Character encoding to use. Affects the values returned to stdout and stderr, and
//@   what is written to stdout and stderr when not in silent mode (default: `'utf8'`).
//@ + and any option available to Node.js's
//@   [`child_process.exec()`](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)
//@
//@ Examples:
//@
//@ ```javascript
//@ var version = exec('node --version', {silent:true}).stdout;
//@
//@ var child = exec('some_long_running_process', {async:true});
//@ child.stdout.on('data', function(data) {
//@   /* ... do something with data ... */
//@ });
//@
//@ exec('some_long_running_process', function(code, stdout, stderr) {
//@   console.log('Exit code:', code);
//@   console.log('Program output:', stdout);
//@   console.log('Program stderr:', stderr);
//@ });
//@ ```
//@
//@ Executes the given `command` _synchronously_, unless otherwise specified.  When in synchronous
//@ mode, this returns a `ShellString` (compatible with ShellJS v0.6.x, which returns an object
//@ of the form `{ code:..., stdout:... , stderr:... }`). Otherwise, this returns the child process
//@ object, and the `callback` receives the arguments `(code, stdout, stderr)`.
//@
//@ Not seeing the behavior you want? `exec()` runs everything through `sh`
//@ by default (or `cmd.exe` on Windows), which differs from `bash`. If you
//@ need bash-specific behavior, try out the `{shell: 'path/to/bash'}` option.
            function _exec(command, options, callback) {
                options = options || {};
                if (!command) common.error('must specify command');

                var pipe = common.readFromPipe();

                // Callback is defined instead of options.
                if (typeof options === 'function') {
                    callback = options;
                    options = { async: true };
                }

                // Callback is defined with options.
                if (typeof options === 'object' && typeof callback === 'function') {
                    options.async = true;
                }

                options = common.extend({
                    silent: common.config.silent,
                    async: false,
                }, options);

                if (options.async) {
                    return execAsync(command, options, pipe, callback);
                } else {
                    return execSync(command, options, pipe);
                }
            }

            module.exports = _exec;


            /***/
        }),

        /***/ 7838:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var path = __nccwpck_require__(1017);
            var common = __nccwpck_require__(3687);
            var _ls = __nccwpck_require__(5561);

            common.register('find', _find, {});

//@
//@ ### find(path [, path ...])
//@ ### find(path_array)
//@
//@ Examples:
//@
//@ ```javascript
//@ find('src', 'lib');
//@ find(['src', 'lib']); // same as above
//@ find('.').filter(function(file) { return file.match(/\.js$/); });
//@ ```
//@
//@ Returns array of all files (however deep) in the given paths.
//@
//@ The main difference from `ls('-R', path)` is that the resulting file names
//@ include the base directories (e.g., `lib/resources/file1` instead of just `file1`).
            function _find(options, paths) {
                if (!paths) {
                    common.error('no path specified');
                } else if (typeof paths === 'string') {
                    paths = [].slice.call(arguments, 1);
                }

                var list = [];

                function pushFile(file) {
                    if (process.platform === 'win32') {
                        file = file.replace(/\\/g, '/');
                    }
                    list.push(file);
                }

                // why not simply do `ls('-R', paths)`? because the output wouldn't give the base dirs
                // to get the base dir in the output, we need instead `ls('-R', 'dir/*')` for every directory

                paths.forEach(function(file) {
                    var stat;
                    try {
                        stat = common.statFollowLinks(file);
                    } catch (e) {
                        common.error('no such file or directory: ' + file);
                    }

                    pushFile(file);

                    if (stat.isDirectory()) {
                        _ls({ recursive: true, all: true }, file).forEach(function(subfile) {
                            pushFile(path.join(file, subfile));
                        });
                    }
                });

                return list;
            }

            module.exports = _find;


            /***/
        }),

        /***/ 7417:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);

            common.register('grep', _grep, {
                globStart: 2, // don't glob-expand the regex
                canReceivePipe: true,
                cmdOptions: {
                    'v': 'inverse',
                    'l': 'nameOnly',
                    'i': 'ignoreCase',
                },
            });

//@
//@ ### grep([options,] regex_filter, file [, file ...])
//@ ### grep([options,] regex_filter, file_array)
//@
//@ Available options:
//@
//@ + `-v`: Invert `regex_filter` (only print non-matching lines).
//@ + `-l`: Print only filenames of matching files.
//@ + `-i`: Ignore case.
//@
//@ Examples:
//@
//@ ```javascript
//@ grep('-v', 'GLOBAL_VARIABLE', '*.js');
//@ grep('GLOBAL_VARIABLE', '*.js');
//@ ```
//@
//@ Reads input string from given files and returns a string containing all lines of the
//@ file that match the given `regex_filter`.
            function _grep(options, regex, files) {
                // Check if this is coming from a pipe
                var pipe = common.readFromPipe();

                if (!files && !pipe) common.error('no paths given', 2);

                files = [].slice.call(arguments, 2);

                if (pipe) {
                    files.unshift('-');
                }

                var grep = [];
                if (options.ignoreCase) {
                    regex = new RegExp(regex, 'i');
                }
                files.forEach(function(file) {
                    if (!fs.existsSync(file) && file !== '-') {
                        common.error('no such file or directory: ' + file, 2, { continue: true });
                        return;
                    }

                    var contents = file === '-' ? pipe : fs.readFileSync(file, 'utf8');
                    if (options.nameOnly) {
                        if (contents.match(regex)) {
                            grep.push(file);
                        }
                    } else {
                        var lines = contents.split('\n');
                        lines.forEach(function(line) {
                            var matched = line.match(regex);
                            if ((options.inverse && !matched) || (!options.inverse && matched)) {
                                grep.push(line);
                            }
                        });
                    }
                });

                return grep.join('\n') + '\n';
            }

            module.exports = _grep;


            /***/
        }),

        /***/ 6613:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);

            common.register('head', _head, {
                canReceivePipe: true,
                cmdOptions: {
                    'n': 'numLines',
                },
            });

// Reads |numLines| lines or the entire file, whichever is less.
            function readSomeLines(file, numLines) {
                var buf = common.buffer();
                var bufLength = buf.length;
                var bytesRead = bufLength;
                var pos = 0;

                var fdr = fs.openSync(file, 'r');
                var numLinesRead = 0;
                var ret = '';
                while (bytesRead === bufLength && numLinesRead < numLines) {
                    bytesRead = fs.readSync(fdr, buf, 0, bufLength, pos);
                    var bufStr = buf.toString('utf8', 0, bytesRead);
                    numLinesRead += bufStr.split('\n').length - 1;
                    ret += bufStr;
                    pos += bytesRead;
                }

                fs.closeSync(fdr);
                return ret;
            }

//@
//@ ### head([{'-n': \<num\>},] file [, file ...])
//@ ### head([{'-n': \<num\>},] file_array)
//@
//@ Available options:
//@
//@ + `-n <num>`: Show the first `<num>` lines of the files
//@
//@ Examples:
//@
//@ ```javascript
//@ var str = head({'-n': 1}, 'file*.txt');
//@ var str = head('file1', 'file2');
//@ var str = head(['file1', 'file2']); // same as above
//@ ```
//@
//@ Read the start of a file.
            function _head(options, files) {
                var head = [];
                var pipe = common.readFromPipe();

                if (!files && !pipe) common.error('no paths given');

                var idx = 1;
                if (options.numLines === true) {
                    idx = 2;
                    options.numLines = Number(arguments[1]);
                } else if (options.numLines === false) {
                    options.numLines = 10;
                }
                files = [].slice.call(arguments, idx);

                if (pipe) {
                    files.unshift('-');
                }

                var shouldAppendNewline = false;
                files.forEach(function(file) {
                    if (file !== '-') {
                        if (!fs.existsSync(file)) {
                            common.error('no such file or directory: ' + file, { continue: true });
                            return;
                        } else if (common.statFollowLinks(file).isDirectory()) {
                            common.error("error reading '" + file + "': Is a directory", {
                                continue: true,
                            });
                            return;
                        }
                    }

                    var contents;
                    if (file === '-') {
                        contents = pipe;
                    } else if (options.numLines < 0) {
                        contents = fs.readFileSync(file, 'utf8');
                    } else {
                        contents = readSomeLines(file, options.numLines);
                    }

                    var lines = contents.split('\n');
                    var hasTrailingNewline = (lines[lines.length - 1] === '');
                    if (hasTrailingNewline) {
                        lines.pop();
                    }
                    shouldAppendNewline = (hasTrailingNewline || options.numLines < lines.length);

                    head = head.concat(lines.slice(0, options.numLines));
                });

                if (shouldAppendNewline) {
                    head.push(''); // to add a trailing newline once we join
                }
                return head.join('\n');
            }

            module.exports = _head;


            /***/
        }),

        /***/ 5787:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var fs = __nccwpck_require__(7147);
            var path = __nccwpck_require__(1017);
            var common = __nccwpck_require__(3687);

            common.register('ln', _ln, {
                cmdOptions: {
                    's': 'symlink',
                    'f': 'force',
                },
            });

//@
//@ ### ln([options,] source, dest)
//@
//@ Available options:
//@
//@ + `-s`: symlink
//@ + `-f`: force
//@
//@ Examples:
//@
//@ ```javascript
//@ ln('file', 'newlink');
//@ ln('-sf', 'file', 'existing');
//@ ```
//@
//@ Links `source` to `dest`. Use `-f` to force the link, should `dest` already exist.
            function _ln(options, source, dest) {
                if (!source || !dest) {
                    common.error('Missing <source> and/or <dest>');
                }

                source = String(source);
                var sourcePath = path.normalize(source).replace(RegExp(path.sep + '$'), '');
                var isAbsolute = (path.resolve(source) === sourcePath);
                dest = path.resolve(process.cwd(), String(dest));

                if (fs.existsSync(dest)) {
                    if (!options.force) {
                        common.error('Destination file exists', { continue: true });
                    }

                    fs.unlinkSync(dest);
                }

                if (options.symlink) {
                    var isWindows = process.platform === 'win32';
                    var linkType = isWindows ? 'file' : null;
                    var resolvedSourcePath = isAbsolute ? sourcePath : path.resolve(process.cwd(), path.dirname(dest), source);
                    if (!fs.existsSync(resolvedSourcePath)) {
                        common.error('Source file does not exist', { continue: true });
                    } else if (isWindows && common.statFollowLinks(resolvedSourcePath).isDirectory()) {
                        linkType = 'junction';
                    }

                    try {
                        fs.symlinkSync(linkType === 'junction' ? resolvedSourcePath : source, dest, linkType);
                    } catch (err) {
                        common.error(err.message);
                    }
                } else {
                    if (!fs.existsSync(source)) {
                        common.error('Source file does not exist', { continue: true });
                    }
                    try {
                        fs.linkSync(source, dest);
                    } catch (err) {
                        common.error(err.message);
                    }
                }
                return '';
            }

            module.exports = _ln;


            /***/
        }),

        /***/ 5561:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var path = __nccwpck_require__(1017);
            var fs = __nccwpck_require__(7147);
            var common = __nccwpck_require__(3687);
            var glob = __nccwpck_require__(1957);

            var globPatternRecursive = path.sep + '**';

            common.register('ls', _ls, {
                cmdOptions: {
                    'R': 'recursive',
                    'A': 'all',
                    'L': 'link',
                    'a': 'all_deprecated',
                    'd': 'directory',
                    'l': 'long',
                },
            });

//@
//@ ### ls([options,] [path, ...])
//@ ### ls([options,] path_array)
//@
//@ Available options:
//@
//@ + `-R`: recursive
//@ + `-A`: all files (include files beginning with `.`, except for `.` and `..`)
//@ + `-L`: follow symlinks
//@ + `-d`: list directories themselves, not their contents
//@ + `-l`: list objects representing each file, each with fields containing `ls
//@         -l` output fields. See
//@         [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats)
//@         for more info
//@
//@ Examples:
//@
//@ ```javascript
//@ ls('projs/*.js');
//@ ls('-R', '/users/me', '/tmp');
//@ ls('-R', ['/users/me', '/tmp']); // same as above
//@ ls('-l', 'file.txt'); // { name: 'file.txt', mode: 33188, nlink: 1, ...}
//@ ```
//@
//@ Returns array of files in the given `path`, or files in
//@ the current directory if no `path` is  provided.
            function _ls(options, paths) {
                if (options.all_deprecated) {
                    // We won't support the -a option as it's hard to image why it's useful
                    // (it includes '.' and '..' in addition to '.*' files)
                    // For backwards compatibility we'll dump a deprecated message and proceed as before
                    common.log('ls: Option -a is deprecated. Use -A instead');
                    options.all = true;
                }

                if (!paths) {
                    paths = ['.'];
                } else {
                    paths = [].slice.call(arguments, 1);
                }

                var list = [];

                function pushFile(abs, relName, stat) {
                    if (process.platform === 'win32') {
                        relName = relName.replace(/\\/g, '/');
                    }
                    if (options.long) {
                        stat = stat || (options.link ? common.statFollowLinks(abs) : common.statNoFollowLinks(abs));
                        list.push(addLsAttributes(relName, stat));
                    } else {
                        // list.push(path.relative(rel || '.', file));
                        list.push(relName);
                    }
                }

                paths.forEach(function(p) {
                    var stat;

                    try {
                        stat = options.link ? common.statFollowLinks(p) : common.statNoFollowLinks(p);
                        // follow links to directories by default
                        if (stat.isSymbolicLink()) {
                            /* istanbul ignore next */
                            // workaround for https://github.com/shelljs/shelljs/issues/795
                            // codecov seems to have a bug that miscalculate this block as uncovered.
                            // but according to nyc report this block does get covered.
                            try {
                                var _stat = common.statFollowLinks(p);
                                if (_stat.isDirectory()) {
                                    stat = _stat;
                                }
                            } catch (_) {
                            } // bad symlink, treat it like a file
                        }
                    } catch (e) {
                        common.error('no such file or directory: ' + p, 2, { continue: true });
                        return;
                    }

                    // If the stat succeeded
                    if (stat.isDirectory() && !options.directory) {
                        if (options.recursive) {
                            // use glob, because it's simple
                            glob.sync(p + globPatternRecursive, { dot: options.all, follow: options.link })
                              .forEach(function(item) {
                                  // Glob pattern returns the directory itself and needs to be filtered out.
                                  if (path.relative(p, item)) {
                                      pushFile(item, path.relative(p, item));
                                  }
                              });
                        } else if (options.all) {
                            // use fs.readdirSync, because it's fast
                            fs.readdirSync(p).forEach(function(item) {
                                pushFile(path.join(p, item), item);
                            });
                        } else {
                            // use fs.readdirSync and then filter out secret files
                            fs.readdirSync(p).forEach(function(item) {
                                if (item[0] !== '.') {
                                    pushFile(path.join(p, item), item);
                                }
                            });
                        }
                    } else {
                        pushFile(p, p, stat);
                    }
                });

                // Add methods, to make this more compatible with ShellStrings
                return list;
            }

            function addLsAttributes(pathName, stats) {
                // Note: this object will contain more information than .toString() returns
                stats.name = pathName;
                stats.toString = function() {
                    // Return a string resembling unix's `ls -l` format
                    return [this.mode, this.nlink, this.uid, this.gid, this.size, this.mtime, this.name].join(' ');
                };
                return stats;
            }

            module.exports = _ls;


            /***/
        }),

        /***/ 2695:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);
            var path = __nccwpck_require__(1017);

            common.register('mkdir', _mkdir, {
                cmdOptions: {
                    'p': 'fullpath',
                },
            });

// Recursively creates `dir`
            function mkdirSyncRecursive(dir) {
                var baseDir = path.dirname(dir);

                // Prevents some potential problems arising from malformed UNCs or
                // insufficient permissions.
                /* istanbul ignore next */
                if (baseDir === dir) {
                    common.error('dirname() failed: [' + dir + ']');
                }

                // Base dir exists, no recursion necessary
                if (fs.existsSync(baseDir)) {
                    fs.mkdirSync(dir, parseInt('0777', 8));
                    return;
                }

                // Base dir does not exist, go recursive
                mkdirSyncRecursive(baseDir);

                // Base dir created, can create dir
                fs.mkdirSync(dir, parseInt('0777', 8));
            }

//@
//@ ### mkdir([options,] dir [, dir ...])
//@ ### mkdir([options,] dir_array)
//@
//@ Available options:
//@
//@ + `-p`: full path (and create intermediate directories, if necessary)
//@
//@ Examples:
//@
//@ ```javascript
//@ mkdir('-p', '/tmp/a/b/c/d', '/tmp/e/f/g');
//@ mkdir('-p', ['/tmp/a/b/c/d', '/tmp/e/f/g']); // same as above
//@ ```
//@
//@ Creates directories.
            function _mkdir(options, dirs) {
                if (!dirs) common.error('no paths given');

                if (typeof dirs === 'string') {
                    dirs = [].slice.call(arguments, 1);
                }
                // if it's array leave it as it is

                dirs.forEach(function(dir) {
                    try {
                        var stat = common.statNoFollowLinks(dir);
                        if (!options.fullpath) {
                            common.error('path already exists: ' + dir, { continue: true });
                        } else if (stat.isFile()) {
                            common.error('cannot create directory ' + dir + ': File exists', { continue: true });
                        }
                        return; // skip dir
                    } catch (e) {
                        // do nothing
                    }

                    // Base dir does not exist, and no -p option given
                    var baseDir = path.dirname(dir);
                    if (!fs.existsSync(baseDir) && !options.fullpath) {
                        common.error('no such file or directory: ' + baseDir, { continue: true });
                        return; // skip dir
                    }

                    try {
                        if (options.fullpath) {
                            mkdirSyncRecursive(path.resolve(dir));
                        } else {
                            fs.mkdirSync(dir, parseInt('0777', 8));
                        }
                    } catch (e) {
                        var reason;
                        if (e.code === 'EACCES') {
                            reason = 'Permission denied';
                        } else if (e.code === 'ENOTDIR' || e.code === 'ENOENT') {
                            reason = 'Not a directory';
                        } else {
                            /* istanbul ignore next */
                            throw e;
                        }
                        common.error('cannot create directory ' + dir + ': ' + reason, { continue: true });
                    }
                });
                return '';
            } // mkdir
            module.exports = _mkdir;


            /***/
        }),

        /***/ 9849:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var fs = __nccwpck_require__(7147);
            var path = __nccwpck_require__(1017);
            var common = __nccwpck_require__(3687);
            var cp = __nccwpck_require__(4932);
            var rm = __nccwpck_require__(2830);

            common.register('mv', _mv, {
                cmdOptions: {
                    'f': '!no_force',
                    'n': 'no_force',
                },
            });

// Checks if cureent file was created recently
            function checkRecentCreated(sources, index) {
                var lookedSource = sources[index];
                return sources.slice(0, index).some(function(src) {
                    return path.basename(src) === path.basename(lookedSource);
                });
            }

//@
//@ ### mv([options ,] source [, source ...], dest')
//@ ### mv([options ,] source_array, dest')
//@
//@ Available options:
//@
//@ + `-f`: force (default behavior)
//@ + `-n`: no-clobber
//@
//@ Examples:
//@
//@ ```javascript
//@ mv('-n', 'file', 'dir/');
//@ mv('file1', 'file2', 'dir/');
//@ mv(['file1', 'file2'], 'dir/'); // same as above
//@ ```
//@
//@ Moves `source` file(s) to `dest`.
            function _mv(options, sources, dest) {
                // Get sources, dest
                if (arguments.length < 3) {
                    common.error('missing <source> and/or <dest>');
                } else if (arguments.length > 3) {
                    sources = [].slice.call(arguments, 1, arguments.length - 1);
                    dest = arguments[arguments.length - 1];
                } else if (typeof sources === 'string') {
                    sources = [sources];
                } else {
                    // TODO(nate): figure out if we actually need this line
                    common.error('invalid arguments');
                }

                var exists = fs.existsSync(dest);
                var stats = exists && common.statFollowLinks(dest);

                // Dest is not existing dir, but multiple sources given
                if ((!exists || !stats.isDirectory()) && sources.length > 1) {
                    common.error('dest is not a directory (too many sources)');
                }

                // Dest is an existing file, but no -f given
                if (exists && stats.isFile() && options.no_force) {
                    common.error('dest file already exists: ' + dest);
                }

                sources.forEach(function(src, srcIndex) {
                    if (!fs.existsSync(src)) {
                        common.error('no such file or directory: ' + src, { continue: true });
                        return; // skip file
                    }

                    // If here, src exists

                    // When copying to '/path/dir':
                    //    thisDest = '/path/dir/file1'
                    var thisDest = dest;
                    if (fs.existsSync(dest) && common.statFollowLinks(dest).isDirectory()) {
                        thisDest = path.normalize(dest + '/' + path.basename(src));
                    }

                    var thisDestExists = fs.existsSync(thisDest);

                    if (thisDestExists && checkRecentCreated(sources, srcIndex)) {
                        // cannot overwrite file created recently in current execution, but we want to continue copying other files
                        if (!options.no_force) {
                            common.error("will not overwrite just-created '" + thisDest + "' with '" + src + "'", { continue: true });
                        }
                        return;
                    }

                    if (fs.existsSync(thisDest) && options.no_force) {
                        common.error('dest file already exists: ' + thisDest, { continue: true });
                        return; // skip file
                    }

                    if (path.resolve(src) === path.dirname(path.resolve(thisDest))) {
                        common.error('cannot move to self: ' + src, { continue: true });
                        return; // skip file
                    }

                    try {
                        fs.renameSync(src, thisDest);
                    } catch (e) {
                        /* istanbul ignore next */
                        if (e.code === 'EXDEV') {
                            // If we're trying to `mv` to an external partition, we'll actually need
                            // to perform a copy and then clean up the original file. If either the
                            // copy or the rm fails with an exception, we should allow this
                            // exception to pass up to the top level.
                            cp('-r', src, thisDest);
                            rm('-rf', src);
                        }
                    }
                }); // forEach(src)
                return '';
            } // mv
            module.exports = _mv;


            /***/
        }),

        /***/ 227:
        /***/ (() => {

// see dirs.js


            /***/
        }),

        /***/ 4177:
        /***/ (() => {

// see dirs.js


            /***/
        }),

        /***/ 8553:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var path = __nccwpck_require__(1017);
            var common = __nccwpck_require__(3687);

            common.register('pwd', _pwd, {
                allowGlobbing: false,
            });

//@
//@ ### pwd()
//@
//@ Returns the current directory.
            function _pwd() {
                var pwd = path.resolve(process.cwd());
                return pwd;
            }

            module.exports = _pwd;


            /***/
        }),

        /***/ 2830:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);

            common.register('rm', _rm, {
                cmdOptions: {
                    'f': 'force',
                    'r': 'recursive',
                    'R': 'recursive',
                },
            });

// Recursively removes 'dir'
// Adapted from https://github.com/ryanmcgrath/wrench-js
//
// Copyright (c) 2010 Ryan McGrath
// Copyright (c) 2012 Artur Adib
//
// Licensed under the MIT License
// http://www.opensource.org/licenses/mit-license.php
            function rmdirSyncRecursive(dir, force, fromSymlink) {
                var files;

                files = fs.readdirSync(dir);

                // Loop through and delete everything in the sub-tree after checking it
                for (var i = 0; i < files.length; i++) {
                    var file = dir + '/' + files[i];
                    var currFile = common.statNoFollowLinks(file);

                    if (currFile.isDirectory()) { // Recursive function back to the beginning
                        rmdirSyncRecursive(file, force);
                    } else { // Assume it's a file - perhaps a try/catch belongs here?
                        if (force || isWriteable(file)) {
                            try {
                                common.unlinkSync(file);
                            } catch (e) {
                                /* istanbul ignore next */
                                common.error('could not remove file (code ' + e.code + '): ' + file, {
                                    continue: true,
                                });
                            }
                        }
                    }
                }

                // if was directory was referenced through a symbolic link,
                // the contents should be removed, but not the directory itself
                if (fromSymlink) return;

                // Now that we know everything in the sub-tree has been deleted, we can delete the main directory.
                // Huzzah for the shopkeep.

                var result;
                try {
                    // Retry on windows, sometimes it takes a little time before all the files in the directory are gone
                    var start = Date.now();

                    // TODO: replace this with a finite loop
                    for (; ;) {
                        try {
                            result = fs.rmdirSync(dir);
                            if (fs.existsSync(dir)) throw { code: 'EAGAIN' };
                            break;
                        } catch (er) {
                            /* istanbul ignore next */
                            // In addition to error codes, also check if the directory still exists and loop again if true
                            if (process.platform === 'win32' && (er.code === 'ENOTEMPTY' || er.code === 'EBUSY' || er.code === 'EPERM' || er.code === 'EAGAIN')) {
                                if (Date.now() - start > 1000) throw er;
                            } else if (er.code === 'ENOENT') {
                                // Directory did not exist, deletion was successful
                                break;
                            } else {
                                throw er;
                            }
                        }
                    }
                } catch (e) {
                    common.error('could not remove directory (code ' + e.code + '): ' + dir, { continue: true });
                }

                return result;
            } // rmdirSyncRecursive

// Hack to determine if file has write permissions for current user
// Avoids having to check user, group, etc, but it's probably slow
            function isWriteable(file) {
                var writePermission = true;
                try {
                    var __fd = fs.openSync(file, 'a');
                    fs.closeSync(__fd);
                } catch (e) {
                    writePermission = false;
                }

                return writePermission;
            }

            function handleFile(file, options) {
                if (options.force || isWriteable(file)) {
                    // -f was passed, or file is writable, so it can be removed
                    common.unlinkSync(file);
                } else {
                    common.error('permission denied: ' + file, { continue: true });
                }
            }

            function handleDirectory(file, options) {
                if (options.recursive) {
                    // -r was passed, so directory can be removed
                    rmdirSyncRecursive(file, options.force);
                } else {
                    common.error('path is a directory', { continue: true });
                }
            }

            function handleSymbolicLink(file, options) {
                var stats;
                try {
                    stats = common.statFollowLinks(file);
                } catch (e) {
                    // symlink is broken, so remove the symlink itself
                    common.unlinkSync(file);
                    return;
                }

                if (stats.isFile()) {
                    common.unlinkSync(file);
                } else if (stats.isDirectory()) {
                    if (file[file.length - 1] === '/') {
                        // trailing separator, so remove the contents, not the link
                        if (options.recursive) {
                            // -r was passed, so directory can be removed
                            var fromSymlink = true;
                            rmdirSyncRecursive(file, options.force, fromSymlink);
                        } else {
                            common.error('path is a directory', { continue: true });
                        }
                    } else {
                        // no trailing separator, so remove the link
                        common.unlinkSync(file);
                    }
                }
            }

            function handleFIFO(file) {
                common.unlinkSync(file);
            }

//@
//@ ### rm([options,] file [, file ...])
//@ ### rm([options,] file_array)
//@
//@ Available options:
//@
//@ + `-f`: force
//@ + `-r, -R`: recursive
//@
//@ Examples:
//@
//@ ```javascript
//@ rm('-rf', '/tmp/*');
//@ rm('some_file.txt', 'another_file.txt');
//@ rm(['some_file.txt', 'another_file.txt']); // same as above
//@ ```
//@
//@ Removes files.
            function _rm(options, files) {
                if (!files) common.error('no paths given');

                // Convert to array
                files = [].slice.call(arguments, 1);

                files.forEach(function(file) {
                    var lstats;
                    try {
                        var filepath = (file[file.length - 1] === '/')
                          ? file.slice(0, -1) // remove the '/' so lstatSync can detect symlinks
                          : file;
                        lstats = common.statNoFollowLinks(filepath); // test for existence
                    } catch (e) {
                        // Path does not exist, no force flag given
                        if (!options.force) {
                            common.error('no such file or directory: ' + file, { continue: true });
                        }
                        return; // skip file
                    }

                    // If here, path exists
                    if (lstats.isFile()) {
                        handleFile(file, options);
                    } else if (lstats.isDirectory()) {
                        handleDirectory(file, options);
                    } else if (lstats.isSymbolicLink()) {
                        handleSymbolicLink(file, options);
                    } else if (lstats.isFIFO()) {
                        handleFIFO(file);
                    }
                }); // forEach(file)
                return '';
            } // rm
            module.exports = _rm;


            /***/
        }),

        /***/ 5899:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);

            common.register('sed', _sed, {
                globStart: 3, // don't glob-expand regexes
                canReceivePipe: true,
                cmdOptions: {
                    'i': 'inplace',
                },
            });

//@
//@ ### sed([options,] search_regex, replacement, file [, file ...])
//@ ### sed([options,] search_regex, replacement, file_array)
//@
//@ Available options:
//@
//@ + `-i`: Replace contents of `file` in-place. _Note that no backups will be created!_
//@
//@ Examples:
//@
//@ ```javascript
//@ sed('-i', 'PROGRAM_VERSION', 'v0.1.3', 'source.js');
//@ sed(/.*DELETE_THIS_LINE.*\n/, '', 'source.js');
//@ ```
//@
//@ Reads an input string from `file`s, and performs a JavaScript `replace()` on the input
//@ using the given `search_regex` and `replacement` string or function. Returns the new string after replacement.
//@
//@ Note:
//@
//@ Like unix `sed`, ShellJS `sed` supports capture groups. Capture groups are specified
//@ using the `$n` syntax:
//@
//@ ```javascript
//@ sed(/(\w+)\s(\w+)/, '$2, $1', 'file.txt');
//@ ```
            function _sed(options, regex, replacement, files) {
                // Check if this is coming from a pipe
                var pipe = common.readFromPipe();

                if (typeof replacement !== 'string' && typeof replacement !== 'function') {
                    if (typeof replacement === 'number') {
                        replacement = replacement.toString(); // fallback
                    } else {
                        common.error('invalid replacement string');
                    }
                }

                // Convert all search strings to RegExp
                if (typeof regex === 'string') {
                    regex = RegExp(regex);
                }

                if (!files && !pipe) {
                    common.error('no files given');
                }

                files = [].slice.call(arguments, 3);

                if (pipe) {
                    files.unshift('-');
                }

                var sed = [];
                files.forEach(function(file) {
                    if (!fs.existsSync(file) && file !== '-') {
                        common.error('no such file or directory: ' + file, 2, { continue: true });
                        return;
                    }

                    var contents = file === '-' ? pipe : fs.readFileSync(file, 'utf8');
                    var lines = contents.split('\n');
                    var result = lines.map(function(line) {
                        return line.replace(regex, replacement);
                    }).join('\n');

                    sed.push(result);

                    if (options.inplace) {
                        fs.writeFileSync(file, result, 'utf8');
                    }
                });

                return sed.join('\n');
            }

            module.exports = _sed;


            /***/
        }),

        /***/ 1411:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);

            common.register('set', _set, {
                allowGlobbing: false,
                wrapOutput: false,
            });

//@
//@ ### set(options)
//@
//@ Available options:
//@
//@ + `+/-e`: exit upon error (`config.fatal`)
//@ + `+/-v`: verbose: show all commands (`config.verbose`)
//@ + `+/-f`: disable filename expansion (globbing)
//@
//@ Examples:
//@
//@ ```javascript
//@ set('-e'); // exit upon first error
//@ set('+e'); // this undoes a "set('-e')"
//@ ```
//@
//@ Sets global configuration variables.
            function _set(options) {
                if (!options) {
                    var args = [].slice.call(arguments, 0);
                    if (args.length < 2) common.error('must provide an argument');
                    options = args[1];
                }
                var negate = (options[0] === '+');
                if (negate) {
                    options = '-' + options.slice(1); // parseOptions needs a '-' prefix
                }
                options = common.parseOptions(options, {
                    'e': 'fatal',
                    'v': 'verbose',
                    'f': 'noglob',
                });

                if (negate) {
                    Object.keys(options).forEach(function(key) {
                        options[key] = !options[key];
                    });
                }

                Object.keys(options).forEach(function(key) {
                    // Only change the global config if `negate` is false and the option is true
                    // or if `negate` is true and the option is false (aka negate !== option)
                    if (negate !== options[key]) {
                        common.config[key] = options[key];
                    }
                });
                return;
            }

            module.exports = _set;


            /***/
        }),

        /***/ 2116:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);

            common.register('sort', _sort, {
                canReceivePipe: true,
                cmdOptions: {
                    'r': 'reverse',
                    'n': 'numerical',
                },
            });

// parse out the number prefix of a line
            function parseNumber(str) {
                var match = str.match(/^\s*(\d*)\s*(.*)$/);
                return { num: Number(match[1]), value: match[2] };
            }

// compare two strings case-insensitively, but examine case for strings that are
// case-insensitive equivalent
            function unixCmp(a, b) {
                var aLower = a.toLowerCase();
                var bLower = b.toLowerCase();
                return (aLower === bLower ?
                  -1 * a.localeCompare(b) : // unix sort treats case opposite how javascript does
                  aLower.localeCompare(bLower));
            }

// compare two strings in the fashion that unix sort's -n option works
            function numericalCmp(a, b) {
                var objA = parseNumber(a);
                var objB = parseNumber(b);
                if (objA.hasOwnProperty('num') && objB.hasOwnProperty('num')) {
                    return ((objA.num !== objB.num) ?
                      (objA.num - objB.num) :
                      unixCmp(objA.value, objB.value));
                } else {
                    return unixCmp(objA.value, objB.value);
                }
            }

//@
//@ ### sort([options,] file [, file ...])
//@ ### sort([options,] file_array)
//@
//@ Available options:
//@
//@ + `-r`: Reverse the results
//@ + `-n`: Compare according to numerical value
//@
//@ Examples:
//@
//@ ```javascript
//@ sort('foo.txt', 'bar.txt');
//@ sort('-r', 'foo.txt');
//@ ```
//@
//@ Return the contents of the `file`s, sorted line-by-line. Sorting multiple
//@ files mixes their content (just as unix `sort` does).
            function _sort(options, files) {
                // Check if this is coming from a pipe
                var pipe = common.readFromPipe();

                if (!files && !pipe) common.error('no files given');

                files = [].slice.call(arguments, 1);

                if (pipe) {
                    files.unshift('-');
                }

                var lines = files.reduce(function(accum, file) {
                    if (file !== '-') {
                        if (!fs.existsSync(file)) {
                            common.error('no such file or directory: ' + file, { continue: true });
                            return accum;
                        } else if (common.statFollowLinks(file).isDirectory()) {
                            common.error('read failed: ' + file + ': Is a directory', {
                                continue: true,
                            });
                            return accum;
                        }
                    }

                    var contents = file === '-' ? pipe : fs.readFileSync(file, 'utf8');
                    return accum.concat(contents.trimRight().split('\n'));
                }, []);

                var sorted = lines.sort(options.numerical ? numericalCmp : unixCmp);

                if (options.reverse) {
                    sorted = sorted.reverse();
                }

                return sorted.join('\n') + '\n';
            }

            module.exports = _sort;


            /***/
        }),

        /***/ 2284:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);

            common.register('tail', _tail, {
                canReceivePipe: true,
                cmdOptions: {
                    'n': 'numLines',
                },
            });

//@
//@ ### tail([{'-n': \<num\>},] file [, file ...])
//@ ### tail([{'-n': \<num\>},] file_array)
//@
//@ Available options:
//@
//@ + `-n <num>`: Show the last `<num>` lines of `file`s
//@
//@ Examples:
//@
//@ ```javascript
//@ var str = tail({'-n': 1}, 'file*.txt');
//@ var str = tail('file1', 'file2');
//@ var str = tail(['file1', 'file2']); // same as above
//@ ```
//@
//@ Read the end of a `file`.
            function _tail(options, files) {
                var tail = [];
                var pipe = common.readFromPipe();

                if (!files && !pipe) common.error('no paths given');

                var idx = 1;
                if (options.numLines === true) {
                    idx = 2;
                    options.numLines = Number(arguments[1]);
                } else if (options.numLines === false) {
                    options.numLines = 10;
                }
                options.numLines = -1 * Math.abs(options.numLines);
                files = [].slice.call(arguments, idx);

                if (pipe) {
                    files.unshift('-');
                }

                var shouldAppendNewline = false;
                files.forEach(function(file) {
                    if (file !== '-') {
                        if (!fs.existsSync(file)) {
                            common.error('no such file or directory: ' + file, { continue: true });
                            return;
                        } else if (common.statFollowLinks(file).isDirectory()) {
                            common.error("error reading '" + file + "': Is a directory", {
                                continue: true,
                            });
                            return;
                        }
                    }

                    var contents = file === '-' ? pipe : fs.readFileSync(file, 'utf8');

                    var lines = contents.split('\n');
                    if (lines[lines.length - 1] === '') {
                        lines.pop();
                        shouldAppendNewline = true;
                    } else {
                        shouldAppendNewline = false;
                    }

                    tail = tail.concat(lines.slice(options.numLines));
                });

                if (shouldAppendNewline) {
                    tail.push(''); // to add a trailing newline once we join
                }
                return tail.join('\n');
            }

            module.exports = _tail;


            /***/
        }),

        /***/ 6150:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var os = __nccwpck_require__(2037);
            var fs = __nccwpck_require__(7147);

            common.register('tempdir', _tempDir, {
                allowGlobbing: false,
                wrapOutput: false,
            });

// Returns false if 'dir' is not a writeable directory, 'dir' otherwise
            function writeableDir(dir) {
                if (!dir || !fs.existsSync(dir)) return false;

                if (!common.statFollowLinks(dir).isDirectory()) return false;

                var testFile = dir + '/' + common.randomFileName();
                try {
                    fs.writeFileSync(testFile, ' ');
                    common.unlinkSync(testFile);
                    return dir;
                } catch (e) {
                    /* istanbul ignore next */
                    return false;
                }
            }

// Variable to cache the tempdir value for successive lookups.
            var cachedTempDir;

//@
//@ ### tempdir()
//@
//@ Examples:
//@
//@ ```javascript
//@ var tmp = tempdir(); // "/tmp" for most *nix platforms
//@ ```
//@
//@ Searches and returns string containing a writeable, platform-dependent temporary directory.
//@ Follows Python's [tempfile algorithm](http://docs.python.org/library/tempfile.html#tempfile.tempdir).
            function _tempDir() {
                if (cachedTempDir) return cachedTempDir;

                cachedTempDir = writeableDir(os.tmpdir()) ||
                  writeableDir(process.env.TMPDIR) ||
                  writeableDir(process.env.TEMP) ||
                  writeableDir(process.env.TMP) ||
                  writeableDir(process.env.Wimp$ScrapDir) || // RiscOS
                  writeableDir('C:\\TEMP') || // Windows
                  writeableDir('C:\\TMP') || // Windows
                  writeableDir('\\TEMP') || // Windows
                  writeableDir('\\TMP') || // Windows
                  writeableDir('/tmp') ||
                  writeableDir('/var/tmp') ||
                  writeableDir('/usr/tmp') ||
                  writeableDir('.'); // last resort

                return cachedTempDir;
            }

// Indicates if the tempdir value is currently cached. This is exposed for tests
// only. The return value should only be tested for truthiness.
            function isCached() {
                return cachedTempDir;
            }

// Clears the cached tempDir value, if one is cached. This is exposed for tests
// only.
            function clearCache() {
                cachedTempDir = undefined;
            }

            module.exports.tempDir = _tempDir;
            module.exports.isCached = isCached;
            module.exports.clearCache = clearCache;


            /***/
        }),

        /***/ 9723:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);

            common.register('test', _test, {
                cmdOptions: {
                    'b': 'block',
                    'c': 'character',
                    'd': 'directory',
                    'e': 'exists',
                    'f': 'file',
                    'L': 'link',
                    'p': 'pipe',
                    'S': 'socket',
                },
                wrapOutput: false,
                allowGlobbing: false,
            });


//@
//@ ### test(expression)
//@
//@ Available expression primaries:
//@
//@ + `'-b', 'path'`: true if path is a block device
//@ + `'-c', 'path'`: true if path is a character device
//@ + `'-d', 'path'`: true if path is a directory
//@ + `'-e', 'path'`: true if path exists
//@ + `'-f', 'path'`: true if path is a regular file
//@ + `'-L', 'path'`: true if path is a symbolic link
//@ + `'-p', 'path'`: true if path is a pipe (FIFO)
//@ + `'-S', 'path'`: true if path is a socket
//@
//@ Examples:
//@
//@ ```javascript
//@ if (test('-d', path)) { /* do something with dir */ };
//@ if (!test('-f', path)) continue; // skip if it's a regular file
//@ ```
//@
//@ Evaluates `expression` using the available primaries and returns corresponding value.
            function _test(options, path) {
                if (!path) common.error('no path given');

                var canInterpret = false;
                Object.keys(options).forEach(function(key) {
                    if (options[key] === true) {
                        canInterpret = true;
                    }
                });

                if (!canInterpret) common.error('could not interpret expression');

                if (options.link) {
                    try {
                        return common.statNoFollowLinks(path).isSymbolicLink();
                    } catch (e) {
                        return false;
                    }
                }

                if (!fs.existsSync(path)) return false;

                if (options.exists) return true;

                var stats = common.statFollowLinks(path);

                if (options.block) return stats.isBlockDevice();

                if (options.character) return stats.isCharacterDevice();

                if (options.directory) return stats.isDirectory();

                if (options.file) return stats.isFile();

                /* istanbul ignore next */
                if (options.pipe) return stats.isFIFO();

                /* istanbul ignore next */
                if (options.socket) return stats.isSocket();

                /* istanbul ignore next */
                return false; // fallback
            } // test
            module.exports = _test;


            /***/
        }),

        /***/ 1961:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);
            var path = __nccwpck_require__(1017);

            common.register('to', _to, {
                pipeOnly: true,
                wrapOutput: false,
            });

//@
//@ ### ShellString.prototype.to(file)
//@
//@ Examples:
//@
//@ ```javascript
//@ cat('input.txt').to('output.txt');
//@ ```
//@
//@ Analogous to the redirection operator `>` in Unix, but works with
//@ `ShellStrings` (such as those returned by `cat`, `grep`, etc.). _Like Unix
//@ redirections, `to()` will overwrite any existing file!_
            function _to(options, file) {
                if (!file) common.error('wrong arguments');

                if (!fs.existsSync(path.dirname(file))) {
                    common.error('no such file or directory: ' + path.dirname(file));
                }

                try {
                    fs.writeFileSync(file, this.stdout || this.toString(), 'utf8');
                    return this;
                } catch (e) {
                    /* istanbul ignore next */
                    common.error('could not write to file (code ' + e.code + '): ' + file, { continue: true });
                }
            }

            module.exports = _to;


            /***/
        }),

        /***/ 3736:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);
            var path = __nccwpck_require__(1017);

            common.register('toEnd', _toEnd, {
                pipeOnly: true,
                wrapOutput: false,
            });

//@
//@ ### ShellString.prototype.toEnd(file)
//@
//@ Examples:
//@
//@ ```javascript
//@ cat('input.txt').toEnd('output.txt');
//@ ```
//@
//@ Analogous to the redirect-and-append operator `>>` in Unix, but works with
//@ `ShellStrings` (such as those returned by `cat`, `grep`, etc.).
            function _toEnd(options, file) {
                if (!file) common.error('wrong arguments');

                if (!fs.existsSync(path.dirname(file))) {
                    common.error('no such file or directory: ' + path.dirname(file));
                }

                try {
                    fs.appendFileSync(file, this.stdout || this.toString(), 'utf8');
                    return this;
                } catch (e) {
                    /* istanbul ignore next */
                    common.error('could not append to file (code ' + e.code + '): ' + file, { continue: true });
                }
            }

            module.exports = _toEnd;


            /***/
        }),

        /***/ 8358:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);

            common.register('touch', _touch, {
                cmdOptions: {
                    'a': 'atime_only',
                    'c': 'no_create',
                    'd': 'date',
                    'm': 'mtime_only',
                    'r': 'reference',
                },
            });

//@
//@ ### touch([options,] file [, file ...])
//@ ### touch([options,] file_array)
//@
//@ Available options:
//@
//@ + `-a`: Change only the access time
//@ + `-c`: Do not create any files
//@ + `-m`: Change only the modification time
//@ + `-d DATE`: Parse `DATE` and use it instead of current time
//@ + `-r FILE`: Use `FILE`'s times instead of current time
//@
//@ Examples:
//@
//@ ```javascript
//@ touch('source.js');
//@ touch('-c', '/path/to/some/dir/source.js');
//@ touch({ '-r': FILE }, '/path/to/some/dir/source.js');
//@ ```
//@
//@ Update the access and modification times of each `FILE` to the current time.
//@ A `FILE` argument that does not exist is created empty, unless `-c` is supplied.
//@ This is a partial implementation of [`touch(1)`](http://linux.die.net/man/1/touch).
            function _touch(opts, files) {
                if (!files) {
                    common.error('no files given');
                } else if (typeof files === 'string') {
                    files = [].slice.call(arguments, 1);
                } else {
                    common.error('file arg should be a string file path or an Array of string file paths');
                }

                files.forEach(function(f) {
                    touchFile(opts, f);
                });
                return '';
            }

            function touchFile(opts, file) {
                var stat = tryStatFile(file);

                if (stat && stat.isDirectory()) {
                    // don't error just exit
                    return;
                }

                // if the file doesn't already exist and the user has specified --no-create then
                // this script is finished
                if (!stat && opts.no_create) {
                    return;
                }

                // open the file and then close it. this will create it if it doesn't exist but will
                // not truncate the file
                fs.closeSync(fs.openSync(file, 'a'));

                //
                // Set timestamps
                //

                // setup some defaults
                var now = new Date();
                var mtime = opts.date || now;
                var atime = opts.date || now;

                // use reference file
                if (opts.reference) {
                    var refStat = tryStatFile(opts.reference);
                    if (!refStat) {
                        common.error('failed to get attributess of ' + opts.reference);
                    }
                    mtime = refStat.mtime;
                    atime = refStat.atime;
                } else if (opts.date) {
                    mtime = opts.date;
                    atime = opts.date;
                }

                if (opts.atime_only && opts.mtime_only) {
                    // keep the new values of mtime and atime like GNU
                } else if (opts.atime_only) {
                    mtime = stat.mtime;
                } else if (opts.mtime_only) {
                    atime = stat.atime;
                }

                fs.utimesSync(file, atime, mtime);
            }

            module.exports = _touch;

            function tryStatFile(filePath) {
                try {
                    return common.statFollowLinks(filePath);
                } catch (e) {
                    return null;
                }
            }


            /***/
        }),

        /***/ 7286:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);

// add c spaces to the left of str
            function lpad(c, str) {
                var res = '' + str;
                if (res.length < c) {
                    res = Array((c - res.length) + 1).join(' ') + res;
                }
                return res;
            }

            common.register('uniq', _uniq, {
                canReceivePipe: true,
                cmdOptions: {
                    'i': 'ignoreCase',
                    'c': 'count',
                    'd': 'duplicates',
                },
            });

//@
//@ ### uniq([options,] [input, [output]])
//@
//@ Available options:
//@
//@ + `-i`: Ignore case while comparing
//@ + `-c`: Prefix lines by the number of occurrences
//@ + `-d`: Only print duplicate lines, one for each group of identical lines
//@
//@ Examples:
//@
//@ ```javascript
//@ uniq('foo.txt');
//@ uniq('-i', 'foo.txt');
//@ uniq('-cd', 'foo.txt', 'bar.txt');
//@ ```
//@
//@ Filter adjacent matching lines from `input`.
            function _uniq(options, input, output) {
                // Check if this is coming from a pipe
                var pipe = common.readFromPipe();

                if (!pipe) {
                    if (!input) common.error('no input given');

                    if (!fs.existsSync(input)) {
                        common.error(input + ': No such file or directory');
                    } else if (common.statFollowLinks(input).isDirectory()) {
                        common.error("error reading '" + input + "'");
                    }
                }
                if (output && fs.existsSync(output) && common.statFollowLinks(output).isDirectory()) {
                    common.error(output + ': Is a directory');
                }

                var lines = (input ? fs.readFileSync(input, 'utf8') : pipe).trimRight().split('\n');

                var compare = function(a, b) {
                    return options.ignoreCase ?
                      a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()) :
                      a.localeCompare(b);
                };
                var uniqed = lines.reduceRight(function(res, e) {
                    // Perform uniq -c on the input
                    if (res.length === 0) {
                        return [{ count: 1, ln: e }];
                    } else if (compare(res[0].ln, e) === 0) {
                        return [{ count: res[0].count + 1, ln: e }].concat(res.slice(1));
                    } else {
                        return [{ count: 1, ln: e }].concat(res);
                    }
                }, []).filter(function(obj) {
                    // Do we want only duplicated objects?
                    return options.duplicates ? obj.count > 1 : true;
                }).map(function(obj) {
                    // Are we tracking the counts of each line?
                    return (options.count ? (lpad(7, obj.count) + ' ') : '') + obj.ln;
                }).join('\n') + '\n';

                if (output) {
                    (new common.ShellString(uniqed)).to(output);
                    // if uniq writes to output, nothing is passed to the next command in the pipeline (if any)
                    return '';
                } else {
                    return uniqed;
                }
            }

            module.exports = _uniq;


            /***/
        }),

        /***/ 4766:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            var common = __nccwpck_require__(3687);
            var fs = __nccwpck_require__(7147);
            var path = __nccwpck_require__(1017);

            common.register('which', _which, {
                allowGlobbing: false,
                cmdOptions: {
                    'a': 'all',
                },
            });

// XP's system default value for `PATHEXT` system variable, just in case it's not
// set on Windows.
            var XP_DEFAULT_PATHEXT = '.com;.exe;.bat;.cmd;.vbs;.vbe;.js;.jse;.wsf;.wsh';

// For earlier versions of NodeJS that doesn't have a list of constants (< v6)
            var FILE_EXECUTABLE_MODE = 1;

            function isWindowsPlatform() {
                return process.platform === 'win32';
            }

// Cross-platform method for splitting environment `PATH` variables
            function splitPath(p) {
                return p ? p.split(path.delimiter) : [];
            }

// Tests are running all cases for this func but it stays uncovered by codecov due to unknown reason
            /* istanbul ignore next */
            function isExecutable(pathName) {
                try {
                    // TODO(node-support): replace with fs.constants.X_OK once remove support for node < v6
                    fs.accessSync(pathName, FILE_EXECUTABLE_MODE);
                } catch (err) {
                    return false;
                }
                return true;
            }

            function checkPath(pathName) {
                return fs.existsSync(pathName) && !common.statFollowLinks(pathName).isDirectory()
                  && (isWindowsPlatform() || isExecutable(pathName));
            }

//@
//@ ### which(command)
//@
//@ Examples:
//@
//@ ```javascript
//@ var nodeExec = which('node');
//@ ```
//@
//@ Searches for `command` in the system's `PATH`. On Windows, this uses the
//@ `PATHEXT` variable to append the extension if it's not already executable.
//@ Returns string containing the absolute path to `command`.
            function _which(options, cmd) {
                if (!cmd) common.error('must specify command');

                var isWindows = isWindowsPlatform();
                var pathArray = splitPath(process.env.PATH);

                var queryMatches = [];

                // No relative/absolute paths provided?
                if (cmd.indexOf('/') === -1) {
                    // Assume that there are no extensions to append to queries (this is the
                    // case for unix)
                    var pathExtArray = [''];
                    if (isWindows) {
                        // In case the PATHEXT variable is somehow not set (e.g.
                        // child_process.spawn with an empty environment), use the XP default.
                        var pathExtEnv = process.env.PATHEXT || XP_DEFAULT_PATHEXT;
                        pathExtArray = splitPath(pathExtEnv.toUpperCase());
                    }

                    // Search for command in PATH
                    for (var k = 0; k < pathArray.length; k++) {
                        // already found it
                        if (queryMatches.length > 0 && !options.all) break;

                        var attempt = path.resolve(pathArray[k], cmd);

                        if (isWindows) {
                            attempt = attempt.toUpperCase();
                        }

                        var match = attempt.match(/\.[^<>:"/\|?*.]+$/);
                        if (match && pathExtArray.indexOf(match[0]) >= 0) { // this is Windows-only
                            // The user typed a query with the file extension, like
                            // `which('node.exe')`
                            if (checkPath(attempt)) {
                                queryMatches.push(attempt);
                                break;
                            }
                        } else { // All-platforms
                            // Cycle through the PATHEXT array, and check each extension
                            // Note: the array is always [''] on Unix
                            for (var i = 0; i < pathExtArray.length; i++) {
                                var ext = pathExtArray[i];
                                var newAttempt = attempt + ext;
                                if (checkPath(newAttempt)) {
                                    queryMatches.push(newAttempt);
                                    break;
                                }
                            }
                        }
                    }
                } else if (checkPath(cmd)) { // a valid absolute or relative path
                    queryMatches.push(path.resolve(cmd));
                }

                if (queryMatches.length > 0) {
                    return options.all ? queryMatches : queryMatches[0];
                }
                return options.all ? [] : null;
            }

            module.exports = _which;


            /***/
        }),

        /***/ 4294:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            module.exports = __nccwpck_require__(4219);


            /***/
        }),

        /***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


            var net = __nccwpck_require__(1808);
            var tls = __nccwpck_require__(4404);
            var http = __nccwpck_require__(3685);
            var https = __nccwpck_require__(5687);
            var events = __nccwpck_require__(2361);
            var assert = __nccwpck_require__(9491);
            var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

        /***/ 4338:
        /***/ ((module) => {

            module.exports = /[\0-\x1F\x7F-\x9F]/

            /***/
        }),

        /***/ 6149:
        /***/ ((module) => {

            module.exports = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/

            /***/
        }),

        /***/ 8019:
        /***/ ((module) => {

            module.exports = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/

            /***/
        }),

        /***/ 8810:
        /***/ ((module) => {

            module.exports = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/

            /***/
        }),

        /***/ 5649:
        /***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

            "use strict";


            exports.Any = __nccwpck_require__(703);
            exports.Cc = __nccwpck_require__(4338);
            exports.Cf = __nccwpck_require__(6149);
            exports.P = __nccwpck_require__(8019);
            exports.Z = __nccwpck_require__(8810);


            /***/
        }),

        /***/ 703:
        /***/ ((module) => {

            module.exports = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/

            /***/
        }),

        /***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

            var _v = _interopRequireDefault(__nccwpck_require__(8628));

            var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

            var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

            var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

            var _nil = _interopRequireDefault(__nccwpck_require__(5332));

            var _version = _interopRequireDefault(__nccwpck_require__(1595));

            var _validate = _interopRequireDefault(__nccwpck_require__(6900));

            var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

            var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

        /***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

            var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

        /***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

        /***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

            var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

            var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

        /***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

            var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

        /***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

            var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

        /***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

            var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

        /***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

            var _v = _interopRequireDefault(__nccwpck_require__(5998));

            var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

        /***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

            var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

            var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

        /***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

            var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

        /***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

            var _v = _interopRequireDefault(__nccwpck_require__(5998));

            var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

        /***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

        /***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

            var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

            /***/
        }),

        /***/ 2940:
        /***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
            module.exports = wrappy

            function wrappy(fn, cb) {
                if (fn && cb) return wrappy(fn)(cb)

                if (typeof fn !== 'function')
                    throw new TypeError('need wrapper function')

                Object.keys(fn).forEach(function(k) {
                    wrapper[k] = fn[k]
                })

                return wrapper

                function wrapper() {
                    var args = new Array(arguments.length)
                    for (var i = 0; i < args.length; i++) {
                        args[i] = arguments[i]
                    }
                    var ret = fn.apply(this, args)
                    var cb = args[args.length - 1]
                    if (typeof ret === 'function' && ret !== cb) {
                        Object.keys(cb).forEach(function(k) {
                            ret[k] = cb[k]
                        })
                    }
                    return ret
                }
            }


/***/ }),

        /***/ 221:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            const MarkdownIt = __nccwpck_require__(8561)
            const markdownItTable = __nccwpck_require__(5552)
            const md = new MarkdownIt().use(markdownItTable)

            function extract(data, outputType) {
                const rows = []
                let numOfMergedPR = 0
                let numOfHotfix = 0
                let idx = 0
                for (const commit of data.commits) {
                    const isMergePRCommit =
                      commit.messageHeadline.includes('Merge pull request')
                    if (isMergePRCommit) {
                        const prNumber = commit.messageHeadline.split(' ')[3]
                        idx++
                        numOfMergedPR++

                        const authorLogins = getAuthors(commit.authors)
                        rows.push([
                            idx.toString(),
                            prNumber,
                            removeAllFirstEmptyLines(
                              removeAllLinesStartsWith(commit.messageBody, '…')
                            ).replace(/\n/g, '<br/>'),
                            authorLogins,
                            commit.authoredDate
                        ])
                    }

                    const isHotfixCommit = replaceAllNoneAlphanumeric(
                      commit.messageHeadline.toLowerCase()
                    ).includes('hotfix')
                    if (!isMergePRCommit && isHotfixCommit) {
                        const prNumber = `[hotfix]<br/>${commit.oid}`
                        idx++
                        numOfHotfix++

                        const authorLogins = getAuthors(commit.authors)
                        rows.push([
                            idx.toString(),
                            prNumber,
                            commit.messageHeadline,
                            authorLogins,
                            commit.authoredDate
                        ])
                    }
                }

                const MD = `| No. | PR | Title | By | Date |\n|-----|----|-------|----|------|\n${rows
                  .map(row => `| ${row.join(' | ')} |`)
                  .join('\n')}`

                const HTML = md.render(MD).replace(/\n/g, '')

                switch (outputType) {
                    case 'markdown':
                    case 'md':
                        return MD
                    case 'html':
                        return HTML
                    case 'json':
                    case 'rows':
                        return rows
                    default:
                        return {
                            rows,
                            numOfMergedPR,
                            numOfHotfix,
                            md: MD,
                            html: HTML
                        }
                }
            }

            function replaceAllNoneAlphanumeric(str) {
                return str.replace(/[^a-zA-Z0-9]+/g, '')
            }

            function getAuthors(authors) {
                return authors.map(author => author.login).join(', ')
            }

            function removeAllLinesStartsWith(str, withStr = '...') {
                return str
                  .split('\n')
                  .filter(line => !line.startsWith(withStr))
                  .join('\n')
            }

            function removeAllFirstEmptyLines(str) {
                return str
                  .split('\n')
                  .filter(line => line.trim() !== '')
                  .join('\n')
            }

            module.exports = {
                extract
            }


            /***/
        }),

        /***/ 1713:
        /***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

            const core = __nccwpck_require__(2186)
            const { extract } = __nccwpck_require__(221)

            const shell = __nccwpck_require__(3516)
            const { query } = __nccwpck_require__(943)

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */

const ValidOutputTypes = ['md', 'markdown', 'html', 'rows', 'json']

async function run() {
  try {
    const owner = core.getInput('owner')
    const repo = core.getInput('repo')
    const pr = core.getInput('pr')
      const outType = core.getInput('output-type') || 'md'

    // check outType
    if (!ValidOutputTypes.includes(outType)) {
      core.setFailed(
        `output-type ${outType} is not valid, must be one of ${ValidOutputTypes}`
      )
      return
    }

      core.info(`--> extracting pr changes for ${owner}/${repo}#${pr}`)
      core.info(`--> output type: ${outType}`)

      const commitsOutput = shell.exec(fetchCommitsSh({ owner, repo, pr }))

      if (commitsOutput.stdout && !commitsOutput.stderr) {
          const extracted = extract(JSON.parse(commitsOutput.stdout), outType)
          core.setOutput('value', extracted)
          core.info('outputs.value set to:')
          core.info(extracted)
      }
      if (commitsOutput.stderr) {
          core.error('---> error: ↓↓↓↓↓')
          core.error(commitsOutput.stderr)
      }
  } catch (err) {
    core.setFailed(err.message)
  }
}

            const fetchCommitsSh = ({ owner, repo, pr }) =>
              `GH_CMD=$(which gh)
$GH_CMD api graphql \\
-f query="${query}" \\
-F owner="${owner}" \\
-F repo="${repo}" \\
-F pr="${pr}" \\
--paginate \\
--jq '.data.repository.pullRequest.commits.nodes | map(.commit) | map({oid, authoredDate, committedDate, messageBody, messageHeadline, authors: .authors.nodes | map({name, login: .user.login})})' | \\
jq -s 'flatten' | \\
jq '{ commits: .}' -r
`

            module.exports = {
                run
            }


            /***/
        }),

        /***/ 943:
        /***/ ((module) => {

            function queryFn() {
                return `query ($owner: String!, $repo: String!, $pr: Int!, $endCursor: String) {
    repository(owner: $owner, name: $repo) {
        pullRequest(number: $pr) {
            commits(first: 100, after: $endCursor) {
                totalCount
                pageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                    hasPreviousPage
                }
                nodes {
                    commit {
                        authoredDate
                        authors(last: 2) {
                            nodes {
                                name
                                user {
                                    login
                                }
                            }
                        }
                        committedDate
                        messageBody
                        messageHeadline
                        oid
                    }
                }
            }
        }
    }
}`.replace(/\s+/g, ' ') // replace all multi spaces with single space
            }

module.exports = {
    query: queryFn()
}


/***/ }),

        /***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

        /***/ 2081:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

        /***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

        /***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

        /***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

        /***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

        /***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

        /***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

        /***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

        /***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

        /***/ 5477:
        /***/ ((module) => {

            "use strict";
            module.exports = require("punycode");

/***/ }),

        /***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

        /***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

            /***/
        }),

        /***/ 9323:
        /***/ ((module) => {

            "use strict";
            module.exports = JSON.parse('{"Aacute":"Á","aacute":"á","Abreve":"Ă","abreve":"ă","ac":"∾","acd":"∿","acE":"∾̳","Acirc":"Â","acirc":"â","acute":"´","Acy":"А","acy":"а","AElig":"Æ","aelig":"æ","af":"⁡","Afr":"𝔄","afr":"𝔞","Agrave":"À","agrave":"à","alefsym":"ℵ","aleph":"ℵ","Alpha":"Α","alpha":"α","Amacr":"Ā","amacr":"ā","amalg":"⨿","amp":"&","AMP":"&","andand":"⩕","And":"⩓","and":"∧","andd":"⩜","andslope":"⩘","andv":"⩚","ang":"∠","ange":"⦤","angle":"∠","angmsdaa":"⦨","angmsdab":"⦩","angmsdac":"⦪","angmsdad":"⦫","angmsdae":"⦬","angmsdaf":"⦭","angmsdag":"⦮","angmsdah":"⦯","angmsd":"∡","angrt":"∟","angrtvb":"⊾","angrtvbd":"⦝","angsph":"∢","angst":"Å","angzarr":"⍼","Aogon":"Ą","aogon":"ą","Aopf":"𝔸","aopf":"𝕒","apacir":"⩯","ap":"≈","apE":"⩰","ape":"≊","apid":"≋","apos":"\'","ApplyFunction":"⁡","approx":"≈","approxeq":"≊","Aring":"Å","aring":"å","Ascr":"𝒜","ascr":"𝒶","Assign":"≔","ast":"*","asymp":"≈","asympeq":"≍","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","awconint":"∳","awint":"⨑","backcong":"≌","backepsilon":"϶","backprime":"‵","backsim":"∽","backsimeq":"⋍","Backslash":"∖","Barv":"⫧","barvee":"⊽","barwed":"⌅","Barwed":"⌆","barwedge":"⌅","bbrk":"⎵","bbrktbrk":"⎶","bcong":"≌","Bcy":"Б","bcy":"б","bdquo":"„","becaus":"∵","because":"∵","Because":"∵","bemptyv":"⦰","bepsi":"϶","bernou":"ℬ","Bernoullis":"ℬ","Beta":"Β","beta":"β","beth":"ℶ","between":"≬","Bfr":"𝔅","bfr":"𝔟","bigcap":"⋂","bigcirc":"◯","bigcup":"⋃","bigodot":"⨀","bigoplus":"⨁","bigotimes":"⨂","bigsqcup":"⨆","bigstar":"★","bigtriangledown":"▽","bigtriangleup":"△","biguplus":"⨄","bigvee":"⋁","bigwedge":"⋀","bkarow":"⤍","blacklozenge":"⧫","blacksquare":"▪","blacktriangle":"▴","blacktriangledown":"▾","blacktriangleleft":"◂","blacktriangleright":"▸","blank":"␣","blk12":"▒","blk14":"░","blk34":"▓","block":"█","bne":"=⃥","bnequiv":"≡⃥","bNot":"⫭","bnot":"⌐","Bopf":"𝔹","bopf":"𝕓","bot":"⊥","bottom":"⊥","bowtie":"⋈","boxbox":"⧉","boxdl":"┐","boxdL":"╕","boxDl":"╖","boxDL":"╗","boxdr":"┌","boxdR":"╒","boxDr":"╓","boxDR":"╔","boxh":"─","boxH":"═","boxhd":"┬","boxHd":"╤","boxhD":"╥","boxHD":"╦","boxhu":"┴","boxHu":"╧","boxhU":"╨","boxHU":"╩","boxminus":"⊟","boxplus":"⊞","boxtimes":"⊠","boxul":"┘","boxuL":"╛","boxUl":"╜","boxUL":"╝","boxur":"└","boxuR":"╘","boxUr":"╙","boxUR":"╚","boxv":"│","boxV":"║","boxvh":"┼","boxvH":"╪","boxVh":"╫","boxVH":"╬","boxvl":"┤","boxvL":"╡","boxVl":"╢","boxVL":"╣","boxvr":"├","boxvR":"╞","boxVr":"╟","boxVR":"╠","bprime":"‵","breve":"˘","Breve":"˘","brvbar":"¦","bscr":"𝒷","Bscr":"ℬ","bsemi":"⁏","bsim":"∽","bsime":"⋍","bsolb":"⧅","bsol":"\\\\","bsolhsub":"⟈","bull":"•","bullet":"•","bump":"≎","bumpE":"⪮","bumpe":"≏","Bumpeq":"≎","bumpeq":"≏","Cacute":"Ć","cacute":"ć","capand":"⩄","capbrcup":"⩉","capcap":"⩋","cap":"∩","Cap":"⋒","capcup":"⩇","capdot":"⩀","CapitalDifferentialD":"ⅅ","caps":"∩︀","caret":"⁁","caron":"ˇ","Cayleys":"ℭ","ccaps":"⩍","Ccaron":"Č","ccaron":"č","Ccedil":"Ç","ccedil":"ç","Ccirc":"Ĉ","ccirc":"ĉ","Cconint":"∰","ccups":"⩌","ccupssm":"⩐","Cdot":"Ċ","cdot":"ċ","cedil":"¸","Cedilla":"¸","cemptyv":"⦲","cent":"¢","centerdot":"·","CenterDot":"·","cfr":"𝔠","Cfr":"ℭ","CHcy":"Ч","chcy":"ч","check":"✓","checkmark":"✓","Chi":"Χ","chi":"χ","circ":"ˆ","circeq":"≗","circlearrowleft":"↺","circlearrowright":"↻","circledast":"⊛","circledcirc":"⊚","circleddash":"⊝","CircleDot":"⊙","circledR":"®","circledS":"Ⓢ","CircleMinus":"⊖","CirclePlus":"⊕","CircleTimes":"⊗","cir":"○","cirE":"⧃","cire":"≗","cirfnint":"⨐","cirmid":"⫯","cirscir":"⧂","ClockwiseContourIntegral":"∲","CloseCurlyDoubleQuote":"”","CloseCurlyQuote":"’","clubs":"♣","clubsuit":"♣","colon":":","Colon":"∷","Colone":"⩴","colone":"≔","coloneq":"≔","comma":",","commat":"@","comp":"∁","compfn":"∘","complement":"∁","complexes":"ℂ","cong":"≅","congdot":"⩭","Congruent":"≡","conint":"∮","Conint":"∯","ContourIntegral":"∮","copf":"𝕔","Copf":"ℂ","coprod":"∐","Coproduct":"∐","copy":"©","COPY":"©","copysr":"℗","CounterClockwiseContourIntegral":"∳","crarr":"↵","cross":"✗","Cross":"⨯","Cscr":"𝒞","cscr":"𝒸","csub":"⫏","csube":"⫑","csup":"⫐","csupe":"⫒","ctdot":"⋯","cudarrl":"⤸","cudarrr":"⤵","cuepr":"⋞","cuesc":"⋟","cularr":"↶","cularrp":"⤽","cupbrcap":"⩈","cupcap":"⩆","CupCap":"≍","cup":"∪","Cup":"⋓","cupcup":"⩊","cupdot":"⊍","cupor":"⩅","cups":"∪︀","curarr":"↷","curarrm":"⤼","curlyeqprec":"⋞","curlyeqsucc":"⋟","curlyvee":"⋎","curlywedge":"⋏","curren":"¤","curvearrowleft":"↶","curvearrowright":"↷","cuvee":"⋎","cuwed":"⋏","cwconint":"∲","cwint":"∱","cylcty":"⌭","dagger":"†","Dagger":"‡","daleth":"ℸ","darr":"↓","Darr":"↡","dArr":"⇓","dash":"‐","Dashv":"⫤","dashv":"⊣","dbkarow":"⤏","dblac":"˝","Dcaron":"Ď","dcaron":"ď","Dcy":"Д","dcy":"д","ddagger":"‡","ddarr":"⇊","DD":"ⅅ","dd":"ⅆ","DDotrahd":"⤑","ddotseq":"⩷","deg":"°","Del":"∇","Delta":"Δ","delta":"δ","demptyv":"⦱","dfisht":"⥿","Dfr":"𝔇","dfr":"𝔡","dHar":"⥥","dharl":"⇃","dharr":"⇂","DiacriticalAcute":"´","DiacriticalDot":"˙","DiacriticalDoubleAcute":"˝","DiacriticalGrave":"`","DiacriticalTilde":"˜","diam":"⋄","diamond":"⋄","Diamond":"⋄","diamondsuit":"♦","diams":"♦","die":"¨","DifferentialD":"ⅆ","digamma":"ϝ","disin":"⋲","div":"÷","divide":"÷","divideontimes":"⋇","divonx":"⋇","DJcy":"Ђ","djcy":"ђ","dlcorn":"⌞","dlcrop":"⌍","dollar":"$","Dopf":"𝔻","dopf":"𝕕","Dot":"¨","dot":"˙","DotDot":"⃜","doteq":"≐","doteqdot":"≑","DotEqual":"≐","dotminus":"∸","dotplus":"∔","dotsquare":"⊡","doublebarwedge":"⌆","DoubleContourIntegral":"∯","DoubleDot":"¨","DoubleDownArrow":"⇓","DoubleLeftArrow":"⇐","DoubleLeftRightArrow":"⇔","DoubleLeftTee":"⫤","DoubleLongLeftArrow":"⟸","DoubleLongLeftRightArrow":"⟺","DoubleLongRightArrow":"⟹","DoubleRightArrow":"⇒","DoubleRightTee":"⊨","DoubleUpArrow":"⇑","DoubleUpDownArrow":"⇕","DoubleVerticalBar":"∥","DownArrowBar":"⤓","downarrow":"↓","DownArrow":"↓","Downarrow":"⇓","DownArrowUpArrow":"⇵","DownBreve":"̑","downdownarrows":"⇊","downharpoonleft":"⇃","downharpoonright":"⇂","DownLeftRightVector":"⥐","DownLeftTeeVector":"⥞","DownLeftVectorBar":"⥖","DownLeftVector":"↽","DownRightTeeVector":"⥟","DownRightVectorBar":"⥗","DownRightVector":"⇁","DownTeeArrow":"↧","DownTee":"⊤","drbkarow":"⤐","drcorn":"⌟","drcrop":"⌌","Dscr":"𝒟","dscr":"𝒹","DScy":"Ѕ","dscy":"ѕ","dsol":"⧶","Dstrok":"Đ","dstrok":"đ","dtdot":"⋱","dtri":"▿","dtrif":"▾","duarr":"⇵","duhar":"⥯","dwangle":"⦦","DZcy":"Џ","dzcy":"џ","dzigrarr":"⟿","Eacute":"É","eacute":"é","easter":"⩮","Ecaron":"Ě","ecaron":"ě","Ecirc":"Ê","ecirc":"ê","ecir":"≖","ecolon":"≕","Ecy":"Э","ecy":"э","eDDot":"⩷","Edot":"Ė","edot":"ė","eDot":"≑","ee":"ⅇ","efDot":"≒","Efr":"𝔈","efr":"𝔢","eg":"⪚","Egrave":"È","egrave":"è","egs":"⪖","egsdot":"⪘","el":"⪙","Element":"∈","elinters":"⏧","ell":"ℓ","els":"⪕","elsdot":"⪗","Emacr":"Ē","emacr":"ē","empty":"∅","emptyset":"∅","EmptySmallSquare":"◻","emptyv":"∅","EmptyVerySmallSquare":"▫","emsp13":" ","emsp14":" ","emsp":" ","ENG":"Ŋ","eng":"ŋ","ensp":" ","Eogon":"Ę","eogon":"ę","Eopf":"𝔼","eopf":"𝕖","epar":"⋕","eparsl":"⧣","eplus":"⩱","epsi":"ε","Epsilon":"Ε","epsilon":"ε","epsiv":"ϵ","eqcirc":"≖","eqcolon":"≕","eqsim":"≂","eqslantgtr":"⪖","eqslantless":"⪕","Equal":"⩵","equals":"=","EqualTilde":"≂","equest":"≟","Equilibrium":"⇌","equiv":"≡","equivDD":"⩸","eqvparsl":"⧥","erarr":"⥱","erDot":"≓","escr":"ℯ","Escr":"ℰ","esdot":"≐","Esim":"⩳","esim":"≂","Eta":"Η","eta":"η","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","euro":"€","excl":"!","exist":"∃","Exists":"∃","expectation":"ℰ","exponentiale":"ⅇ","ExponentialE":"ⅇ","fallingdotseq":"≒","Fcy":"Ф","fcy":"ф","female":"♀","ffilig":"ﬃ","fflig":"ﬀ","ffllig":"ﬄ","Ffr":"𝔉","ffr":"𝔣","filig":"ﬁ","FilledSmallSquare":"◼","FilledVerySmallSquare":"▪","fjlig":"fj","flat":"♭","fllig":"ﬂ","fltns":"▱","fnof":"ƒ","Fopf":"𝔽","fopf":"𝕗","forall":"∀","ForAll":"∀","fork":"⋔","forkv":"⫙","Fouriertrf":"ℱ","fpartint":"⨍","frac12":"½","frac13":"⅓","frac14":"¼","frac15":"⅕","frac16":"⅙","frac18":"⅛","frac23":"⅔","frac25":"⅖","frac34":"¾","frac35":"⅗","frac38":"⅜","frac45":"⅘","frac56":"⅚","frac58":"⅝","frac78":"⅞","frasl":"⁄","frown":"⌢","fscr":"𝒻","Fscr":"ℱ","gacute":"ǵ","Gamma":"Γ","gamma":"γ","Gammad":"Ϝ","gammad":"ϝ","gap":"⪆","Gbreve":"Ğ","gbreve":"ğ","Gcedil":"Ģ","Gcirc":"Ĝ","gcirc":"ĝ","Gcy":"Г","gcy":"г","Gdot":"Ġ","gdot":"ġ","ge":"≥","gE":"≧","gEl":"⪌","gel":"⋛","geq":"≥","geqq":"≧","geqslant":"⩾","gescc":"⪩","ges":"⩾","gesdot":"⪀","gesdoto":"⪂","gesdotol":"⪄","gesl":"⋛︀","gesles":"⪔","Gfr":"𝔊","gfr":"𝔤","gg":"≫","Gg":"⋙","ggg":"⋙","gimel":"ℷ","GJcy":"Ѓ","gjcy":"ѓ","gla":"⪥","gl":"≷","glE":"⪒","glj":"⪤","gnap":"⪊","gnapprox":"⪊","gne":"⪈","gnE":"≩","gneq":"⪈","gneqq":"≩","gnsim":"⋧","Gopf":"𝔾","gopf":"𝕘","grave":"`","GreaterEqual":"≥","GreaterEqualLess":"⋛","GreaterFullEqual":"≧","GreaterGreater":"⪢","GreaterLess":"≷","GreaterSlantEqual":"⩾","GreaterTilde":"≳","Gscr":"𝒢","gscr":"ℊ","gsim":"≳","gsime":"⪎","gsiml":"⪐","gtcc":"⪧","gtcir":"⩺","gt":">","GT":">","Gt":"≫","gtdot":"⋗","gtlPar":"⦕","gtquest":"⩼","gtrapprox":"⪆","gtrarr":"⥸","gtrdot":"⋗","gtreqless":"⋛","gtreqqless":"⪌","gtrless":"≷","gtrsim":"≳","gvertneqq":"≩︀","gvnE":"≩︀","Hacek":"ˇ","hairsp":" ","half":"½","hamilt":"ℋ","HARDcy":"Ъ","hardcy":"ъ","harrcir":"⥈","harr":"↔","hArr":"⇔","harrw":"↭","Hat":"^","hbar":"ℏ","Hcirc":"Ĥ","hcirc":"ĥ","hearts":"♥","heartsuit":"♥","hellip":"…","hercon":"⊹","hfr":"𝔥","Hfr":"ℌ","HilbertSpace":"ℋ","hksearow":"⤥","hkswarow":"⤦","hoarr":"⇿","homtht":"∻","hookleftarrow":"↩","hookrightarrow":"↪","hopf":"𝕙","Hopf":"ℍ","horbar":"―","HorizontalLine":"─","hscr":"𝒽","Hscr":"ℋ","hslash":"ℏ","Hstrok":"Ħ","hstrok":"ħ","HumpDownHump":"≎","HumpEqual":"≏","hybull":"⁃","hyphen":"‐","Iacute":"Í","iacute":"í","ic":"⁣","Icirc":"Î","icirc":"î","Icy":"И","icy":"и","Idot":"İ","IEcy":"Е","iecy":"е","iexcl":"¡","iff":"⇔","ifr":"𝔦","Ifr":"ℑ","Igrave":"Ì","igrave":"ì","ii":"ⅈ","iiiint":"⨌","iiint":"∭","iinfin":"⧜","iiota":"℩","IJlig":"Ĳ","ijlig":"ĳ","Imacr":"Ī","imacr":"ī","image":"ℑ","ImaginaryI":"ⅈ","imagline":"ℐ","imagpart":"ℑ","imath":"ı","Im":"ℑ","imof":"⊷","imped":"Ƶ","Implies":"⇒","incare":"℅","in":"∈","infin":"∞","infintie":"⧝","inodot":"ı","intcal":"⊺","int":"∫","Int":"∬","integers":"ℤ","Integral":"∫","intercal":"⊺","Intersection":"⋂","intlarhk":"⨗","intprod":"⨼","InvisibleComma":"⁣","InvisibleTimes":"⁢","IOcy":"Ё","iocy":"ё","Iogon":"Į","iogon":"į","Iopf":"𝕀","iopf":"𝕚","Iota":"Ι","iota":"ι","iprod":"⨼","iquest":"¿","iscr":"𝒾","Iscr":"ℐ","isin":"∈","isindot":"⋵","isinE":"⋹","isins":"⋴","isinsv":"⋳","isinv":"∈","it":"⁢","Itilde":"Ĩ","itilde":"ĩ","Iukcy":"І","iukcy":"і","Iuml":"Ï","iuml":"ï","Jcirc":"Ĵ","jcirc":"ĵ","Jcy":"Й","jcy":"й","Jfr":"𝔍","jfr":"𝔧","jmath":"ȷ","Jopf":"𝕁","jopf":"𝕛","Jscr":"𝒥","jscr":"𝒿","Jsercy":"Ј","jsercy":"ј","Jukcy":"Є","jukcy":"є","Kappa":"Κ","kappa":"κ","kappav":"ϰ","Kcedil":"Ķ","kcedil":"ķ","Kcy":"К","kcy":"к","Kfr":"𝔎","kfr":"𝔨","kgreen":"ĸ","KHcy":"Х","khcy":"х","KJcy":"Ќ","kjcy":"ќ","Kopf":"𝕂","kopf":"𝕜","Kscr":"𝒦","kscr":"𝓀","lAarr":"⇚","Lacute":"Ĺ","lacute":"ĺ","laemptyv":"⦴","lagran":"ℒ","Lambda":"Λ","lambda":"λ","lang":"⟨","Lang":"⟪","langd":"⦑","langle":"⟨","lap":"⪅","Laplacetrf":"ℒ","laquo":"«","larrb":"⇤","larrbfs":"⤟","larr":"←","Larr":"↞","lArr":"⇐","larrfs":"⤝","larrhk":"↩","larrlp":"↫","larrpl":"⤹","larrsim":"⥳","larrtl":"↢","latail":"⤙","lAtail":"⤛","lat":"⪫","late":"⪭","lates":"⪭︀","lbarr":"⤌","lBarr":"⤎","lbbrk":"❲","lbrace":"{","lbrack":"[","lbrke":"⦋","lbrksld":"⦏","lbrkslu":"⦍","Lcaron":"Ľ","lcaron":"ľ","Lcedil":"Ļ","lcedil":"ļ","lceil":"⌈","lcub":"{","Lcy":"Л","lcy":"л","ldca":"⤶","ldquo":"“","ldquor":"„","ldrdhar":"⥧","ldrushar":"⥋","ldsh":"↲","le":"≤","lE":"≦","LeftAngleBracket":"⟨","LeftArrowBar":"⇤","leftarrow":"←","LeftArrow":"←","Leftarrow":"⇐","LeftArrowRightArrow":"⇆","leftarrowtail":"↢","LeftCeiling":"⌈","LeftDoubleBracket":"⟦","LeftDownTeeVector":"⥡","LeftDownVectorBar":"⥙","LeftDownVector":"⇃","LeftFloor":"⌊","leftharpoondown":"↽","leftharpoonup":"↼","leftleftarrows":"⇇","leftrightarrow":"↔","LeftRightArrow":"↔","Leftrightarrow":"⇔","leftrightarrows":"⇆","leftrightharpoons":"⇋","leftrightsquigarrow":"↭","LeftRightVector":"⥎","LeftTeeArrow":"↤","LeftTee":"⊣","LeftTeeVector":"⥚","leftthreetimes":"⋋","LeftTriangleBar":"⧏","LeftTriangle":"⊲","LeftTriangleEqual":"⊴","LeftUpDownVector":"⥑","LeftUpTeeVector":"⥠","LeftUpVectorBar":"⥘","LeftUpVector":"↿","LeftVectorBar":"⥒","LeftVector":"↼","lEg":"⪋","leg":"⋚","leq":"≤","leqq":"≦","leqslant":"⩽","lescc":"⪨","les":"⩽","lesdot":"⩿","lesdoto":"⪁","lesdotor":"⪃","lesg":"⋚︀","lesges":"⪓","lessapprox":"⪅","lessdot":"⋖","lesseqgtr":"⋚","lesseqqgtr":"⪋","LessEqualGreater":"⋚","LessFullEqual":"≦","LessGreater":"≶","lessgtr":"≶","LessLess":"⪡","lesssim":"≲","LessSlantEqual":"⩽","LessTilde":"≲","lfisht":"⥼","lfloor":"⌊","Lfr":"𝔏","lfr":"𝔩","lg":"≶","lgE":"⪑","lHar":"⥢","lhard":"↽","lharu":"↼","lharul":"⥪","lhblk":"▄","LJcy":"Љ","ljcy":"љ","llarr":"⇇","ll":"≪","Ll":"⋘","llcorner":"⌞","Lleftarrow":"⇚","llhard":"⥫","lltri":"◺","Lmidot":"Ŀ","lmidot":"ŀ","lmoustache":"⎰","lmoust":"⎰","lnap":"⪉","lnapprox":"⪉","lne":"⪇","lnE":"≨","lneq":"⪇","lneqq":"≨","lnsim":"⋦","loang":"⟬","loarr":"⇽","lobrk":"⟦","longleftarrow":"⟵","LongLeftArrow":"⟵","Longleftarrow":"⟸","longleftrightarrow":"⟷","LongLeftRightArrow":"⟷","Longleftrightarrow":"⟺","longmapsto":"⟼","longrightarrow":"⟶","LongRightArrow":"⟶","Longrightarrow":"⟹","looparrowleft":"↫","looparrowright":"↬","lopar":"⦅","Lopf":"𝕃","lopf":"𝕝","loplus":"⨭","lotimes":"⨴","lowast":"∗","lowbar":"_","LowerLeftArrow":"↙","LowerRightArrow":"↘","loz":"◊","lozenge":"◊","lozf":"⧫","lpar":"(","lparlt":"⦓","lrarr":"⇆","lrcorner":"⌟","lrhar":"⇋","lrhard":"⥭","lrm":"‎","lrtri":"⊿","lsaquo":"‹","lscr":"𝓁","Lscr":"ℒ","lsh":"↰","Lsh":"↰","lsim":"≲","lsime":"⪍","lsimg":"⪏","lsqb":"[","lsquo":"‘","lsquor":"‚","Lstrok":"Ł","lstrok":"ł","ltcc":"⪦","ltcir":"⩹","lt":"<","LT":"<","Lt":"≪","ltdot":"⋖","lthree":"⋋","ltimes":"⋉","ltlarr":"⥶","ltquest":"⩻","ltri":"◃","ltrie":"⊴","ltrif":"◂","ltrPar":"⦖","lurdshar":"⥊","luruhar":"⥦","lvertneqq":"≨︀","lvnE":"≨︀","macr":"¯","male":"♂","malt":"✠","maltese":"✠","Map":"⤅","map":"↦","mapsto":"↦","mapstodown":"↧","mapstoleft":"↤","mapstoup":"↥","marker":"▮","mcomma":"⨩","Mcy":"М","mcy":"м","mdash":"—","mDDot":"∺","measuredangle":"∡","MediumSpace":" ","Mellintrf":"ℳ","Mfr":"𝔐","mfr":"𝔪","mho":"℧","micro":"µ","midast":"*","midcir":"⫰","mid":"∣","middot":"·","minusb":"⊟","minus":"−","minusd":"∸","minusdu":"⨪","MinusPlus":"∓","mlcp":"⫛","mldr":"…","mnplus":"∓","models":"⊧","Mopf":"𝕄","mopf":"𝕞","mp":"∓","mscr":"𝓂","Mscr":"ℳ","mstpos":"∾","Mu":"Μ","mu":"μ","multimap":"⊸","mumap":"⊸","nabla":"∇","Nacute":"Ń","nacute":"ń","nang":"∠⃒","nap":"≉","napE":"⩰̸","napid":"≋̸","napos":"ŉ","napprox":"≉","natural":"♮","naturals":"ℕ","natur":"♮","nbsp":" ","nbump":"≎̸","nbumpe":"≏̸","ncap":"⩃","Ncaron":"Ň","ncaron":"ň","Ncedil":"Ņ","ncedil":"ņ","ncong":"≇","ncongdot":"⩭̸","ncup":"⩂","Ncy":"Н","ncy":"н","ndash":"–","nearhk":"⤤","nearr":"↗","neArr":"⇗","nearrow":"↗","ne":"≠","nedot":"≐̸","NegativeMediumSpace":"​","NegativeThickSpace":"​","NegativeThinSpace":"​","NegativeVeryThinSpace":"​","nequiv":"≢","nesear":"⤨","nesim":"≂̸","NestedGreaterGreater":"≫","NestedLessLess":"≪","NewLine":"\\n","nexist":"∄","nexists":"∄","Nfr":"𝔑","nfr":"𝔫","ngE":"≧̸","nge":"≱","ngeq":"≱","ngeqq":"≧̸","ngeqslant":"⩾̸","nges":"⩾̸","nGg":"⋙̸","ngsim":"≵","nGt":"≫⃒","ngt":"≯","ngtr":"≯","nGtv":"≫̸","nharr":"↮","nhArr":"⇎","nhpar":"⫲","ni":"∋","nis":"⋼","nisd":"⋺","niv":"∋","NJcy":"Њ","njcy":"њ","nlarr":"↚","nlArr":"⇍","nldr":"‥","nlE":"≦̸","nle":"≰","nleftarrow":"↚","nLeftarrow":"⇍","nleftrightarrow":"↮","nLeftrightarrow":"⇎","nleq":"≰","nleqq":"≦̸","nleqslant":"⩽̸","nles":"⩽̸","nless":"≮","nLl":"⋘̸","nlsim":"≴","nLt":"≪⃒","nlt":"≮","nltri":"⋪","nltrie":"⋬","nLtv":"≪̸","nmid":"∤","NoBreak":"⁠","NonBreakingSpace":" ","nopf":"𝕟","Nopf":"ℕ","Not":"⫬","not":"¬","NotCongruent":"≢","NotCupCap":"≭","NotDoubleVerticalBar":"∦","NotElement":"∉","NotEqual":"≠","NotEqualTilde":"≂̸","NotExists":"∄","NotGreater":"≯","NotGreaterEqual":"≱","NotGreaterFullEqual":"≧̸","NotGreaterGreater":"≫̸","NotGreaterLess":"≹","NotGreaterSlantEqual":"⩾̸","NotGreaterTilde":"≵","NotHumpDownHump":"≎̸","NotHumpEqual":"≏̸","notin":"∉","notindot":"⋵̸","notinE":"⋹̸","notinva":"∉","notinvb":"⋷","notinvc":"⋶","NotLeftTriangleBar":"⧏̸","NotLeftTriangle":"⋪","NotLeftTriangleEqual":"⋬","NotLess":"≮","NotLessEqual":"≰","NotLessGreater":"≸","NotLessLess":"≪̸","NotLessSlantEqual":"⩽̸","NotLessTilde":"≴","NotNestedGreaterGreater":"⪢̸","NotNestedLessLess":"⪡̸","notni":"∌","notniva":"∌","notnivb":"⋾","notnivc":"⋽","NotPrecedes":"⊀","NotPrecedesEqual":"⪯̸","NotPrecedesSlantEqual":"⋠","NotReverseElement":"∌","NotRightTriangleBar":"⧐̸","NotRightTriangle":"⋫","NotRightTriangleEqual":"⋭","NotSquareSubset":"⊏̸","NotSquareSubsetEqual":"⋢","NotSquareSuperset":"⊐̸","NotSquareSupersetEqual":"⋣","NotSubset":"⊂⃒","NotSubsetEqual":"⊈","NotSucceeds":"⊁","NotSucceedsEqual":"⪰̸","NotSucceedsSlantEqual":"⋡","NotSucceedsTilde":"≿̸","NotSuperset":"⊃⃒","NotSupersetEqual":"⊉","NotTilde":"≁","NotTildeEqual":"≄","NotTildeFullEqual":"≇","NotTildeTilde":"≉","NotVerticalBar":"∤","nparallel":"∦","npar":"∦","nparsl":"⫽⃥","npart":"∂̸","npolint":"⨔","npr":"⊀","nprcue":"⋠","nprec":"⊀","npreceq":"⪯̸","npre":"⪯̸","nrarrc":"⤳̸","nrarr":"↛","nrArr":"⇏","nrarrw":"↝̸","nrightarrow":"↛","nRightarrow":"⇏","nrtri":"⋫","nrtrie":"⋭","nsc":"⊁","nsccue":"⋡","nsce":"⪰̸","Nscr":"𝒩","nscr":"𝓃","nshortmid":"∤","nshortparallel":"∦","nsim":"≁","nsime":"≄","nsimeq":"≄","nsmid":"∤","nspar":"∦","nsqsube":"⋢","nsqsupe":"⋣","nsub":"⊄","nsubE":"⫅̸","nsube":"⊈","nsubset":"⊂⃒","nsubseteq":"⊈","nsubseteqq":"⫅̸","nsucc":"⊁","nsucceq":"⪰̸","nsup":"⊅","nsupE":"⫆̸","nsupe":"⊉","nsupset":"⊃⃒","nsupseteq":"⊉","nsupseteqq":"⫆̸","ntgl":"≹","Ntilde":"Ñ","ntilde":"ñ","ntlg":"≸","ntriangleleft":"⋪","ntrianglelefteq":"⋬","ntriangleright":"⋫","ntrianglerighteq":"⋭","Nu":"Ν","nu":"ν","num":"#","numero":"№","numsp":" ","nvap":"≍⃒","nvdash":"⊬","nvDash":"⊭","nVdash":"⊮","nVDash":"⊯","nvge":"≥⃒","nvgt":">⃒","nvHarr":"⤄","nvinfin":"⧞","nvlArr":"⤂","nvle":"≤⃒","nvlt":"<⃒","nvltrie":"⊴⃒","nvrArr":"⤃","nvrtrie":"⊵⃒","nvsim":"∼⃒","nwarhk":"⤣","nwarr":"↖","nwArr":"⇖","nwarrow":"↖","nwnear":"⤧","Oacute":"Ó","oacute":"ó","oast":"⊛","Ocirc":"Ô","ocirc":"ô","ocir":"⊚","Ocy":"О","ocy":"о","odash":"⊝","Odblac":"Ő","odblac":"ő","odiv":"⨸","odot":"⊙","odsold":"⦼","OElig":"Œ","oelig":"œ","ofcir":"⦿","Ofr":"𝔒","ofr":"𝔬","ogon":"˛","Ograve":"Ò","ograve":"ò","ogt":"⧁","ohbar":"⦵","ohm":"Ω","oint":"∮","olarr":"↺","olcir":"⦾","olcross":"⦻","oline":"‾","olt":"⧀","Omacr":"Ō","omacr":"ō","Omega":"Ω","omega":"ω","Omicron":"Ο","omicron":"ο","omid":"⦶","ominus":"⊖","Oopf":"𝕆","oopf":"𝕠","opar":"⦷","OpenCurlyDoubleQuote":"“","OpenCurlyQuote":"‘","operp":"⦹","oplus":"⊕","orarr":"↻","Or":"⩔","or":"∨","ord":"⩝","order":"ℴ","orderof":"ℴ","ordf":"ª","ordm":"º","origof":"⊶","oror":"⩖","orslope":"⩗","orv":"⩛","oS":"Ⓢ","Oscr":"𝒪","oscr":"ℴ","Oslash":"Ø","oslash":"ø","osol":"⊘","Otilde":"Õ","otilde":"õ","otimesas":"⨶","Otimes":"⨷","otimes":"⊗","Ouml":"Ö","ouml":"ö","ovbar":"⌽","OverBar":"‾","OverBrace":"⏞","OverBracket":"⎴","OverParenthesis":"⏜","para":"¶","parallel":"∥","par":"∥","parsim":"⫳","parsl":"⫽","part":"∂","PartialD":"∂","Pcy":"П","pcy":"п","percnt":"%","period":".","permil":"‰","perp":"⊥","pertenk":"‱","Pfr":"𝔓","pfr":"𝔭","Phi":"Φ","phi":"φ","phiv":"ϕ","phmmat":"ℳ","phone":"☎","Pi":"Π","pi":"π","pitchfork":"⋔","piv":"ϖ","planck":"ℏ","planckh":"ℎ","plankv":"ℏ","plusacir":"⨣","plusb":"⊞","pluscir":"⨢","plus":"+","plusdo":"∔","plusdu":"⨥","pluse":"⩲","PlusMinus":"±","plusmn":"±","plussim":"⨦","plustwo":"⨧","pm":"±","Poincareplane":"ℌ","pointint":"⨕","popf":"𝕡","Popf":"ℙ","pound":"£","prap":"⪷","Pr":"⪻","pr":"≺","prcue":"≼","precapprox":"⪷","prec":"≺","preccurlyeq":"≼","Precedes":"≺","PrecedesEqual":"⪯","PrecedesSlantEqual":"≼","PrecedesTilde":"≾","preceq":"⪯","precnapprox":"⪹","precneqq":"⪵","precnsim":"⋨","pre":"⪯","prE":"⪳","precsim":"≾","prime":"′","Prime":"″","primes":"ℙ","prnap":"⪹","prnE":"⪵","prnsim":"⋨","prod":"∏","Product":"∏","profalar":"⌮","profline":"⌒","profsurf":"⌓","prop":"∝","Proportional":"∝","Proportion":"∷","propto":"∝","prsim":"≾","prurel":"⊰","Pscr":"𝒫","pscr":"𝓅","Psi":"Ψ","psi":"ψ","puncsp":" ","Qfr":"𝔔","qfr":"𝔮","qint":"⨌","qopf":"𝕢","Qopf":"ℚ","qprime":"⁗","Qscr":"𝒬","qscr":"𝓆","quaternions":"ℍ","quatint":"⨖","quest":"?","questeq":"≟","quot":"\\"","QUOT":"\\"","rAarr":"⇛","race":"∽̱","Racute":"Ŕ","racute":"ŕ","radic":"√","raemptyv":"⦳","rang":"⟩","Rang":"⟫","rangd":"⦒","range":"⦥","rangle":"⟩","raquo":"»","rarrap":"⥵","rarrb":"⇥","rarrbfs":"⤠","rarrc":"⤳","rarr":"→","Rarr":"↠","rArr":"⇒","rarrfs":"⤞","rarrhk":"↪","rarrlp":"↬","rarrpl":"⥅","rarrsim":"⥴","Rarrtl":"⤖","rarrtl":"↣","rarrw":"↝","ratail":"⤚","rAtail":"⤜","ratio":"∶","rationals":"ℚ","rbarr":"⤍","rBarr":"⤏","RBarr":"⤐","rbbrk":"❳","rbrace":"}","rbrack":"]","rbrke":"⦌","rbrksld":"⦎","rbrkslu":"⦐","Rcaron":"Ř","rcaron":"ř","Rcedil":"Ŗ","rcedil":"ŗ","rceil":"⌉","rcub":"}","Rcy":"Р","rcy":"р","rdca":"⤷","rdldhar":"⥩","rdquo":"”","rdquor":"”","rdsh":"↳","real":"ℜ","realine":"ℛ","realpart":"ℜ","reals":"ℝ","Re":"ℜ","rect":"▭","reg":"®","REG":"®","ReverseElement":"∋","ReverseEquilibrium":"⇋","ReverseUpEquilibrium":"⥯","rfisht":"⥽","rfloor":"⌋","rfr":"𝔯","Rfr":"ℜ","rHar":"⥤","rhard":"⇁","rharu":"⇀","rharul":"⥬","Rho":"Ρ","rho":"ρ","rhov":"ϱ","RightAngleBracket":"⟩","RightArrowBar":"⇥","rightarrow":"→","RightArrow":"→","Rightarrow":"⇒","RightArrowLeftArrow":"⇄","rightarrowtail":"↣","RightCeiling":"⌉","RightDoubleBracket":"⟧","RightDownTeeVector":"⥝","RightDownVectorBar":"⥕","RightDownVector":"⇂","RightFloor":"⌋","rightharpoondown":"⇁","rightharpoonup":"⇀","rightleftarrows":"⇄","rightleftharpoons":"⇌","rightrightarrows":"⇉","rightsquigarrow":"↝","RightTeeArrow":"↦","RightTee":"⊢","RightTeeVector":"⥛","rightthreetimes":"⋌","RightTriangleBar":"⧐","RightTriangle":"⊳","RightTriangleEqual":"⊵","RightUpDownVector":"⥏","RightUpTeeVector":"⥜","RightUpVectorBar":"⥔","RightUpVector":"↾","RightVectorBar":"⥓","RightVector":"⇀","ring":"˚","risingdotseq":"≓","rlarr":"⇄","rlhar":"⇌","rlm":"‏","rmoustache":"⎱","rmoust":"⎱","rnmid":"⫮","roang":"⟭","roarr":"⇾","robrk":"⟧","ropar":"⦆","ropf":"𝕣","Ropf":"ℝ","roplus":"⨮","rotimes":"⨵","RoundImplies":"⥰","rpar":")","rpargt":"⦔","rppolint":"⨒","rrarr":"⇉","Rrightarrow":"⇛","rsaquo":"›","rscr":"𝓇","Rscr":"ℛ","rsh":"↱","Rsh":"↱","rsqb":"]","rsquo":"’","rsquor":"’","rthree":"⋌","rtimes":"⋊","rtri":"▹","rtrie":"⊵","rtrif":"▸","rtriltri":"⧎","RuleDelayed":"⧴","ruluhar":"⥨","rx":"℞","Sacute":"Ś","sacute":"ś","sbquo":"‚","scap":"⪸","Scaron":"Š","scaron":"š","Sc":"⪼","sc":"≻","sccue":"≽","sce":"⪰","scE":"⪴","Scedil":"Ş","scedil":"ş","Scirc":"Ŝ","scirc":"ŝ","scnap":"⪺","scnE":"⪶","scnsim":"⋩","scpolint":"⨓","scsim":"≿","Scy":"С","scy":"с","sdotb":"⊡","sdot":"⋅","sdote":"⩦","searhk":"⤥","searr":"↘","seArr":"⇘","searrow":"↘","sect":"§","semi":";","seswar":"⤩","setminus":"∖","setmn":"∖","sext":"✶","Sfr":"𝔖","sfr":"𝔰","sfrown":"⌢","sharp":"♯","SHCHcy":"Щ","shchcy":"щ","SHcy":"Ш","shcy":"ш","ShortDownArrow":"↓","ShortLeftArrow":"←","shortmid":"∣","shortparallel":"∥","ShortRightArrow":"→","ShortUpArrow":"↑","shy":"­","Sigma":"Σ","sigma":"σ","sigmaf":"ς","sigmav":"ς","sim":"∼","simdot":"⩪","sime":"≃","simeq":"≃","simg":"⪞","simgE":"⪠","siml":"⪝","simlE":"⪟","simne":"≆","simplus":"⨤","simrarr":"⥲","slarr":"←","SmallCircle":"∘","smallsetminus":"∖","smashp":"⨳","smeparsl":"⧤","smid":"∣","smile":"⌣","smt":"⪪","smte":"⪬","smtes":"⪬︀","SOFTcy":"Ь","softcy":"ь","solbar":"⌿","solb":"⧄","sol":"/","Sopf":"𝕊","sopf":"𝕤","spades":"♠","spadesuit":"♠","spar":"∥","sqcap":"⊓","sqcaps":"⊓︀","sqcup":"⊔","sqcups":"⊔︀","Sqrt":"√","sqsub":"⊏","sqsube":"⊑","sqsubset":"⊏","sqsubseteq":"⊑","sqsup":"⊐","sqsupe":"⊒","sqsupset":"⊐","sqsupseteq":"⊒","square":"□","Square":"□","SquareIntersection":"⊓","SquareSubset":"⊏","SquareSubsetEqual":"⊑","SquareSuperset":"⊐","SquareSupersetEqual":"⊒","SquareUnion":"⊔","squarf":"▪","squ":"□","squf":"▪","srarr":"→","Sscr":"𝒮","sscr":"𝓈","ssetmn":"∖","ssmile":"⌣","sstarf":"⋆","Star":"⋆","star":"☆","starf":"★","straightepsilon":"ϵ","straightphi":"ϕ","strns":"¯","sub":"⊂","Sub":"⋐","subdot":"⪽","subE":"⫅","sube":"⊆","subedot":"⫃","submult":"⫁","subnE":"⫋","subne":"⊊","subplus":"⪿","subrarr":"⥹","subset":"⊂","Subset":"⋐","subseteq":"⊆","subseteqq":"⫅","SubsetEqual":"⊆","subsetneq":"⊊","subsetneqq":"⫋","subsim":"⫇","subsub":"⫕","subsup":"⫓","succapprox":"⪸","succ":"≻","succcurlyeq":"≽","Succeeds":"≻","SucceedsEqual":"⪰","SucceedsSlantEqual":"≽","SucceedsTilde":"≿","succeq":"⪰","succnapprox":"⪺","succneqq":"⪶","succnsim":"⋩","succsim":"≿","SuchThat":"∋","sum":"∑","Sum":"∑","sung":"♪","sup1":"¹","sup2":"²","sup3":"³","sup":"⊃","Sup":"⋑","supdot":"⪾","supdsub":"⫘","supE":"⫆","supe":"⊇","supedot":"⫄","Superset":"⊃","SupersetEqual":"⊇","suphsol":"⟉","suphsub":"⫗","suplarr":"⥻","supmult":"⫂","supnE":"⫌","supne":"⊋","supplus":"⫀","supset":"⊃","Supset":"⋑","supseteq":"⊇","supseteqq":"⫆","supsetneq":"⊋","supsetneqq":"⫌","supsim":"⫈","supsub":"⫔","supsup":"⫖","swarhk":"⤦","swarr":"↙","swArr":"⇙","swarrow":"↙","swnwar":"⤪","szlig":"ß","Tab":"\\t","target":"⌖","Tau":"Τ","tau":"τ","tbrk":"⎴","Tcaron":"Ť","tcaron":"ť","Tcedil":"Ţ","tcedil":"ţ","Tcy":"Т","tcy":"т","tdot":"⃛","telrec":"⌕","Tfr":"𝔗","tfr":"𝔱","there4":"∴","therefore":"∴","Therefore":"∴","Theta":"Θ","theta":"θ","thetasym":"ϑ","thetav":"ϑ","thickapprox":"≈","thicksim":"∼","ThickSpace":"  ","ThinSpace":" ","thinsp":" ","thkap":"≈","thksim":"∼","THORN":"Þ","thorn":"þ","tilde":"˜","Tilde":"∼","TildeEqual":"≃","TildeFullEqual":"≅","TildeTilde":"≈","timesbar":"⨱","timesb":"⊠","times":"×","timesd":"⨰","tint":"∭","toea":"⤨","topbot":"⌶","topcir":"⫱","top":"⊤","Topf":"𝕋","topf":"𝕥","topfork":"⫚","tosa":"⤩","tprime":"‴","trade":"™","TRADE":"™","triangle":"▵","triangledown":"▿","triangleleft":"◃","trianglelefteq":"⊴","triangleq":"≜","triangleright":"▹","trianglerighteq":"⊵","tridot":"◬","trie":"≜","triminus":"⨺","TripleDot":"⃛","triplus":"⨹","trisb":"⧍","tritime":"⨻","trpezium":"⏢","Tscr":"𝒯","tscr":"𝓉","TScy":"Ц","tscy":"ц","TSHcy":"Ћ","tshcy":"ћ","Tstrok":"Ŧ","tstrok":"ŧ","twixt":"≬","twoheadleftarrow":"↞","twoheadrightarrow":"↠","Uacute":"Ú","uacute":"ú","uarr":"↑","Uarr":"↟","uArr":"⇑","Uarrocir":"⥉","Ubrcy":"Ў","ubrcy":"ў","Ubreve":"Ŭ","ubreve":"ŭ","Ucirc":"Û","ucirc":"û","Ucy":"У","ucy":"у","udarr":"⇅","Udblac":"Ű","udblac":"ű","udhar":"⥮","ufisht":"⥾","Ufr":"𝔘","ufr":"𝔲","Ugrave":"Ù","ugrave":"ù","uHar":"⥣","uharl":"↿","uharr":"↾","uhblk":"▀","ulcorn":"⌜","ulcorner":"⌜","ulcrop":"⌏","ultri":"◸","Umacr":"Ū","umacr":"ū","uml":"¨","UnderBar":"_","UnderBrace":"⏟","UnderBracket":"⎵","UnderParenthesis":"⏝","Union":"⋃","UnionPlus":"⊎","Uogon":"Ų","uogon":"ų","Uopf":"𝕌","uopf":"𝕦","UpArrowBar":"⤒","uparrow":"↑","UpArrow":"↑","Uparrow":"⇑","UpArrowDownArrow":"⇅","updownarrow":"↕","UpDownArrow":"↕","Updownarrow":"⇕","UpEquilibrium":"⥮","upharpoonleft":"↿","upharpoonright":"↾","uplus":"⊎","UpperLeftArrow":"↖","UpperRightArrow":"↗","upsi":"υ","Upsi":"ϒ","upsih":"ϒ","Upsilon":"Υ","upsilon":"υ","UpTeeArrow":"↥","UpTee":"⊥","upuparrows":"⇈","urcorn":"⌝","urcorner":"⌝","urcrop":"⌎","Uring":"Ů","uring":"ů","urtri":"◹","Uscr":"𝒰","uscr":"𝓊","utdot":"⋰","Utilde":"Ũ","utilde":"ũ","utri":"▵","utrif":"▴","uuarr":"⇈","Uuml":"Ü","uuml":"ü","uwangle":"⦧","vangrt":"⦜","varepsilon":"ϵ","varkappa":"ϰ","varnothing":"∅","varphi":"ϕ","varpi":"ϖ","varpropto":"∝","varr":"↕","vArr":"⇕","varrho":"ϱ","varsigma":"ς","varsubsetneq":"⊊︀","varsubsetneqq":"⫋︀","varsupsetneq":"⊋︀","varsupsetneqq":"⫌︀","vartheta":"ϑ","vartriangleleft":"⊲","vartriangleright":"⊳","vBar":"⫨","Vbar":"⫫","vBarv":"⫩","Vcy":"В","vcy":"в","vdash":"⊢","vDash":"⊨","Vdash":"⊩","VDash":"⊫","Vdashl":"⫦","veebar":"⊻","vee":"∨","Vee":"⋁","veeeq":"≚","vellip":"⋮","verbar":"|","Verbar":"‖","vert":"|","Vert":"‖","VerticalBar":"∣","VerticalLine":"|","VerticalSeparator":"❘","VerticalTilde":"≀","VeryThinSpace":" ","Vfr":"𝔙","vfr":"𝔳","vltri":"⊲","vnsub":"⊂⃒","vnsup":"⊃⃒","Vopf":"𝕍","vopf":"𝕧","vprop":"∝","vrtri":"⊳","Vscr":"𝒱","vscr":"𝓋","vsubnE":"⫋︀","vsubne":"⊊︀","vsupnE":"⫌︀","vsupne":"⊋︀","Vvdash":"⊪","vzigzag":"⦚","Wcirc":"Ŵ","wcirc":"ŵ","wedbar":"⩟","wedge":"∧","Wedge":"⋀","wedgeq":"≙","weierp":"℘","Wfr":"𝔚","wfr":"𝔴","Wopf":"𝕎","wopf":"𝕨","wp":"℘","wr":"≀","wreath":"≀","Wscr":"𝒲","wscr":"𝓌","xcap":"⋂","xcirc":"◯","xcup":"⋃","xdtri":"▽","Xfr":"𝔛","xfr":"𝔵","xharr":"⟷","xhArr":"⟺","Xi":"Ξ","xi":"ξ","xlarr":"⟵","xlArr":"⟸","xmap":"⟼","xnis":"⋻","xodot":"⨀","Xopf":"𝕏","xopf":"𝕩","xoplus":"⨁","xotime":"⨂","xrarr":"⟶","xrArr":"⟹","Xscr":"𝒳","xscr":"𝓍","xsqcup":"⨆","xuplus":"⨄","xutri":"△","xvee":"⋁","xwedge":"⋀","Yacute":"Ý","yacute":"ý","YAcy":"Я","yacy":"я","Ycirc":"Ŷ","ycirc":"ŷ","Ycy":"Ы","ycy":"ы","yen":"¥","Yfr":"𝔜","yfr":"𝔶","YIcy":"Ї","yicy":"ї","Yopf":"𝕐","yopf":"𝕪","Yscr":"𝒴","yscr":"𝓎","YUcy":"Ю","yucy":"ю","yuml":"ÿ","Yuml":"Ÿ","Zacute":"Ź","zacute":"ź","Zcaron":"Ž","zcaron":"ž","Zcy":"З","zcy":"з","Zdot":"Ż","zdot":"ż","zeetrf":"ℨ","ZeroWidthSpace":"​","Zeta":"Ζ","zeta":"ζ","zfr":"𝔷","Zfr":"ℨ","ZHcy":"Ж","zhcy":"ж","zigrarr":"⇝","zopf":"𝕫","Zopf":"ℤ","Zscr":"𝒵","zscr":"𝓏","zwj":"‍","zwnj":"‌"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
    /******/
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
            /******/      id: moduleId,
            /******/      loaded: false,
/******/ 			exports: {}
/******/ 		};
        /******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
        /******/
        /******/ 		// Flag the module as loaded
        /******/
        module.loaded = true;
        /******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

    /******/
/************************************************************************/
    /******/ 	/* webpack/runtime/node module decorator */
    /******/
    (() => {
        /******/
        __nccwpck_require__.nmd = (module) => {
            /******/
            module.paths = [];
            /******/
            if (!module.children) module.children = [];
            /******/
            return module;
            /******/
        };
        /******/
    })();
    /******/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/**
 * The entrypoint for the action.
 */
const { run } = __nccwpck_require__(1713)

run()

})();

module.exports = __webpack_exports__;
/******/ })()
;