"use strict";
exports.__esModule = true;
exports.buildIdParser = void 0;
var vite_1 = require("vite");
var qs = require("querystring");
var fs = require("fs");
var VITE_FS_PREFIX = "/@fs/";
var IS_WINDOWS = process.platform === "win32";
/**
 * posixify and remove root at start
 *
 * @param filename
 * @param normalizedRoot
 */
function normalize(filename, normalizedRoot) {
    return stripRoot((0, vite_1.normalizePath)(filename), normalizedRoot);
}
function existsInRoot(filename, root) {
    if (filename.startsWith(VITE_FS_PREFIX)) {
        return false; // vite already tagged it as out of root
    }
    return fs.existsSync(root + filename);
}
function createVirtualImportId(filename, root, type) {
    var parts = ["svelte", "type=" + type];
    if (type === "style") {
        parts.push("lang.css");
    }
    if (existsInRoot(filename, root)) {
        filename = root + filename;
    }
    else if (filename.startsWith(VITE_FS_PREFIX)) {
        filename = IS_WINDOWS
            ? filename.slice(VITE_FS_PREFIX.length) // remove /@fs/ from /@fs/C:/...
            : filename.slice(VITE_FS_PREFIX.length - 1); // remove /@fs from /@fs/home/user
    }
    // return same virtual id format as vite-plugin-vue eg ...App.svelte?svelte&type=style&lang.css
    return filename + "?" + parts.join("&");
}
function parseToSvelteRequest(id, filename, rawQuery, root, timestamp, ssr) {
    var query = qs.parse(rawQuery);
    if (query.svelte != null) {
        query.svelte = true;
    }
    var normalizedFilename = normalize(filename, root);
    var cssId = createVirtualImportId(filename, root, "style");
    return {
        id: id,
        filename: filename,
        normalizedFilename: normalizedFilename,
        cssId: cssId,
        query: query,
        timestamp: timestamp,
        ssr: ssr
    };
}
function splitId(id) {
    var parts = id.split("?", 2);
    var filename = parts[0];
    var rawQuery = parts[1];
    return { filename: filename, rawQuery: rawQuery };
}
function stripRoot(normalizedFilename, normalizedRoot) {
    return normalizedFilename.startsWith(normalizedRoot + "/")
        ? normalizedFilename.slice(normalizedRoot.length)
        : normalizedFilename;
}
function buildIdParser(options) {
    var root = options.root;
    var normalizedRoot = (0, vite_1.normalizePath)(root);
    return function (id, ssr, timestamp) {
        if (timestamp === void 0) { timestamp = Date.now(); }
        var _a = splitId(id), filename = _a.filename, rawQuery = _a.rawQuery;
        return parseToSvelteRequest(id, filename, rawQuery, normalizedRoot, timestamp, ssr);
    };
}
exports.buildIdParser = buildIdParser;
