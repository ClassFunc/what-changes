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

        /***/ 1514:
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
exports.getExecOutput = exports.exec = void 0;
            const string_decoder_1 = __nccwpck_require__(1576);
            const tr = __importStar(__nccwpck_require__(8159));
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
exports.exec = exec;
/**
 * Exec a command and get the output.
 * Output will be streamed to the live console.
 * Returns promise with the exit code and collected stdout and stderr
 *
 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
 * @param     options               optional exec options.  See ExecOptions
 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
 */
function getExecOutput(commandLine, args, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let stdout = '';
        let stderr = '';
        //Using string decoder covers the case where a mult-byte character is split
        const stdoutDecoder = new string_decoder_1.StringDecoder('utf8');
        const stderrDecoder = new string_decoder_1.StringDecoder('utf8');
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data) => {
            stderr += stderrDecoder.write(data);
            if (originalStdErrListener) {
                originalStdErrListener(data);
            }
        };
        const stdOutListener = (data) => {
            stdout += stdoutDecoder.write(data);
            if (originalStdoutListener) {
                originalStdoutListener(data);
            }
        };
        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
        const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        //flush any remaining characters
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
            exitCode,
            stdout,
            stderr
        };
    });
}
exports.getExecOutput = getExecOutput;
//# sourceMappingURL=exec.js.map

/***/ }),

        /***/ 8159:
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
exports.argStringToArray = exports.ToolRunner = void 0;
            const os = __importStar(__nccwpck_require__(2037));
            const events = __importStar(__nccwpck_require__(2361));
            const child = __importStar(__nccwpck_require__(2081));
            const path = __importStar(__nccwpck_require__(1017));
            const io = __importStar(__nccwpck_require__(7436));
            const ioUtil = __importStar(__nccwpck_require__(1962));
            const timers_1 = __nccwpck_require__(9512);
/* eslint-disable @typescript-eslint/unbound-method */
const IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends events.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(os.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + os.EOL.length);
                n = s.indexOf(os.EOL);
            }
            return s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
            return '';
        }
    }
    _getSpawnFileName() {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!ioUtil.isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield io.which(this.toolPath, true);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
                    return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                }
                const fileName = this._getSpawnFileName();
                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                let stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                let errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
                if (this.options.input) {
                    if (!cp.stdin) {
                        throw new Error('child process missing stdin');
                    }
                    cp.stdin.end(this.options.input);
                }
            }));
        });
    }
}
exports.ToolRunner = ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
exports.argStringToArray = argStringToArray;
class ExecState extends events.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay /
                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}
//# sourceMappingURL=toolrunner.js.map

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

        /***/ 1962:
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCmdPath = exports.tryGetExecutablePath = exports.isRooted = exports.isDirectory = exports.exists = exports.READONLY = exports.UV_FS_O_EXLOCK = exports.IS_WINDOWS = exports.unlink = exports.symlink = exports.stat = exports.rmdir = exports.rm = exports.rename = exports.readlink = exports.readdir = exports.open = exports.mkdir = exports.lstat = exports.copyFile = exports.chmod = void 0;
            const fs = __importStar(__nccwpck_require__(7147));
            const path = __importStar(__nccwpck_require__(1017));
_a = fs.promises
// export const {open} = 'fs'
, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.open = _a.open, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rm = _a.rm, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
// export const {open} = 'fs'
exports.IS_WINDOWS = process.platform === 'win32';
// See https://github.com/nodejs/node/blob/d0153aee367422d0858105abec186da4dff0a0c5/deps/uv/include/uv/win.h#L691
exports.UV_FS_O_EXLOCK = 0x10000000;
exports.READONLY = fs.constants.O_RDONLY;
function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
exports.exists = exists;
function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
exports.isDirectory = isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
exports.isRooted = isRooted;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield exports.stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = path.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield exports.stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = path.dirname(filePath);
                        const upperName = path.basename(filePath).toUpperCase();
                        for (const actualName of yield exports.readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = path.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
exports.tryGetExecutablePath = tryGetExecutablePath;
function normalizeSeparators(p) {
    p = p || '';
    if (exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
}
// Get the path of cmd.exe in windows
function getCmdPath() {
    var _a;
    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
}
exports.getCmdPath = getCmdPath;
//# sourceMappingURL=io-util.js.map

/***/ }),

        /***/ 7436:
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
exports.findInPath = exports.which = exports.mkdirP = exports.rmRF = exports.mv = exports.cp = void 0;
            const assert_1 = __nccwpck_require__(9491);
            const path = __importStar(__nccwpck_require__(1017));
            const ioUtil = __importStar(__nccwpck_require__(1962));
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield copyFile(source, newDest, force);
        }
    });
}
exports.cp = cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
exports.mv = mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Check for invalid characters
            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
            if (/[*"<>|]/.test(inputPath)) {
                throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
            }
        }
        try {
            // note if path does not exist, error is silent
            yield ioUtil.rm(inputPath, {
                force: true,
                maxRetries: 3,
                recursive: true,
                retryDelay: 300
            });
        }
        catch (err) {
            throw new Error(`File was unable to be removed ${err}`);
        }
    });
}
exports.rmRF = rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, 'a path argument must be provided');
        yield ioUtil.mkdir(fsPath, { recursive: true });
    });
}
exports.mkdirP = mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (ioUtil.IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
            return result;
        }
        const matches = yield findInPath(tool);
        if (matches && matches.length > 0) {
            return matches[0];
        }
        return '';
    });
}
exports.which = which;
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */
function findInPath(tool) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // build the list of extensions to try
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split(path.delimiter)) {
                if (extension) {
                    extensions.push(extension);
                }
            }
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if (ioUtil.isRooted(tool)) {
            const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
            if (filePath) {
                return [filePath];
            }
            return [];
        }
        // if any path separators, return empty
        if (tool.includes(path.sep)) {
            return [];
        }
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split(path.delimiter)) {
                if (p) {
                    directories.push(p);
                }
            }
        }
        // find all matches
        const matches = [];
        for (const directory of directories) {
            const filePath = yield ioUtil.tryGetExecutablePath(path.join(directory, tool), extensions);
            if (filePath) {
                matches.push(filePath);
            }
        }
        return matches;
    });
}
exports.findInPath = findInPath;
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    const copySourceDirectory = options.copySourceDirectory == null
        ? true
        : Boolean(options.copySourceDirectory);
    return { force, recursive, copySourceDirectory };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}
//# sourceMappingURL=io.js.map

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
            const { getExecOutput } = __nccwpck_require__(1514)
            const { extract } = __nccwpck_require__(221)

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
    const outType = core.getInput('output-type')

    // check outType
    if (!ValidOutputTypes.includes(outType)) {
      core.setFailed(
        `output-type ${outType} is not valid, must be one of ${ValidOutputTypes}`
      )
      return
    }

      core.info(`--> extracting pr changes for ${owner}/${repo}#${pr}`)
      core.info(`--> output type: ${outType}`)

      const commitsOutput = await getExecOutput(
        'src/query_commits.sh',
        ['-q', query, '-o', owner, '-r', repo, '-p', pr],
        {
            silent: true
        }
      )

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

            const query =
              `query ($owner: String!, $repo: String!, $pr: Int!, $endCursor: String) {
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

module.exports = {
  run
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

            /***/
        }),

        /***/ 1576:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

        /***/ 9512:
/***/ ((module) => {

"use strict";
module.exports = require("timers");

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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
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
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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