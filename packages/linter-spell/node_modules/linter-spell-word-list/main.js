'use babel'

import * as _ from 'lodash'
import jaroWinkler from 'jaro-winkler'
import { Disposable, CompositeDisposable } from 'atom'

export class WordList extends Disposable {

  constructor (options) {
    super(() => {
      this.disposables.dispose()
    })

    this.disposables = new CompositeDisposable()
    _.assign(this, { minimumJaroWinklerDistance: 0.9 }, options)

    this.provider = {
      name: this.name,
      grammarScopes: this.grammarScopes,
      checkWord: (textEditor, languages, range) => this.checkWord(textEditor, languages, range)
    }
  }

  isWordMatch (word, text) {
    return (word.startsWith('!') && text === word.substring(1)) ||
      text.toLowerCase() === word.toLowerCase()
  }

  suggestWord (word, text) {
    const caseSensitive = word.startsWith('!')
    const w = caseSensitive ? word.substring(1) : word.toLowerCase()
    if (jaroWinkler(w, caseSensitive ? text : text.toLowerCase()) >= this.minimumJaroWinklerDistance) {
      if (caseSensitive) return w
      if (_.every(text, c => c === c.toUpperCase())) return w.toUpperCase()
      if (text[0] === text[0].toUpperCase()) return w[0].toUpperCase() + w.substring(1)
      return w
    }
  }

  getWords (textEditor, languages) {
    return []
  }

  checkWord (textEditor, languages, range) {
    return new Promise((resolve) => {
      const text = textEditor.getTextInBufferRange(range)
      const words = this.getWords(textEditor, languages)

      if (_.some(words, word => this.isWordMatch(word, text))) {
        resolve({ isWord: true })
      } else {
        const result = {
          isWord: false,
          suggestions: _.filter(_.map(words, word => this.suggestWord(word, text))),
          actions: [{
            title: `Add to ${this.name} dictionary`,
            apply: () => this.addWord(textEditor, languages, text.toLowerCase())
          }]
        }
        if (text.toLowerCase() !== text) {
          result.actions.push({
            title: `Add to ${this.name} dictionary (case sensitive)`,
            apply: () => this.addWord(textEditor, languages, '!' + text)
          })
        }
        resolve(result)
      }
    })
  }

  addWord (textEditor, languages, word) {}

  provideDictionary () {
    return this.provider
  }
}

export class ConfigWordList extends WordList {

  constructor (options) {
    super(options)

    this.words = atom.config.get(this.keyPath)
    this.disposables.add(atom.config.onDidChange(this.keyPath,
      ({newValue}) => this.words = newValue))
  }

  getWords (textEditor, languages) {
    return this.words
  }

  addWord (textEditor, languages, word) {
    atom.config.set(this.keyPath, _.concat(this.words, word))
  }

}
