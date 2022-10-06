import { CLASSES, DIR } from './constants.js'

export class Ghost {
    constructor(speed, start, name) {
        this.name = name
        this.start = start
        this.pos = start
        this.dir = DIR[39]
        this.speed = speed
        this.time = 0
        this.scared = false
        this.rotation = false
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

        if (classExists(this.pos, CLASSES[8]) || classExists(this.pos, CLASSES[9])) {
            let randDir = keys[Math.floor(Math.random() * keys.length)]
            this.dir = DIR[randDir]
            nextPos = this.pos + this.dir
            
            while (classExists(nextPos, CLASSES[1]) || classExists(nextPos, CLASSES[4])) {
                randDir = keys[Math.floor(Math.random() * keys.length)]
                this.dir = DIR[randDir]
                nextPos = this.pos + this.dir
            }
        }

        if (classExists(nextPos, CLASSES[5])) {
            nextPos = 418
        } else if (classExists(nextPos, CLASSES[6])) {
            nextPos = 393
        }

        return { nextPos, direction: this.dir }
    }

    move() {
        var classRem, classAdd
        if (this.scared) {
            classRem = [CLASSES[10], 'scared']
            classAdd = [CLASSES[10], 'scared']
        } else {
            classRem = [CLASSES[10], this.name]
            classAdd = [CLASSES[10], this.name]
        }

        return { classRem, classAdd }
    }

    setPos(nextPos) {
        this.pos = nextPos
    }
}