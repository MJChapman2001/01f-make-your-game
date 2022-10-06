import { CLASSES, ROTATION } from './constants.js'

export class Board {
    constructor(DOMGrid) {
        this.grid = []
        this.DOMGrid = DOMGrid
        this.dots = 0
        this.score = 0
        this.ghostScared = false
        this.lives = 3
    }

    initBoard(layout) {
        this.grid = []
        this.DOMGrid.innerHTML = ''
        this.DOMGrid.style.cssText = `grid-template-columns: repeat(28, 20px);`

        layout.forEach((s) => {
            const div = document.createElement('div')
            div.classList.add("square", CLASSES[s])
            if (s === 8) {div.classList.add(CLASSES[2])}
            if (s === 9) {div.classList.add(CLASSES[0])}
            div.style.cssText = `width: 20px; height: 20px;`
            this.DOMGrid.appendChild(div)
            this.grid.push(div)

            if (s === 2 || s === 8) {
                this.dots++
            }
        })

        const container = document.querySelector('#container')
        var scoreDiv, livesDiv, timeDiv

        if (document.querySelector('.score') === null) {
            scoreDiv = document.createElement('div')
            scoreDiv.classList.add('score')
        } else {
            scoreDiv = document.querySelector('.score')
        }

        if (document.querySelector('.lives') === null) {
            livesDiv = document.createElement('div')
            livesDiv.classList.add('lives')
        } else {
            livesDiv = document.querySelector('.lives')
        }

        if (document.querySelector('.time') === null) {
            timeDiv = document.createElement('div')
            timeDiv.classList.add('time')
        } else {
            timeDiv = document.querySelector('.time')
        }

        scoreDiv.innerText = `Score: ${this.score}`
        container.appendChild(scoreDiv)

        livesDiv.innerText = `Lives: ${this.lives}`
        container.appendChild(livesDiv)

        timeDiv.innerText = `00:00`
        container.appendChild(timeDiv)
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

    rotate(pos, deg) {
        this.grid[pos].style.transform = `rotate(${deg}deg)`
    }

    moveChar(char) {
        if(char.shouldMove()) {
            const { nextPos, direction } = char.nextMove(this.classExists.bind(this))
            const { classRem, classAdd } = char.move()

            if (char.rotation && nextPos !== char.pos) {
                this.rotate(nextPos, ROTATION[`${char.dir}`])
                this.rotate(char.pos, 0)
            }

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

    updateLives() {
        const livesDiv = document.querySelector('.lives')
        livesDiv.innerText = `Lives: ${this.lives}`
    }

    updateTime(t) {
        var sec = Math.floor((t / 1000) % 60)
        var min = Math.floor((t / (1000 * 60)) % 60)

        min = (min < 10) ? "0" + min : min
        sec = (sec < 10) ? "0" + sec : sec

        const timeDiv = document.querySelector('.time')
        timeDiv.innerText = `${min}:${sec}`
    }

    static createBoard(DOMGrid, layout) {
        const b = new this(DOMGrid)
        b.initBoard(layout)
        return b
    }
}