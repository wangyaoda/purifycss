const UglifyJS = require("uglify-js");
const fs = require("fs");
const glob = require("glob");

const compressCode = code => {
    try {
        let ast = UglifyJS.parse(code);
        ast.figure_out_scope();
        let compressor = UglifyJS.Compressor({ warnings: false });
        ast = ast.transform(compressor);
        ast.figure_out_scope();
        ast.compute_char_frequency();
        ast.mangle_names({ toplevel: true });
        code = ast.print_to_string().toLowerCase();
    } catch (e) {
        // If compression fails, assume it's not a JS file and return the full code.
    }
    return code.toLowerCase();
};

const concatFiles = (files, options) =>
    files.reduce((total, file) => {
        let code = "";
        try {
            code = fs.readFileSync(file, "utf8");
            code = options.compress ? compressCode(code) : code;
        } catch (e) {
            console.warn(e.message);
        }
        return `${total}${code} `;
    }, "");

const getFilesFromPatternArray = fileArray => {
    let sourceFiles = {};
    for (let string of fileArray) {
        try {
            fs.statSync(string);
            sourceFiles[string] = true;
        } catch (e) {
            const files = glob.sync(string);
            files.forEach(file => {
                sourceFiles[file] = true;
            });
        }
    }
    return Object.keys(sourceFiles);
};

const filesToSource = (files, type) => {
    const isContent = type === "content";
    const options = { compress: isContent };
    if (Array.isArray(files)) {
        files = getFilesFromPatternArray(files);
        return concatFiles(files, options);
    }
    return isContent ? compressCode(files) : files;
};

module.exports = {
    concatFiles,
    filesToSource,
    getFilesFromPatternArray
};
