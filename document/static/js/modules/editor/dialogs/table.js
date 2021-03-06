import {Dialog} from "../../common"
import {tableInsertTemplate} from "./templates"

export class TableDialog {
    constructor(editor) {
        this.editor = editor
        this.dialogEl = false
    }

    init() {
        this.insertTableDialog()
    }

    markInsertTable(cell, className) {
        this.dialog.dialogEl.querySelectorAll(`td.${className}`).forEach(el => el.classList.remove(className))
        let colCount = 1
        let countElement = cell
        while(countElement.previousElementSibling) {
            countElement = countElement.previousElementSibling
            colCount += 1
        }
        let rowCount = 1
        countElement= countElement.parentElement
        while(countElement.previousElementSibling) {
            countElement = countElement.previousElementSibling
            rowCount += 1
        }
        // add hover class.
        let rows = this.dialog.dialogEl.querySelectorAll('tr')
        for(let i=0;i<rowCount;i++) {
            let row = rows[i]
            let cols = rows[i].querySelectorAll('td')
            for(let j=0;j<colCount;j++) {
                cols[j].classList.add(className)
            }
        }
        return {colCount, rowCount}
    }

    insertTableDialog() {
        let rowCount = 1, colCount = 1
        let buttons = []
        buttons.push({
            text: gettext('Insert'),
            classes: 'fw-dark',
            click: () => {
                let table = {type: 'table', content: []}

                for (let i=0;i<rowCount;i++) {
                    let row = {type: 'table_row', content: []}
                    for (let j=0;j<colCount;j++) {
                        row.content.push({type: 'table_cell', content: [{type: 'paragraph'}]})
                    }
                    table.content.push(row)

                }
                let schema = this.editor.currentView.state.schema
                this.editor.currentView.dispatch(
                    this.editor.currentView.state.tr.replaceSelectionWith(
                        schema.nodeFromJSON(table)
                    )
                )
                this.dialog.close()
            }
        })
        buttons.push({
            type: 'cancel'
        })

        this.dialog = new Dialog({
            title: gettext('Insert table'),
            body: tableInsertTemplate(),
            width: 360,
            height: 360,
            buttons,
            onClose: () => this.editor.currentView.focus()
        })

        this.dialog.open()

        // manage hovering over table cells
        let that = this
        this.dialog.dialogEl.querySelectorAll('td').forEach(el => el.addEventListener('mouseenter', () => {
            this.markInsertTable(el, 'hover')
        }))
        this.dialog.dialogEl.querySelectorAll('td').forEach(el => el.addEventListener('mouseleave', () => {
            this.dialog.dialogEl.querySelectorAll('td.hover').forEach(mEl => mEl.classList.remove('hover'))
        }))

        this.dialog.dialogEl.querySelectorAll('td').forEach(el => el.addEventListener('click', event => {
            event.preventDefault()
            event.stopImmediatePropagation()
            let newCounts = this.markInsertTable(el, 'selected')
            rowCount = newCounts.rowCount
            colCount = newCounts.colCount
        }))

        // this.dialog.find('td').on('mousedown', function(event) {
        //     // Prevent dialog from opening a second time.
        //     event.stopImmediatePropagation()
        // })
        // this.dialog.find('td').on('click', function(event){
        //     // Prevent dialog from closing.
        //     event.preventDefault()
        //     event.stopImmediatePropagation()
        //     let newCounts = that.markInsertTable(this, 'selected')
        //     rowCount = newCounts.rowCount
        //     colCount = newCounts.colCount
        // })

    }
}
