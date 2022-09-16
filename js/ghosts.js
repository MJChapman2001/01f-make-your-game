import { CLASSES, DIR } from './constants.js'

export class Ghost {
    constructor(speed, start, name) {
        this.name = name
        this.start = start
        this.pos = start
        this.dir = DIR[39]
        this.speed = speed
        this.time = 0
    }

    shouldMove() {
        if (!this.dir) return

        if (this.time === this.speed) {
            this.time = 0
            return true
        }
        
        this.time++
    }

    nextMove(classExists) {
        let nextPos = this.pos + this.dir
        const keys = Object.keys(DIR)

        while (classExists(nextPos, CLASSES[1]) || classExists(nextPos, CLASSES[4])) {
            const randDir = keys[Math.floor(Math.random() * keys.length)]
            this.dir = DIR[randDir]
            nextPos = this.pos + this.dir
        }

        return { nextPos, direction: this.dir }
    }

    move() {
        const classRem = [CLASSES[8], this.name]
        const classAdd = [CLASSES[8], this.name]

        return { classRem, classAdd }
    }

    setPos(nextPos) {
        this.pos = nextPos
    }
}