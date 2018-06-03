/** @babel */

import * as formatter from './formatter'
const {CompositeDisposable} = require('atom')

const PrettyJSON = {
  config: {
    notifyOnParseError: {
      type: 'boolean',
      default: true
    },
    prettifyOnSaveJSON: {
      type: 'boolean',
      default: false,
      title: 'Prettify On Save JSON'
    },
    grammars: {
      type: 'array',
      default: ['source.json', 'text.plain.null-grammar']
    }
  },

  doEntireFile (editor) {
    const grammars = atom.config.get('pretty-json.grammars')
    if (grammars === undefined || !grammars.includes(editor.getGrammar().scopeName)) {
      return false
    }
    return editor.getLastSelection().isEmpty()
  },

  replaceText (editor, fn) {
    editor.mutateSelectedText(selection => {
      selection.getBufferRange()
      const text = selection.getText()
      selection.deleteSelectedText()
      const range = selection.insertText(fn(text))
      selection.setBufferRange(range)
    })
  },

  prettify (editor, options) {
    if (editor == null) { return }
    let pos
    const entire = ((options != null ? options.entire : undefined) != null) ? options.entire : this.doEntireFile(editor)
    const sorted = ((options != null ? options.sorted : undefined) != null) ? options.sorted : false
    const selected = ((options != null ? options.selected : undefined) != null) ? options.selected : true
    if (entire) {
      pos = editor.getCursorScreenPosition()
      editor.setText(
        formatter.pretty(editor.getText(), {
          scope: editor.getRootScopeDescriptor(),
          sorted
        })
      )
    } else {
      pos = editor.getLastSelection().getScreenRange().start
      this.replaceText(editor, text => formatter.pretty(text, {
        scope: ['source.json'],
        sorted
      }))
    }
    if (!selected) {
      editor.setCursorScreenPosition(pos)
    }
  },

  minify (editor, options) {
    let pos
    const entire = ((options != null ? options.entire : undefined) != null) ? options.entire : this.doEntireFile(editor)
    const selected = ((options != null ? options.selected : undefined) != null) ? options.selected : true
    if (entire) {
      pos = [0, 0]
      editor.setText(formatter.minify(editor.getText()))
    } else {
      pos = editor.getLastSelection().getScreenRange().start
      this.replaceText(editor, text => formatter.minify(text))
    }
    if (!selected) {
      editor.setCursorScreenPosition(pos)
    }
  },

  jsonify (editor, options) {
    let pos
    const entire = ((options != null ? options.entire : undefined) != null) ? options.entire : this.doEntireFile(editor)
    const sorted = ((options != null ? options.sorted : undefined) != null) ? options.sorted : false
    const selected = ((options != null ? options.selected : undefined) != null) ? options.selected : true
    if (entire) {
      pos = editor.getCursorScreenPosition()
      editor.setText(formatter.jsonify(editor.getText(), {
        scope: editor.getRootScopeDescriptor(),
        sorted
      }))
    } else {
      pos = editor.getLastSelection().getScreenRange().start
      this.replaceText(editor, text => formatter.jsonify(text, {
        scope: ['source.json'],
        sorted
      }))
    }
    if (!selected) {
      editor.setCursorScreenPosition(pos)
    }
  },

  activate () {
    atom.commands.add('atom-workspace', {
      'pretty-json:prettify': () => {
        const editor = atom.workspace.getActiveTextEditor()
        this.prettify(editor, {
          entire: this.doEntireFile(editor),
          sorted: false,
          selected: true
        })
      },
      'pretty-json:minify': () => {
        const editor = atom.workspace.getActiveTextEditor()
        this.minify(editor, {
          entire: this.doEntireFile(editor),
          selected: true
        })
      },
      'pretty-json:sort-and-prettify': () => {
        const editor = atom.workspace.getActiveTextEditor()
        this.prettify(editor, {
          entire: this.doEntireFile(editor),
          sorted: true,
          selected: true
        })
      },
      'pretty-json:jsonify-literal-and-prettify': () => {
        const editor = atom.workspace.getActiveTextEditor()
        this.jsonify(editor, {
          entire: this.doEntireFile(editor),
          sorted: false,
          selected: true
        })
      },
      'pretty-json:jsonify-literal-and-sort-and-prettify': () => {
        const editor = atom.workspace.getActiveTextEditor()
        this.jsonify(editor, {
          entire: this.doEntireFile(editor),
          sorted: true,
          selected: true
        })
      }
    })

    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.config.observe('pretty-json.prettifyOnSaveJSON', value => {
      if (this.saveSubscriptions != null) {
        this.saveSubscriptions.dispose()
      }
      this.saveSubscriptions = new CompositeDisposable()
      if (value) {
        this.subscribeToSaveEvents()
      }
    }))
  },

  subscribeToSaveEvents () {
    this.saveSubscriptions.add(atom.workspace.observeTextEditors(editor => {
      if (!(editor != null ? editor.getBuffer() : undefined)) { return }
      const bufferSubscriptions = new CompositeDisposable()
      bufferSubscriptions.add(editor.getBuffer().onWillSave(filePath => {
        if (this.doEntireFile(editor)) {
          return this.prettify(editor, {
            entire: true,
            sorted: false,
            selected: false
          })
        }
      }))
      bufferSubscriptions.add(editor.getBuffer().onDidDestroy(() => bufferSubscriptions.dispose()))
      this.saveSubscriptions.add(bufferSubscriptions)
    }))
  },

  deactivate () {
    if (this.subscriptions != null) {
      this.subscriptions.dispose()
    }
    this.subscriptions = null
  }
}

module.exports = PrettyJSON
