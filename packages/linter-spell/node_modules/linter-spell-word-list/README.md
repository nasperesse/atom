# linter-spell-word-list

Helper classes to assist in implementation of [linter-spell](https://atom.io/packages/linter-spell) dictionaries based on
word lists.

## Usage

To implement a dictionary which stores its word list in Atom's configuration
file use an implementation of `provideDictionary` like the following.

```javascript
provideDictionary () {
  let a = new ConfigWordList({
    name: 'Plain Text',
    keyPath: 'linter-spell.plainTextWords',
    grammarScopes: [
      'text.plain',
      'text.plain.null-grammar'
    ]
  })
  this.disposables.add(a)
  return provideDictionary()
}
```

To store the word list elsewhere you will need to derive a class from `WordList`
and implement `getWords` and `addWord` as shown below.

```javascript
class MyWordList extends WordList {
  constructor (options) {
    super(options)
    this.words = []
  }

  getWords (textEditor, languages) {
    return this.words
  }

  addWord (textEditor, languages, word) {
    this.words.push(word)
  }
}
```
