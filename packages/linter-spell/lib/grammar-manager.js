'use babel'

import * as _ from 'lodash'
import { Disposable, CompositeDisposable } from 'atom'

export default class GrammarManager extends Disposable {
  constructor () {
    super(() => {
      this.disposables.dispose()
      this.grammars = new Set()
      this.grammarMap = new Map()
      this.checkedScopes = new Map()
    })
    this.disposables = new CompositeDisposable()
    this.grammars = new Set()
    this.grammarMap = new Map()
    this.checkedScopes = new Map()
  }

  getGrammar (textEditor) {
    return this.grammarMap.get(textEditor.getGrammar().scopeName)
  }

  getEmbeddedGrammar (scopeDescriptor) {
    let path = scopeDescriptor.getScopesArray().slice(1)
    let i = path.length
    while (i--) {
      const grammar = this.grammarMap.get(path[i])
      if (grammar) return grammar
    }
  }

  updateLanguage (textEditor) {
    const grammar = this.getGrammar(textEditor)
    if (grammar && grammar.findLanguageTags) {
      const l = grammar.findLanguageTags(textEditor)
      global.languageManager.setLanguages(textEditor, (l && l.length > 0) ? l : null, 'auto')
    }
  }

  isIgnored (scopeDescriptor) {
    let path = scopeDescriptor.getScopesArray()
    let i = path.length
    while (i--) {
      if (this.checkedScopes.has(path[i])) {
        const v = this.checkedScopes.get(path[i])
        return !(_.isFunction(v) ? v() : v)
      }
    }
    return true
  }

  consumeGrammar (grammars) {
    grammars = _.castArray(grammars)
    for (const grammar of grammars) {
      this.grammars.add(grammar)
      for (const scope of grammar.grammarScopes) {
        this.grammarMap.set(scope, grammar)
      }
      if (grammar.checkedScopes) {
        _.forEach(grammar.checkedScopes, (value, key) => this.checkedScopes.set(key, value))
      } else {
        _.forEach(grammar.grammarScopes, key => this.checkedScopes.set(key, true))
      }
    }
    let textEditor = atom.workspace.getActiveTextEditor()
    if (textEditor) global.languageManager.getLanguages(textEditor)
    // global.languageManager.updateDictionaries
    return new Disposable(() => {
      for (const grammar of grammars) {
        this.grammars.delete(grammar)
        for (const scope of grammar.grammarScopes) {
          this.grammarMap.delete(scope)
        }
        if (grammar.checkedScopes) {
          _.forEach(grammar.checkedScopes, (value, key) => this.checkedScopes.delete(key))
        } else {
          _.forEach(grammar.grammarScopes, key => this.checkedScopes.delete(key))
        }
      }
    })
  }
}
