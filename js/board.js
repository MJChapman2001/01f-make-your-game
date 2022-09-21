import { CLASSES } from './constants.js'

export class Board {
    constructor(DOMGrid) {
        this.grid = []
        this.DOMGrid = DOMGrid
        this.dots = 0
        this.score = 0
    }

    initBoard(layout) {
        this.grid = []
        this.DOMGrid.innerHTML = ''
        this.DOMGrid.style.cssText = `grid-template-columns: repeat(28, 20px);`

        layout.forEach((s) => {
            const div = document.createElement('div')
            div.classList.add("square", CLASSES[s])
            if (s == 8) {div.classList.add(CLASSES[2])}
            if (s == 9) {div.classList.add(CLASSES[0])}
            div.style.cssText = `width: 20px; height: 20px;`
            this.DOMGrid.appendChild(div)
            this.grid.push(div)

            if (s === 2) {
                this.dots++
            }
        })

        const container = document.querySelector('#container')
        const scoreDiv = document.createElement('div')
        scoreDiv.classList.add('score')
        scoreDiv.innerText = `Score: ${this.score}`
        container.appendChild(scoreDiv)
    }

    removeClasses(pos, classes) {
        this.grid[pos].classList.remove(...classes)
    }

    addClasses(pos, classes) {
        this.grid[pos].classList.add(...classes)
    }

    classExists(pos, _class) {
        return this.grid[pos].classList.contains(_class)
    }

    moveChar(char) {
        if(char.shouldMove()) {
            const { nextPos, direction } = char.nextMove(this.classExists.bind(this))
            const { classRem, classAdd } = char.move()

            this.removeClasses(char.pos, classRem)
            this.addClasses(nextPos, classAdd)
            char.setPos(nextPos)
        }
    }

    updateScore(x) {
        this.score += x
        const scoreDiv = document.querySelector('.score')
        scoreDiv.innerText = `Score: ${this.score}`
    }

    static createBoard(DOMGrid, layout) {
        const b = new this(DOMGrid)
        b.initBoard(layout)
        return b
    }
}