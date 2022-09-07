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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var utils_1 = require("./utils");
var path_1 = require("path");
var vite_1 = require("vite");
var crownImport = /^\$crown\/(.+)/;
var crownLoad = /^\0\$crown\/(.+)/;
var crownComponentsImport = "$crown/components";
var crownComponentsLoad = "\0" + crownComponentsImport;
var hydrationImport = /^(hydrate|lazy):(.+\.svelte)(?:=(\w+))?$/;
var hydrationLoad = /^\0(hydrate|lazy):(.+\.svelte)(?:=(\w+))?$/;
function generateCrownComponentsImport(paths) {
    return {
        code: "\n      const components = {\n        " + paths.map(function (path) { return "\"" + path + "\": () => import(\"" + path + "\")"; }).join() + "\n      };\n      export default components;\n    "
    };
}
function generatePatchedComponent(id, request, mode) {
    return {
        code: "\n    import Component from \"" + id + "\";\n    import { patch } from \"@crown/jewels/server/mount/utils.ts\";\n    export default patch(Component, \"" + request + "\", \"" + mode + "\")\n    "
    };
}
function vitePluginCrown() {
    var requestParser;
    var ssr;
    var dev;
    var server;
    var dynamicComponents = new Set();
    return {
        name: "vite-plugin-crown",
        configResolved: function (config) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    requestParser = (0, utils_1.buildIdParser)(config);
                    ssr = !!config.build.ssr;
                    dev = config.mode === "development";
                    return [2 /*return*/];
                });
            });
        },
        resolveId: function (id, importer, options) {
            return __awaiter(this, void 0, void 0, function () {
                var crownMatch, _, mod, matches, mode, realPath, args, resolution, path, crownComponents, matches, realPath, args, resolution;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (id === crownComponentsImport)
                                return [2 /*return*/, crownComponentsLoad];
                            crownMatch = id.match(crownImport);
                            if (!crownMatch) return [3 /*break*/, 7];
                            _ = crownMatch[0], mod = crownMatch[1];
                            if (!(mod === "navigation")) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.resolve(options.ssr
                                    ? "@crown/jewels/server/navigation.ts"
                                    : "@crown/jewels/client/navigation.ts", importer, { skipSelf: true })];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            if (!(mod === "stores")) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.resolve(options.ssr
                                    ? "@crown/jewels/server/stores/index.ts"
                                    : "@crown/jewels/client/stores/index.ts", importer, { skipSelf: true })];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4:
                            if (!(mod === "env")) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.resolve(options.ssr
                                    ? "@crown/jewels/server/env.ts"
                                    : "@crown/jewels/client/env.ts")];
                        case 5: return [2 /*return*/, _a.sent()];
                        case 6: return [2 /*return*/, null];
                        case 7:
                            if (!options.ssr) return [3 /*break*/, 10];
                            matches = id.match(hydrationImport);
                            if (!matches) return [3 /*break*/, 9];
                            mode = matches[1];
                            realPath = "/src/" + matches[2];
                            args = matches[3] || "";
                            return [4 /*yield*/, this.resolve(realPath, importer, {
                                    skipSelf: true
                                })];
                        case 8:
                            resolution = _a.sent();
                            if (resolution) {
                                path = resolution.id.replace((0, vite_1.normalizePath)((0, path_1.resolve)(process.cwd())), "");
                                if (server) {
                                    crownComponents = server.moduleGraph.idToModuleMap.get(crownComponentsLoad);
                                    if (crownComponents) {
                                        server.moduleGraph.invalidateModule(crownComponents);
                                    }
                                }
                                dynamicComponents.add(path);
                                return [2 /*return*/, { id: "\0" + mode + ":" + path + args }];
                            }
                            return [2 /*return*/, null];
                        case 9: return [3 /*break*/, 13];
                        case 10:
                            matches = id.match(hydrationImport);
                            if (!matches) return [3 /*break*/, 12];
                            realPath = "/src/" + matches[2];
                            args = matches[3] || "";
                            return [4 /*yield*/, this.resolve(realPath, importer, {
                                    skipSelf: true
                                })];
                        case 11:
                            resolution = _a.sent();
                            if (resolution) {
                                return [2 /*return*/, { id: "" + resolution.id + args }];
                            }
                            _a.label = 12;
                        case 12: return [2 /*return*/, null];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        },
        load: function (id, options) {
            return __awaiter(this, void 0, void 0, function () {
                var manifest, matches, svelteRequest, _, mode, realId;
                return __generator(this, function (_a) {
                    if (id === crownComponentsLoad) {
                        // $crown/components is a dynamically generated list of all the components that are imported using a hydration directive
                        if (dev || (options && options.ssr)) {
                            // In development we use the in-memory array generated on the server
                            return [2 /*return*/, generateCrownComponentsImport(Array.from(dynamicComponents))];
                        }
                        else {
                            manifest = require((0, path_1.resolve)("./dist/server/dynamic-components.json"));
                            return [2 /*return*/, generateCrownComponentsImport(manifest)];
                        }
                    }
                    if (options && options.ssr) {
                        matches = id.match(hydrationLoad);
                        if (matches) {
                            svelteRequest = requestParser(id, options.ssr);
                            _ = matches[0], mode = matches[1], realId = matches[2];
                            return [2 /*return*/, generatePatchedComponent(realId, (svelteRequest === null || svelteRequest === void 0 ? void 0 : svelteRequest.normalizedFilename.slice(1).replace(mode + ":", "")) || realId, mode)];
                        }
                    }
                    return [2 /*return*/];
                });
            });
        },
        generateBundle: function () {
            if (ssr) {
                this.emitFile({
                    fileName: "dynamic-components.json",
                    type: "asset",
                    source: JSON.stringify(Array.from(dynamicComponents), null, 2)
                });
            }
        },
        configureServer: function (_server) {
            server = _server;
        }
    };
}
exports["default"] = vitePluginCrown;
