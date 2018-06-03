'use strict';

const fs   = require('fs');
const path = require('path');
const exportParser = require('./parser/export-parser');
const importParser = require('./parser/import-parser');

module.exports = {
  parseModule,
  parseFile,
  parseContent,
};


function parseModule(moduleName, basePath, options) {
  options = Object.assign({
    entry      : 'index',
    exports    : true,
    imports    : false
  }, options, {
    sourceType : 'module',
    extension  : '.js'
  });

  if(!moduleName || !basePath || typeof options.entry !== 'string') {
    return {};
  }

  try {
    fs.accessSync(path.join(basePath, moduleName, options.entry + options.extension));
  } catch (e) {
    return {};
  }

  return {
    exports : options.exports ? exportParser.parseModule(moduleName, basePath, options) : null,
    imports : options.imports ? importParser.parseModule(moduleName, basePath, options) : null,
  };
}



function parseFile(file, options) {
  options = Object.assign({
    exports: true,
    imports: false
  }, options, {
    sourceType : 'module'
  });

  if (!file) return {};

  try {
    fs.accessSync(file);
  } catch (e) {
    return {};
  }

  return {
    exports : options.exports ? exportParser.parseFile(file, options) : null,
    imports : options.imports ? importParser.parseFile(file, options) : null,
  };
}



function parseContent(content, options) {
  options = Object.assign({
    exports: true,
    imports: false
  }, options, {
    sourceType : 'module'
  });

  return {
    exports : options.exports ? exportParser.parseContent(content, options) : null,
    imports : options.imports ? importParser.parseContent(content, options) : null,
  };
}
