'use strict';

const fs    = require('fs');
const path  = require('path');
const acorn = require('acorn');
const _     = require('lodash');

const importParser = {
  options: {},
  importDeclarations: {},

  init: function() {
    this.importDeclarations = [];
  },

  parseModule: function(moduleName, basePath, options) {
    this.options = Object.assign({}, options, {
      // overrides
    });
  },

  parseFile: function(file, options) {
    const basePath = path.dirname(file);
    const fileName = path.basename(file);
    this.options = Object.assign({}, options, {
      extension : '',
      deep      : false,
    });

    this.parse(basePath, fileName);
  },


  parseContent: function(content, options) {
    this.init();
    try {
      const parser = acorn.parse(content, {
        sourceType: 'module',
      });

      _.forEach(parser.body, (node) => {
        if (node.type === 'ImportDeclaration') {
          this.parseNode(node);
        }
      });

      return this.importDeclarations;

    } catch (e) {
      alert(e);
      return;
    }
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
      if (node.type === 'ImportDeclaration') {
        this.parseNode(node);
      }
    });
  },


  parseNode: function(node) {
    if (node.specifiers) {
      this.importDeclarations.push({
        source: node.source.value,
        specifiers: this.parseSpecifiers(node.specifiers)
      });
    }
  },

  parseSpecifiers: function(specifiers) {
    if (!specifiers) {
      return;
    }
    return specifiers.map((specifier) => {
      if (specifier.type === 'ImportSpecifier') {
        return { name: specifier.imported.name, alias: specifier.local.name };
      } else if (specifier.type === 'ImportNamespaceSpecifier') {
        return { name: '*', alias: specifier.local.name };
      } else {
        return {};
      }
    });
  },



};


module.exports = importParser;
