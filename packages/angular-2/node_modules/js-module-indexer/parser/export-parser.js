'use strict';

const fs    = require('fs');
const path  = require('path');
const acorn = require('acorn');
const _     = require('lodash');

const exportParser = {
  options: {},
  exportDeclarations: {},

  init: function() {
    this.exportDeclarations = {
      variables: [],
      functions: [],
      specifiers: [],
    };

    if (this.options.entry.slice(-3) === this.options.extension){
      this.options.entry = this.options.entry.slice(0, -3);
    }
  },

  parseModule: function(moduleName, basePath, options) {
    this.options = options;
    this.moduleName = moduleName;
    this.basePath = basePath;
    this.init();

    const modulePath = path.join(basePath, moduleName);
    this.parse(modulePath, options.entry);

    const exportDeclarations = [];
    exportDeclarations.push(this.format(this.exportDeclarations));
    return exportDeclarations;
  },

  parseFile: function(file, options) {
    return null;
  },

  parseContent: function(text, options) {
    return null;
  },

  parse: function(basePath, location) {
    const fullPath = path.join(basePath, location + this.options.extension);

    let content;
    try {
      content = fs.readFileSync(fullPath);
    } catch (e) {
      console.log(e);
      return;
    }

    const parser = acorn.parse(content, {
      sourceType: this.options.sourceType,
    });

    _.forEach(parser.body, (node) => {
      if (node.type === 'ExportNamedDeclaration') {
        this.parseNode(node);
      } else if (node.type === 'ExportAllDeclaration') {
        this.parse(path.dirname(fullPath), node.source.value);
      }
    });
  },

  parseNode: function(node) {
    if (node.declaration) {
      if (node.declaration.type === 'VariableDeclaration') {
        this.parseVariableDeclarations(node.declaration.declarations);
      } else if (node.declaration.type === 'FunctionDeclaration') {
        this.parseFunctionDeclarations(node.declaration);
      } else {
        console.log('some other declaration found');
      }
    } else if (node.specifiers) {
      this.parseSpecifiers(node.specifiers);
    }
  },

  parseSpecifiers: function(specifiers) {
    if (!specifiers) {
      return;
    }
    this.exportDeclarations.specifiers.push(
      specifiers.map((specifier) => {
        return specifier.exported.name;
      })
    );
  },

  parseVariableDeclarations: function(declarations) {
    if (!declarations) {
      return;
    }

    this.exportDeclarations.variables.push(
      declarations.map((declaration) => {
        return declaration.id.name;
      })
    );
  },

  parseFunctionDeclarations: function(declaration) {
    if (!declaration) {
      return;
    }
    const names = [];
    // may be these not required ??
    names.push(declaration.id.name);

    this.exportDeclarations.functions.push(names);
  },


  format: function(list) {
    return {
      source   : this.moduleName,
      basePath : this.basePath,
      variables: _.reduce(list.variables, (flattened, arr) => {
                    return flattened.concat(arr);
                  }, [])
                  .map((v) => {
                    return { name: v };
                  }),
      functions: _.reduce(list.functions, (flattened, arr) => {
                    return flattened.concat(arr);
                  }, [])
                  .map((f) => {
                    return { name: f };
                  }),
      specifiers: _.reduce(list.specifiers, (flattened, arr) => {
                    return flattened.concat(arr);
                  }, [])
                  .map((s) => {
                    return { name: s };
                  }),
    };
  },

};


module.exports = exportParser;
