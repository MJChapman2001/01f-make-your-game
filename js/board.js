import { CLASSES } from './constants.js'

export class Board {
    constructor(DOMGrid) {
        this.grid = []
        this.DOMGrid = DOMGrid
    }

    initBoard(layout) {
        this.grid = []
        this.DOMGrid.innerHTML = ''
        this.DOMGrid.style.cssText = `grid-template-columns: repeat(28, 20px);`

        layout.forEach((s) => {
            const div = document.createElement('div')
            div.classList.add("square", CLASSES[s])
            div.style.cssText = `width: 20px; height: 20px;`
            this.DOMGrid.appendChild(div)
            this.grid.push(div)
        })
    }

    removeClasses(pos, classes) {
        this.grid[pos].classList.remove(...classes)
    }

    addClasses(pos, classes) {
        this.grid[pos].classList.add(...classes)
    }

    static createBoard(DOMGrid, layout) {
        const b = new this(DOMGrid)
        b.initBoard(layout)
        return b
    }
}