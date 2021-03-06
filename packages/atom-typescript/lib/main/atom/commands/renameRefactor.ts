import {addCommand} from "./registry"
import {commandForTypeScript, getFilePathPosition} from "../utils"
import {showRenameDialog} from "../views/renameView"

addCommand("atom-text-editor", "typescript:rename-refactor", deps => ({
  description: "Rename symbol under text cursor everywhere it is used",
  async didDispatch(e) {
    if (!commandForTypeScript(e)) {
      return
    }

    const location = getFilePathPosition(e.currentTarget.getModel())
    if (!location) {
      e.abortKeyBinding()
      return
    }
    const client = await deps.getClient(location.file)
    const response = await client.execute("rename", location)
    const {info, locs} = response.body!

    if (!info.canRename) {
      atom.notifications.addInfo("AtomTS: Rename not available at cursor location")
      return
    }

    const newName = await showRenameDialog({
      autoSelect: true,
      title: "Rename Variable",
      text: info.displayName,
      onValidate: (newText): string => {
        if (newText.replace(/\s/g, "") !== newText.trim()) {
          return "The new variable must not contain a space"
        }
        if (!newText.trim()) {
          return "If you want to abort : Press esc to exit"
        }
        return ""
      },
    })

    if (newName !== undefined) {
      await deps.applyEdits(
        locs.map(span => ({
          fileName: span.file,
          textChanges: span.locs.map(loc => ({...loc, newText: newName})),
        })),
        false,
      )
    }
  },
}))
